# feature_5_forecasting/lstm_model.py

import torch
import torch.nn as nn
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.preprocessing import MinMaxScaler
import pickle
import yaml

def load_config():
    with open('feature_5_forecasting/configs/forecast_config.yaml') as f:
        return yaml.safe_load(f)

cfg  = load_config()
lcfg = cfg['lstm']


class DemandLSTM(nn.Module):
    """
    LSTM for multi-step demand forecasting.

    Architecture:
      Input:  [batch, lookback_window, 1]  — past 30 days of demand
      LSTM:   2 layers, 64 hidden units each
      Output: [batch, forecast_steps]      — next 7 days of demand

    Why LSTM over Prophet for Phase 2?
      Prophet fits explicit mathematical components (trend, seasonality).
      LSTM learns patterns implicitly from the sequence itself —
      it can capture interactions between components that Prophet misses,
      like "demand after a festival weekend drops sharply then rebounds."
    """

    def __init__(self):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=1,
            hidden_size=lcfg['hidden_size'],
            num_layers=lcfg['num_layers'],
            batch_first=True,
            dropout=lcfg['dropout'] if lcfg['num_layers'] > 1 else 0,
        )
        self.fc = nn.Linear(lcfg['hidden_size'], lcfg['forecast_steps'])

    def forward(self, x):
        # x: [B, lookback, 1]
        out, _ = self.lstm(x)          # [B, lookback, hidden]
        return self.fc(out[:, -1, :])  # [B, forecast_steps] — use last hidden state


def create_sequences(values: np.ndarray,
                      lookback: int,
                      forecast_steps: int):
    """
    Convert a 1D time series into overlapping (X, y) windows.

    Example with lookback=3, forecast_steps=2:
      values = [1, 2, 3, 4, 5, 6, 7]
      X[0] = [1, 2, 3]  →  y[0] = [4, 5]
      X[1] = [2, 3, 4]  →  y[1] = [5, 6]
      X[2] = [3, 4, 5]  →  y[2] = [6, 7]

    This is the core data preparation trick for sequence models.
    The model learns: "given these past N values, predict next M values."
    """
    X, y = [], []
    for i in range(len(values) - lookback - forecast_steps + 1):
        X.append(values[i : i + lookback])
        y.append(values[i + lookback : i + lookback + forecast_steps])
    return np.array(X), np.array(y)


def train_lstm(series: pd.DataFrame, product_type: str) -> DemandLSTM:
    """
    Train the LSTM on a daily demand series.
    Requires at least 6 months (180 days) of data for meaningful patterns.
    """
    if len(series) < 180:
        raise ValueError(
            f"LSTM needs 180+ days. Got {len(series)} for {product_type}. "
            "Use Prophet for now and switch to LSTM after 6 months."
        )

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    values = series['y'].values.astype(float)

    # MinMaxScaler: scale to [0, 1]
    # LSTM is sensitive to input magnitude — scaling prevents gradient issues
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled = scaler.fit_transform(values.reshape(-1, 1)).flatten()

    # Create sliding windows
    X, y = create_sequences(scaled, lcfg['lookback_window'], lcfg['forecast_steps'])

    # Chronological split — NEVER shuffle time series data
    split   = int(len(X) * lcfg['train_split'])
    X_train, X_val = X[:split], X[split:]
    y_train, y_val = y[:split], y[split:]

    # Add channel dimension: [N, lookback] → [N, lookback, 1]
    X_train = torch.FloatTensor(X_train).unsqueeze(-1).to(device)
    X_val   = torch.FloatTensor(X_val).unsqueeze(-1).to(device)
    y_train = torch.FloatTensor(y_train).to(device)
    y_val   = torch.FloatTensor(y_val).to(device)

    model     = DemandLSTM().to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=lcfg['lr'])
    criterion = nn.MSELoss()

    best_val_loss    = float('inf')
    patience_counter = 0
    patience         = 10

    print(f"Training LSTM for {product_type} on {device}...")
    for epoch in range(1, lcfg['epochs'] + 1):
        model.train()
        optimizer.zero_grad()
        pred  = model(X_train)
        loss  = criterion(pred, y_train)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()

        model.eval()
        with torch.no_grad():
            val_loss = criterion(model(X_val), y_val).item()

        if epoch % 10 == 0:
            print(f"  Epoch {epoch}/{lcfg['epochs']} | "
                  f"train={loss.item():.5f} | val={val_loss:.5f}")

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            weights_dir   = Path(cfg['weights']['dir'])
            weights_dir.mkdir(parents=True, exist_ok=True)
            torch.save(model.state_dict(),
                       weights_dir / f"lstm_{product_type.lower()}.pt")
            patience_counter = 0
        else:
            patience_counter += 1
            if patience_counter >= patience:
                print(f"  Early stopping at epoch {epoch}")
                break

    # Save scaler alongside model — must use same scaler for inference
    with open(weights_dir / f"scaler_{product_type.lower()}.pkl", 'wb') as f:
        pickle.dump(scaler, f)

    print(f"Best val loss: {best_val_loss:.5f}")
    return model


def forecast_lstm(series: pd.DataFrame,
                   product_type: str,
                   horizon: int = 30) -> pd.DataFrame:
    """
    Load saved LSTM model and iteratively forecast horizon days ahead.

    Strategy: predict 7 days at a time, append to the series,
    feed back in as input — repeat until horizon is reached.
    This is called "autoregressive" or "recursive" forecasting.
    """
    device      = torch.device('cpu')
    weights_dir = Path(cfg['weights']['dir'])

    model = DemandLSTM().to(device)
    model.load_state_dict(torch.load(
        weights_dir / f"lstm_{product_type.lower()}.pt",
        map_location=device
    ))
    model.eval()

    with open(weights_dir / f"scaler_{product_type.lower()}.pkl", 'rb') as f:
        scaler = pickle.load(f)

    values = series['y'].values.astype(float)
    scaled = scaler.transform(values.reshape(-1, 1)).flatten()
    window = scaled[-lcfg['lookback_window']:].tolist()

    all_preds = []
    steps     = lcfg['forecast_steps']

    with torch.no_grad():
        while len(all_preds) < horizon:
            x   = torch.FloatTensor(window[-lcfg['lookback_window']:]).unsqueeze(0).unsqueeze(-1)
            out = model(x).squeeze(0).tolist()
            all_preds.extend(out)
            window.extend(out)

    # Inverse-transform back to original scale
    pred_array   = np.array(all_preds[:horizon]).reshape(-1, 1)
    pred_original = scaler.inverse_transform(pred_array).flatten()
    pred_original = np.clip(pred_original, 0, None)

    last_date = series['ds'].max()
    dates     = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=horizon, freq='D')

    return pd.DataFrame({
        'ds':         dates,
        'yhat':       pred_original.round(1),
        'yhat_lower': (pred_original * 0.8).round(1),   # simple ±20% CI
        'yhat_upper': (pred_original * 1.2).round(1),
    })