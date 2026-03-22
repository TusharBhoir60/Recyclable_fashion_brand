# feature_5_forecasting/prophet_model.py

import pandas as pd
import numpy as np
import pickle
from pathlib import Path
from prophet import Prophet
import yaml

def load_config():
    with open('feature_5_forecasting/configs/forecast_config.yaml') as f:
        return yaml.safe_load(f)

cfg    = load_config()
pcfg   = cfg['prophet']


def train_prophet(series: pd.DataFrame, product_type: str) -> Prophet:
    """
    Fit a Prophet model on a daily demand series.

    Prophet models demand as:
      y(t) = trend(t) + seasonality(t) + holidays(t) + error(t)

    It fits each component separately using a Bayesian approach,
    which is why it handles missing data and outliers well.

    series: DataFrame with columns ds (date) and y (demand count)
    """
    if len(series) < 14:
        raise ValueError(
            f"Need at least 14 days of data for {product_type}. "
            f"Got {len(series)}. Use synthetic data for development."
        )

    m = Prophet(
        weekly_seasonality=pcfg['weekly_seasonality'],
        yearly_seasonality=pcfg['yearly_seasonality'],
        daily_seasonality=pcfg['daily_seasonality'],
        changepoint_prior_scale=pcfg['changepoint_prior_scale'],
        seasonality_prior_scale=pcfg['seasonality_prior_scale'],
        # Demand can't be negative — use multiplicative seasonality
        # when values have a clear scale (orders scale with the trend)
        seasonality_mode='multiplicative',
    )

    # Add Indian public holidays — Diwali causes a significant demand spike
    m.add_country_holidays(country_name=pcfg['country_holidays'])

    print(f"Training Prophet for {product_type}...")
    m.fit(series)

    # Save model
    weights_dir = Path(cfg['weights']['dir'])
    weights_dir.mkdir(parents=True, exist_ok=True)
    path = weights_dir / f"prophet_{product_type.lower()}.pkl"
    with open(path, 'wb') as f:
        pickle.dump(m, f)
    print(f"Saved: {path}")

    return m


def forecast_prophet(product_type: str,
                      horizon: int = None) -> pd.DataFrame:
    """
    Load saved Prophet model and generate forecast.

    Returns DataFrame:
      ds          : date
      yhat        : predicted demand (may be fractional — round for display)
      yhat_lower  : 80% confidence lower bound
      yhat_upper  : 80% confidence upper bound
    """
    if horizon is None:
        horizon = pcfg['forecast_horizon_days']

    path = Path(cfg['weights']['dir']) / f"prophet_{product_type.lower()}.pkl"
    if not path.exists():
        raise FileNotFoundError(
            f"No Prophet model for {product_type}. "
            "Run scripts/run_forecast.py --train first."
        )

    with open(path, 'rb') as f:
        m = pickle.load(f)

    future   = m.make_future_dataframe(periods=horizon)
    forecast = m.predict(future)

    # Return only the future portion
    result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(horizon).copy()

    # Clip negative predictions — demand can't be negative
    result['yhat']       = result['yhat'].clip(lower=0).round(1)
    result['yhat_lower'] = result['yhat_lower'].clip(lower=0).round(1)
    result['yhat_upper'] = result['yhat_upper'].clip(lower=0).round(1)

    return result


def cross_validate_prophet(series: pd.DataFrame,
                             product_type: str,
                             initial: str = '60 days',
                             period: str  = '14 days',
                             horizon: str = '14 days') -> dict:
    """
    Time series cross-validation — Prophet's built-in.

    Unlike regular CV, this always respects temporal order:
      Train on days 1–60, predict days 61–74
      Train on days 1–74, predict days 75–88
      ...

    initial: minimum training data size
    period:  step size between cutoffs
    horizon: how far ahead to predict
    """
    from prophet.diagnostics import cross_validation, performance_metrics

    m = Prophet(
        weekly_seasonality=True,
        changepoint_prior_scale=0.05,
        seasonality_mode='multiplicative',
    )
    m.add_country_holidays(country_name='IN')
    m.fit(series)

    print(f"Running cross-validation for {product_type}...")
    df_cv      = cross_validation(m, initial=initial, period=period, horizon=horizon)
    df_metrics = performance_metrics(df_cv)

    result = {
        'mape': round(df_metrics['mape'].mean() * 100, 2),
        'rmse': round(df_metrics['rmse'].mean(), 2),
        'mae':  round(df_metrics['mae'].mean(), 2),
    }
    print(f"{product_type} CV metrics: MAPE={result['mape']}% | "
          f"RMSE={result['rmse']} | MAE={result['mae']}")
    return result