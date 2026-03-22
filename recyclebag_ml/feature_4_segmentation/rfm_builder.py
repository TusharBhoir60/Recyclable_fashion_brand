# feature_4_segmentation/rfm_builder.py

import pandas as pd
import numpy as np
from datetime import datetime, timezone
import yaml
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

def load_config():
    config_path = BASE_DIR / 'configs' / 'segmentation_config.yaml'
    with config_path.open() as f:
        return yaml.safe_load(f)

cfg = load_config()


def build_rfm_from_df(orders_df: pd.DataFrame,
                       snapshot_date: pd.Timestamp = None) -> pd.DataFrame:
    """
    Convert a raw orders DataFrame into an RFM table.

    orders_df MUST have these columns:
      user_id     : str   — unique user identifier
      created_at  : datetime — when the order was placed
      total_amount: float  — order value in ₹

    snapshot_date: the reference "today". Use actual today for production,
    a fixed past date for backtesting.

    Returns DataFrame with columns:
      user_id, recency, frequency, monetary
    """
    if snapshot_date is None:
        snapshot_date = pd.Timestamp.now(tz='UTC').tz_localize(None)

    # Ensure datetime column is timezone-naive for arithmetic
    orders_df = orders_df.copy()
    orders_df['created_at'] = pd.to_datetime(orders_df['created_at'])
    if orders_df['created_at'].dt.tz is not None:
        orders_df['created_at'] = orders_df['created_at'].dt.tz_localize(None)

    # Only include PAID orders — pending/cancelled don't reflect real behaviour
    if 'status' in orders_df.columns:
        orders_df = orders_df[orders_df['status'] == 'PAID']

    rfm = orders_df.groupby('user_id').agg(
        recency   = ('created_at',    lambda x: (snapshot_date - x.max()).days),
        frequency = ('user_id',       'count'),
        monetary  = ('total_amount',  'sum'),
    ).reset_index()

    # Sanity check — remove users with zero or negative values
    rfm = rfm[(rfm['recency'] >= 0) & (rfm['frequency'] > 0) & (rfm['monetary'] > 0)]

    print(f"RFM table built: {len(rfm)} customers")
    print(rfm[['recency', 'frequency', 'monetary']].describe().round(2))
    return rfm


def build_rfm_from_csv(orders_csv_path: str,
                        snapshot_date: pd.Timestamp = None) -> pd.DataFrame:
    """Convenience wrapper when working from a CSV export."""
    df = pd.read_csv(orders_csv_path, parse_dates=['created_at'])
    return build_rfm_from_df(df, snapshot_date)


def build_rfm_from_api(api_url: str, token: str,
                        snapshot_date: pd.Timestamp = None) -> pd.DataFrame:
    """
    Pull live order data from the Node.js backend.
    Called by the weekly cron job.
    """
    import httpx
    res = httpx.get(
        f"{api_url}/api/admin/orders/all",
        headers={"Authorization": f"Bearer {token}"},
        timeout=30,
    )
    res.raise_for_status()
    data = res.json()

    df = pd.DataFrame(data['orders'])
    df['created_at']   = pd.to_datetime(df['createdAt'])
    df['total_amount'] = df['totalAmount'].astype(float)
    df['user_id']      = df['userId']

    return build_rfm_from_df(df, snapshot_date)


def save_rfm(rfm: pd.DataFrame):
    output_path = Path(cfg['data']['rfm_csv'])
    if not output_path.is_absolute():
        output_path = BASE_DIR.parent / output_path

    output_path.parent.mkdir(parents=True, exist_ok=True)
    rfm.to_csv(output_path, index=False)
    print(f"Saved RFM to {output_path}")