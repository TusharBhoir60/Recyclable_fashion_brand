# serve/routers/segmentation_router.py

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import sys
sys.path.append('feature_4_segmentation')

from predict import predict_segment, predict_segment_from_orders

router = APIRouter()


class RFMRequest(BaseModel):
    recency:   int   = Field(..., ge=0, description="Days since last order")
    frequency: int   = Field(..., ge=1, description="Total orders")
    monetary:  float = Field(..., gt=0, description="Total spend in ₹")


class UserOrdersRequest(BaseModel):
    user_id: str
    orders:  list[dict]  # [{ created_at, total_amount, status }]


@router.post("/predict")
def predict_from_rfm(req: RFMRequest):
    """
    Direct RFM → segment. Fast path — called when RFM is already computed.
    Used by dynamic pricing and recommender features.
    """
    result = predict_segment(req.recency, req.frequency, req.monetary)
    return JSONResponse(content=result)


@router.post("/predict-from-orders")
def predict_from_orders(req: UserOrdersRequest):
    """
    Raw orders → RFM → segment. Used when we only have order history.
    Called by Node.js on user profile load.
    """
    result = predict_segment_from_orders(req.user_id, req.orders)
    return JSONResponse(content=result)


@router.get("/health")
def health():
    from segmenter import load_model
    kmeans, _, cluster_map = load_model()
    return {
        "status":     "ok",
        "n_clusters": kmeans.n_clusters,
        "segments":   list(cluster_map.values()),
    }