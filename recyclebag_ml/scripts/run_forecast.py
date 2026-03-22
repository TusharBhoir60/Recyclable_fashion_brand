# scripts/run_forecast.py

"""
Usage:
  python scripts/run_forecast.py --prepare          # pull orders, build daily series
  python scripts/run_forecast.py --train            # train Prophet models
  python scripts/run_forecast.py --evaluate         # run hold-out evaluation
  python scripts/run_forecast.py --all              # prepare + train + evaluate
  python scripts/run_forecast.py --synthetic        # use fake data (development)
"""

import argparse, os, sys
import pandas as pd
import httpx

sys.path.append('feature_5_forecasting')
from preprocessor   import build_daily_series, save_series, generate_synthetic_orders
from prophet_model  import train_prophet, cross_validate_prophet
from evaluate       import evaluate_hold_out

PRODUCT_TYPES = ['BASIC', 'PREMIUM', 'CUSTOMIZED']
API_URL       = os.getenv('BACKEND_API_URL', 'http://localhost:5000')
API_TOKEN     = os.getenv('ADMIN_JWT_TOKEN', '')


def fetch_orders():
    res = httpx.get(
        f"{API_URL}/api/admin/orders/all",
        headers={"Authorization": f"Bearer {API_TOKEN}"},
        timeout=30,
    )
    res.raise_for_status()
    df = pd.DataFrame(res.json()['orders'])
    df['created_at']   = pd.to_datetime(df['createdAt'])
    df['product_type'] = df['items'].apply(
        lambda items: items[0]['product']['type'] if items else 'BASIC'
    )
    df['status'] = df['status']
    return df


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--prepare',   action='store_true')
    parser.add_argument('--train',     action='store_true')
    parser.add_argument('--evaluate',  action='store_true')
    parser.add_argument('--all',       action='store_true')
    parser.add_argument('--synthetic', action='store_true')
    args = parser.parse_args()

    if args.all:
        args.prepare = args.train = args.evaluate = True

    # Step 1 — prepare data
    if args.prepare or args.synthetic:
        if args.synthetic:
            print("Using synthetic order data...")
            orders_df = generate_synthetic_orders(n_days=180)
        else:
            print("Fetching orders from backend...")
            orders_df = fetch_orders()

        for ptype in PRODUCT_TYPES:
            series = build_daily_series(orders_df, ptype)
            if not series.empty:
                save_series(series, ptype)

    # Step 2 — train
    if args.train:
        for ptype in PRODUCT_TYPES:
            try:
                from preprocessor import load_series
                series = load_series(ptype)
                train_prophet(series, ptype)
            except FileNotFoundError:
                print(f"No data for {ptype} — skipping")

    # Step 3 — evaluate
    if args.evaluate:
        for ptype in PRODUCT_TYPES:
            try:
                from preprocessor import load_series
                series = load_series(ptype)
                if len(series) >= 30:
                    evaluate_hold_out(series, ptype, model_type='prophet')
                else:
                    print(f"Not enough data to evaluate {ptype} ({len(series)} days)")
            except FileNotFoundError:
                print(f"No data for {ptype} — skipping")


if __name__ == '__main__':
    main()

    