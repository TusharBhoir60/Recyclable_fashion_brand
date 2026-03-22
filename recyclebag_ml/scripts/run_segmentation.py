# scripts/run_segmentation.py

"""
Run this weekly via a cron job (or manually to bootstrap).
What it does:
  1. Pull all PAID orders from the backend API
  2. Build the RFM table
  3. Run K-Means (or use saved model if --predict-only)
  4. Write segment back to each User record via the backend API
  5. Save artefacts to weights/

Usage:
  python scripts/run_segmentation.py --train     # full retrain + write back
  python scripts/run_segmentation.py --predict   # use existing model, just write back
"""

import argparse
import os
import sys
import httpx
import pandas as pd

sys.path.append('feature_4_segmentation')
from rfm_builder import build_rfm_from_df, save_rfm
from segmenter   import train, load_model
from evaluate    import cluster_profile
from predict     import predict_segment

API_URL = os.getenv('BACKEND_API_URL', 'http://localhost:5000')
API_TOKEN = os.getenv('ADMIN_JWT_TOKEN', '')   # long-lived admin token


def fetch_orders():
    print("Fetching orders from backend...")
    res = httpx.get(
        f"{API_URL}/api/admin/orders/all",
        headers={"Authorization": f"Bearer {API_TOKEN}"},
        timeout=30,
    )
    res.raise_for_status()
    raw = res.json()['orders']

    df = pd.DataFrame(raw)
    df['user_id']      = df['userId']
    df['created_at']   = pd.to_datetime(df['createdAt'])
    df['total_amount'] = df['totalAmount'].astype(float)
    df['status']       = df['status']
    print(f"Fetched {len(df)} orders from {df['user_id'].nunique()} users")
    return df


def write_segments_back(results: list[dict]):
    """
    POST each user's segment to the backend so it persists in PostgreSQL.
    The backend updates User.segment via a bulk update endpoint.
    """
    payload = [
        {'userId': r['user_id'], 'segment': r['segment']}
        for r in results
    ]
    res = httpx.post(
        f"{API_URL}/api/admin/users/segments",
        json={'segments': payload},
        headers={"Authorization": f"Bearer {API_TOKEN}"},
        timeout=30,
    )
    res.raise_for_status()
    print(f"Wrote {len(payload)} segment assignments to DB")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--train',   action='store_true',
                        help='Retrain K-Means model from scratch')
    parser.add_argument('--predict', action='store_true',
                        help='Use existing model, just assign segments')
    args = parser.parse_args()

    orders_df = fetch_orders()
    rfm       = build_rfm_from_df(orders_df)
    save_rfm(rfm)

    if args.train or not args.predict:
        print("\nTraining K-Means...")
        results = train(rfm)
        cluster_profile(results)
    else:
        print("\nUsing existing model...")
        kmeans, scaler, cluster_map = load_model()
        import numpy as np
        X        = rfm[['recency', 'frequency', 'monetary']].values
        X_scaled = scaler.transform(X)
        clusters = kmeans.predict(X_scaled)
        rfm      = rfm.copy()
        rfm['cluster'] = clusters
        rfm['segment'] = rfm['cluster'].map(cluster_map)
        results  = rfm[['user_id','recency','frequency','monetary',
                         'cluster','segment']].to_dict(orient='records')
        cluster_profile(results)

    write_segments_back(results)
    print("\nSegmentation complete.")


if __name__ == '__main__':
    main()