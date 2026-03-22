# serve/routers/sentiment_router.py

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
SENTIMENT_DIR = ROOT_DIR / 'feature_3_sentiment'
if str(SENTIMENT_DIR) not in sys.path:
    sys.path.append(str(SENTIMENT_DIR))

from predict          import SentimentPredictor
from aspect_analyzer  import analyze_aspects

router    = APIRouter()
predictor = SentimentPredictor()   # singleton — loads once at startup


class ReviewRequest(BaseModel):
    text:           str  = Field(..., min_length=5, max_length=2000)
    run_aspects:    bool = Field(default=True,
                                 description="Also run per-aspect analysis")
    product_id:     str  = Field(default=None)


class BatchRequest(BaseModel):
    texts: list[str] = Field(..., min_items=1, max_items=50)


@router.post("/analyze")
def analyze_review(req: ReviewRequest):
    """
    Main endpoint — called when a user submits a review.
    Returns overall sentiment + optional aspect breakdown.
    """
    if len(req.text.strip()) < 5:
        raise HTTPException(status_code=400, detail="Review too short")

    if req.run_aspects:
        result = analyze_aspects(req.text)
    else:
        result = {'overall': predictor.predict(req.text), 'aspects': None}

    result['product_id'] = req.product_id
    return JSONResponse(content=result)


@router.post("/batch")
def analyze_batch(req: BatchRequest):
    """
    Bulk endpoint — called nightly to process historical reviews
    that predate the ML system.
    """
    results = predictor.predict_batch(req.texts)
    return JSONResponse(content={"results": results, "count": len(results)})


@router.get("/health")
def health():
    return {
        "status":     "ok",
        "model":      "sentiment_v1",
        "checkpoint": "twitter-roberta-base-sentiment-latest",
    }