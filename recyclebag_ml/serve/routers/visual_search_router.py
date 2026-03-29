    from fastapi import APIRouter, File, UploadFile, HTTPException, Query
from fastapi.responses import JSONResponse
import importlib.util
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
FEATURE2_DIR = ROOT_DIR / "feature_2_searching"  # keep your real folder name

if str(FEATURE2_DIR) not in sys.path:
    sys.path.insert(0, str(FEATURE2_DIR))

SEARCHER_PATH = FEATURE2_DIR / "searcher.py"
if not SEARCHER_PATH.exists():
    raise RuntimeError(f"searcher.py not found at: {SEARCHER_PATH}")

spec = importlib.util.spec_from_file_location("feature2_searcher", SEARCHER_PATH)
feature2_searcher = importlib.util.module_from_spec(spec)
spec.loader.exec_module(feature2_searcher)
VisualSearcher = feature2_searcher.VisualSearcher

router = APIRouter()

_searcher = None
_searcher_error = None


def get_searcher():
    global _searcher, _searcher_error
    if _searcher is not None:
        return _searcher
    try:
        _searcher = VisualSearcher()
        _searcher_error = None
        return _searcher
    except Exception as e:
        _searcher_error = str(e)
        raise


@router.post("/by-image")
async def search_by_image(
    file: UploadFile = File(...),
    top_k: int = Query(default=8, ge=1, le=20),
    exclude: str | None = Query(default=None, description="Product ID to exclude from results"),
):
    if file.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(status_code=400, detail="JPEG, PNG, or WebP only")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Max 10MB")

    try:
        searcher = get_searcher()
    except Exception:
        raise HTTPException(status_code=503, detail=f"Visual search unavailable: {_searcher_error}")

    results = searcher.search_by_image(contents, top_k=top_k, exclude_product_id=exclude)
    return JSONResponse({"results": results, "count": len(results)})


@router.get("/by-product/{product_id}")
def search_by_product(product_id: str, top_k: int = Query(default=6, ge=1, le=20)):
    try:
        searcher = get_searcher()
    except Exception:
        raise HTTPException(status_code=503, detail=f"Visual search unavailable: {_searcher_error}")

    try:
        results = searcher.search_by_product_id(product_id, top_k=top_k)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    return JSONResponse({"results": results, "count": len(results)})


@router.post("/add-product")
async def add_product(
    product_id: str,
    name: str,
    type: str,
    base_price: float,
    file: UploadFile = File(...),
):
    try:
        searcher = get_searcher()
    except Exception:
        raise HTTPException(status_code=503, detail=f"Visual search unavailable: {_searcher_error}")

    INDEX_UPDATER_PATH = FEATURE2_DIR / "index_updater.py"
    if not INDEX_UPDATER_PATH.exists():
        raise HTTPException(status_code=500, detail=f"index_updater.py missing at: {INDEX_UPDATER_PATH}")

    spec_updater = importlib.util.spec_from_file_location("feature2_index_updater", INDEX_UPDATER_PATH)
    updater_mod = importlib.util.module_from_spec(spec_updater)
    spec_updater.loader.exec_module(updater_mod)
    add_product_to_index = updater_mod.add_product_to_index

    contents = await file.read()
    add_product_to_index({
        "product_id": product_id,
        "image_url": f"/uploads/{file.filename}",
        "image_bytes": contents,
        "name": name,
        "type": type,
        "base_price": base_price,
    })

    searcher.reload_index()
    return {"status": "added", "product_id": product_id}


@router.get("/health")
def health():
    try:
        s = get_searcher()
        return {
            "status": "ok",
            "ready": True,
            "index_size": s.index.ntotal,
            "embedding_dim": 2048,
            "index_type": type(s.index).__name__,
        }
    except Exception:
        return {
            "status": "degraded",
            "ready": False,
            "reason": _searcher_error,
        }