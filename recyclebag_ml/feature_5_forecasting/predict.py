# feature_5_forecasting/predict.py

import pandas as pd
import yaml
from preprocessor import load_series

def load_config():
    with open('feature_5_forecasting/configs/forecast_config.yaml') as f:
        return yaml.safe_load(f)

cfg = load_config()


def forecast(product_type: str, horizon: int = None) -> list[dict]:
    """
    Unified forecast interface — automatically uses the right model
    based on active_model config.

    Returns list of:
      { date, predicted, lower, upper }

    This is the only function the FastAPI router calls.
    To switch from Prophet to LSTM for a product type, just change
    active_model in the config — zero code changes needed.
    """
    if horizon is None:
        horizon = cfg['prophet']['forecast_horizon_days']

    ptype  = product_type.upper()
    model  = cfg['active_model'].get(ptype, 'prophet')
    series = load_series(ptype)

    if model == 'prophet':
        from prophet_model import forecast_prophet
        fc = forecast_prophet(ptype, horizon)
    elif model == 'lstm':
        from lstm_model import forecast_lstm
        fc = forecast_lstm(series, ptype, horizon)
    else:
        raise ValueError(f"Unknown model: {model}. Use 'prophet' or 'lstm'.")

    return [
        {
            'date':      row.ds.strftime('%Y-%m-%d'),
            'predicted': round(float(row.yhat), 1),
            'lower':     round(float(row.yhat_lower), 1),
            'upper':     round(float(row.yhat_upper), 1),
        }
        for row in fc.itertuples()
    ]


def forecast_all(horizon: int = None) -> dict:
    """Forecast all product types at once."""
    results = {}
    for ptype in cfg['product_types']:
        try:
            results[ptype] = forecast(ptype, horizon)
        except FileNotFoundError as e:
            print(f"Skipping {ptype}: {e}")
            results[ptype] = []
    return results