# serve/routers/recommender_router.py

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import sys
sys.path.append('feature_6_recommender')

from predict import recommend

router = APIRouter()


class RecommendRequest(BaseModel):
    user_id:            str
    segment:            str  = Field(default='New',
                                     description="User segment from Feature 4")
    bought_product_ids: list[str] = Field(default=[])
    top_k:              int  = Field(default=8, ge=1, le=20)


@router.post("/")
def get_recommendations(req: RecommendRequest):
    """
    Get personalised product recommendations for a user.
    Called on product detail pages and post-purchase emails.
    """
    try:
        recs = recommend(
            user_id=req.user_id,
            segment=req.segment,
            bought_product_ids=req.bought_product_ids,
            top_k=req.top_k,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return JSONResponse(content={
        "user_id":      req.user_id,
        "segment":      req.segment,
        "alpha_used":   round(
            __import__('hybrid').get_alpha(req.segment), 2
        ),
        "count":        len(recs),
        "recommendations": recs,
    })


@router.get("/health")
def health():
    from pathlib import Path
    import yaml
    with open('feature_6_recommender/configs/recommender_config.yaml') as f:
        cfg = yaml.safe_load(f)

    ready = all(
        Path(v).exists() for k, v in cfg['weights'].items()
    )
    return {"status": "ok" if ready else "weights_missing", "ready": ready}