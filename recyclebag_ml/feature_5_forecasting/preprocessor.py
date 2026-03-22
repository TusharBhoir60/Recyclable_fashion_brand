# feature_5_forecasting/preprocessor.py

import pandas as pd
import numpy as np
from pathlib import Path
import yaml

def load_config():
    with open('feature_5_forecasting/configs/forecast_config.yaml') as f:
        return yaml.safe_load(f)

cfg = load_config()


def build_daily_series(orders_df: pd.DataFrame,
                        product_type: str,
                        snapshot_date: pd.Timestamp = None) -> pd.DataFrame:
    """
    Convert raw order records into a daily demand time series.

    orders_df columns required:
      created_at   : datetime
      product_type : str (BASIC | PREMIUM | CUSTOMIZED)
      status       : str

    Returns DataFrame with columns:
      ds : date (Prophet convention — do not rename)
      y  : daily order count

    Key decisions made here:
      1. Only PAID orders count as real demand
      2. Resample to daily frequency — days with zero orders get y=0
      3. Forward-fill only to fill gaps of 1-2 days (not longer)
    """
    if snapshot_date is None:
        snapshot_date = pd.Timestamp.now()

    df = orders_df.copy()
    df['created_at'] = pd.to_datetime(df['created_at'])

    # Only paid orders — pending/cancelled distort the signal
    df = df[df['status'] == 'PAID']
    df = df[df['product_type'] == product_type.upper()]

    if df.empty:
        print(f"No PAID orders found for {product_type}")
        return pd.DataFrame(columns=['ds', 'y'])

    # Count orders per day
    df['date'] = df['created_at'].dt.normalize()
    daily = df.groupby('date').size().reset_index(name='y')
    daily = daily.rename(columns={'date': 'ds'})
    daily['ds'] = pd.to_datetime(daily['ds'])

    # Create complete date range — fill missing days with 0
    # Missing days are real information (zero demand), not gaps to fill
    full_range = pd.date_range(
        start=daily['ds'].min(),
        end=daily['ds'].max(),
        freq='D'
    )
    daily = daily.set_index('ds').reindex(full_range, fill_value=0).reset_index()
    daily.columns = ['ds', 'y']

    # Remove future dates
    daily = daily[daily['ds'] <= snapshot_date]

    # Outlier clipping — cap extreme values at 99th percentile
    # Prevents one viral day from skewing the trend
    cap = daily['y'].quantile(0.99)
    daily['y'] = daily['y'].clip(upper=cap)

    print(f"{product_type}: {len(daily)} days | "
          f"avg={daily['y'].mean():.1f}/day | "
          f"max={daily['y'].max():.0f}/day")
    return daily


def save_series(series: pd.DataFrame, product_type: str):
    out_dir  = Path(cfg['data']['processed_dir'])
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / f"{product_type.lower()}_daily.csv"
    series.to_csv(path, index=False)
    print(f"Saved: {path}")


def load_series(product_type: str) -> pd.DataFrame:
    path = Path(cfg['data']['processed_dir']) / f"{product_type.lower()}_daily.csv"
    if not path.exists():
        raise FileNotFoundError(
            f"No series found for {product_type}. "
            f"Run scripts/run_forecast.py --prepare first."
        )
    df = pd.read_csv(path, parse_dates=['ds'])
    return df


def generate_synthetic_orders(n_days: int = 180) -> pd.DataFrame:
    """
    Bootstrap data for development — no real orders needed.
    Simulates realistic demand with trend + weekly pattern + noise.
    """
    np.random.seed(42)
    dates = pd.date_range(end=pd.Timestamp.now(), periods=n_days, freq='D')
    rows  = []

    for i, date in enumerate(dates):
        # Upward trend over time
        base_demand = 5 + i * 0.05

        # Weekly seasonality — lower on Mon/Tue, higher on Fri/Sat
        day_factor = [0.7, 0.8, 1.0, 1.1, 1.3, 1.4, 0.9][date.dayofweek]

        # Festival spike — simulate Diwali-like spike
        festival = 3.0 if 100 <= i <= 107 else 1.0

        for ptype, multiplier in [('BASIC', 1.0), ('PREMIUM', 0.6), ('CUSTOMIZED', 0.4)]:
            count = int(base_demand * day_factor * festival * multiplier
                        + np.random.poisson(1))
            for _ in range(count):
                rows.append({
                    'created_at':   date,
                    'product_type': ptype,
                    'status':       'PAID',
                    'total_amount': np.random.uniform(299, 4999),
                })

    return pd.DataFrame(rows)