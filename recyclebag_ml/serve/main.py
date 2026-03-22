from fastapi import FastAPI

from serve.routers.visual_search_router import router as visual_search_router
from serve.routers.sentiment_router import router as sentiment_router
from serve.routers.textile_router import router as textile_router

from routers.segmentation_router import router as segmentation_router
app.include_router(segmentation_router, prefix="/segment", tags=["segmentation"])

from routers.forecast_router import router as forecast_router
app.include_router(forecast_router, prefix="/forecast", tags=["forecasting"])

from routers.recommender_router import router as recommender_router
app.include_router(recommender_router, prefix="/recommend", tags=["recommender"])


app = FastAPI(title="RecycleBag ML Service", version="1.0.0")


@app.get("/")
def root():
	return {"status": "ok", "service": "recyclebag-ml"}


app.include_router(visual_search_router, prefix="/visual-search", tags=["visual-search"])
app.include_router(sentiment_router, prefix="/sentiment", tags=["sentiment"])
app.include_router(textile_router, prefix="/textile", tags=["textile"])