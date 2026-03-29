from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import importlib.util
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
FEATURE1_DIR = ROOT_DIR / "feature_1_classifier"

router = APIRouter()

classifier = None
flag_for_review = None
_load_error = None


def _load_feature1_modules():
    global classifier, flag_for_review, _load_error
    if classifier is not None and flag_for_review is not None:
        return

    original_sys_path = list(sys.path)
    try:
        # put feature_1 dir first so "from model import ..." resolves locally
        sys.path.insert(0, str(FEATURE1_DIR))

        pred_path = FEATURE1_DIR / "predict.py"
        al_path = FEATURE1_DIR / "active_learning.py"

        if not pred_path.exists():
            raise RuntimeError(f"Missing: {pred_path}")
        if not al_path.exists():
            raise RuntimeError(f"Missing: {al_path}")

        spec_pred = importlib.util.spec_from_file_location("feature1_predict", pred_path)
        mod_pred = importlib.util.module_from_spec(spec_pred)
        spec_pred.loader.exec_module(mod_pred)

        spec_al = importlib.util.spec_from_file_location("feature1_active_learning", al_path)
        mod_al = importlib.util.module_from_spec(spec_al)
        spec_al.loader.exec_module(mod_al)

        TextileClassifier = mod_pred.TextileClassifier
        classifier = TextileClassifier()
        flag_for_review = mod_al.flag_for_review
        _load_error = None

    except Exception as e:
        _load_error = str(e)
        raise
    finally:
        # restore to avoid polluting imports globally
        sys.path = original_sys_path


@router.post("/classify")
async def classify_textile(file: UploadFile = File(...)):
    if file.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(status_code=400, detail="JPEG, PNG, or WebP only")

    try:
        _load_feature1_modules()
    except Exception:
        raise HTTPException(status_code=503, detail=f"Textile classifier unavailable: {_load_error}")

    image_bytes = await file.read()
    result = classifier.predict(image_bytes)

    try:
        if float(result.get("confidence", 0.0)) < 0.70:
            flag_for_review(
                image_bytes=image_bytes,
                material_pred=result.get("material"),
                confidence=float(result.get("confidence", 0.0)),
                all_probs=result.get("probs", {}),
            )
    except Exception:
        pass

    return JSONResponse(result)


@router.get("/health")
def health():
    try:
        _load_feature1_modules()
        return {"status": "ok", "ready": True, "model": "textile_classifier_v1"}
    except Exception:
        return {"status": "degraded", "ready": False, "reason": _load_error}