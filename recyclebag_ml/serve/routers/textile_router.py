# serve/routers/textile_router.py

from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
FEATURE1_DIR = ROOT_DIR / 'feature1'
if str(FEATURE1_DIR) not in sys.path:
    sys.path.append(str(FEATURE1_DIR))

from predict import TextileClassifier
from active_learning import flag_for_review

router     = APIRouter()
classifier = TextileClassifier('weights/textile_v1.pt')  # singleton

@router.post("/classify")
async def classify_textile(file: UploadFile = File(...)):
    # Validate file type
    if file.content_type not in ('image/jpeg', 'image/png', 'image/webp'):
        raise HTTPException(status_code=400, detail="Only JPEG/PNG/WebP accepted")

    # File size guard (5MB max)
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 5MB)")

    result = classifier.predict(contents)

    # Async flag for active learning — don't block the response
    if result['flag_for_review']:
        # Save image to temp storage, add to review queue
        flag_for_review(contents, result, source_path=f"uploads/{file.filename}")

    return JSONResponse(content=result)


@router.get("/classify/health")
def health():
    return {"status": "ok", "model": "textile_v1", "device": str(classifier.device)}