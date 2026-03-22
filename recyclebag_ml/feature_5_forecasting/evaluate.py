# feature_5_forecasting/evaluate.py

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

from preprocessor import load_series


def mape(actual: np.ndarray, predicted: np.ndarray) -> float:
    """
    Mean Absolute Percentage Error — the most intuitive metric.
    MAPE of 12% means predictions are off by 12% on average.
    Avoid when actual values include zeros (causes division by zero).
    """
    mask = actual != 0
    return float(np.mean(np.abs((actual[mask] - predicted[mask]) / actual[mask])) * 100)


def rmse(actual: np.ndarray, predicted: np.ndarray) -> float:
    """Root Mean Squared Error — penalises large errors more than MAE."""
    return float(np.sqrt(np.mean((actual - predicted) ** 2)))


def mae(actual: np.ndarray, predicted: np.ndarray) -> float:
    """Mean Absolute Error — in the same unit as demand (bags/day)."""
    return float(np.mean(np.abs(actual - predicted)))


def evaluate_hold_out(series: pd.DataFrame,
                       product_type: str,
                       model_type: str = 'prophet',
                       hold_out_days: int = 14) -> dict:
    """
    Hold-out evaluation — chronological split, NOT random.

    Train on everything except last hold_out_days.
    Predict those hold_out_days and compare against actuals.

    This simulates the real-world scenario:
    train on past → predict future → measure accuracy.
    """
    train = series.iloc[:-hold_out_days]
    test  = series.iloc[-hold_out_days:]

    if model_type == 'prophet':
        from prophet_model import train_prophet
        import pickle, tempfile, os
        from pathlib import Path

        m = train_prophet(train, f"{product_type}_eval")
        future   = m.make_future_dataframe(periods=hold_out_days)
        forecast = m.predict(future)
        preds    = forecast['yhat'].tail(hold_out_days).clip(lower=0).values
    else:
        from lstm_model import train_lstm, forecast_lstm
        train_lstm(train, f"{product_type}_eval")
        fc    = forecast_lstm(train, f"{product_type}_eval", horizon=hold_out_days)
        preds = fc['yhat'].values

    actual = test['y'].values
    metrics = {
        'mape': round(mape(actual, preds), 2),
        'rmse': round(rmse(actual, preds), 2),
        'mae':  round(mae(actual, preds),  2),
        'model': model_type,
        'product_type': product_type,
    }

    print(f"\n{product_type} [{model_type}] hold-out ({hold_out_days} days):")
    print(f"  MAPE: {metrics['mape']}%")
    print(f"  RMSE: {metrics['rmse']} bags/day")
    print(f"  MAE:  {metrics['mae']}  bags/day")

    _plot_evaluation(test['ds'].values, actual, preds, product_type, model_type)
    return metrics


def _plot_evaluation(dates, actual, predicted, product_type, model_type):
    fig, ax = plt.subplots(figsize=(12, 4))
    ax.plot(dates, actual,    label='Actual',    color='#1D9E75', linewidth=2)
    ax.plot(dates, predicted, label='Predicted', color='#534AB7',
            linewidth=2, linestyle='--')
    ax.fill_between(dates, predicted * 0.85, predicted * 1.15,
                    alpha=0.15, color='#534AB7', label='±15% band')
    ax.set_title(f'{product_type} demand — {model_type} evaluation')
    ax.set_ylabel('Orders / day')
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %d'))
    ax.legend()
    plt.tight_layout()
    path = f'feature_5_forecasting/notebooks/{product_type.lower()}_{model_type}_eval.png'
    plt.savefig(path, dpi=150)
    print(f"Plot saved: {path}")
    plt.close()