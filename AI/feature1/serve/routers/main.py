# serve/main.py

from fastapi import FastAPI
from routers.textile_router import router as textile_router

app = FastAPI(title="RecyclaBag ML Service", version="1.0")
app.include_router(textile_router, prefix="/classify", tags=["textile"])

# Run: uvicorn serve.main:app --host 0.0.0.0 --port 8000 --workers 2