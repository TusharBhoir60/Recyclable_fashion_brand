# feature_4_segmentation/predict.py

import numpy as np
import pandas as pd
from segmenter import load_model

_kmeans = None
_scaler = None
_cluster_map = None


def _ensure_model_loaded():
    global _kmeans, _scaler, _cluster_map
    if _kmeans is None or _scaler is None or _cluster_map is None:
        _kmeans, _scaler, _cluster_map = load_model()


def predict_segment(recency: int, frequency: int, monetary: float) -> dict:
    """
    Predict the segment for a single customer given their RFM values.
    Called in real-time when needed (e.g. for dynamic pricing).

    recency:   days since last order
    frequency: total orders placed
    monetary:  total spend in ₹
    """
    _ensure_model_loaded()

    X = np.array([[recency, frequency, monetary]], dtype=float)
    X_scaled  = _scaler.transform(X)
    cluster   = int(_kmeans.predict(X_scaled)[0])
    segment   = _cluster_map[cluster]

    # Distance to centroid — how "typical" this customer is for their segment
    centroid  = _kmeans.cluster_centers_[cluster]
    distance  = float(np.linalg.norm(X_scaled[0] - centroid))

    return {
        'segment':           segment,
        'cluster_id':        cluster,
        'centroid_distance': round(distance, 4),
        'rfm': {
            'recency':   recency,
            'frequency': frequency,
            'monetary':  round(monetary, 2),
        },
    }


def predict_segment_from_orders(user_id: str,
                                  orders: list[dict],
                                  snapshot_date: pd.Timestamp = None) -> dict:
    """
    Higher-level helper — accepts raw order records, computes RFM,
    then predicts segment. Used by the FastAPI endpoint.

    orders: [{ created_at: str, total_amount: float, status: str }]
    """
    import sys
    sys.path.append('feature_4_segmentation')
    from rfm_builder import build_rfm_from_df

    if not orders:
        return {'segment': 'New', 'cluster_id': -1,
                'centroid_distance': 0, 'rfm': {}}

    df = pd.DataFrame(orders)
    df['user_id']      = user_id
    df['created_at']   = pd.to_datetime(df['created_at'])
    df['total_amount'] = df['total_amount'].astype(float)

    rfm = build_rfm_from_df(df, snapshot_date)
    if rfm.empty:
        return {'segment': 'New', 'cluster_id': -1,
                'centroid_distance': 0, 'rfm': {}}

    row = rfm.iloc[0]
    return predict_segment(
        recency=int(row['recency']),
        frequency=int(row['frequency']),
        monetary=float(row['monetary']),
    )