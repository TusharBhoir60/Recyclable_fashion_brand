# serve/routers/visual_search_router.py

from fastapi import APIRouter, File, UploadFile, HTTPException, Query
from fastapi.responses import JSONResponse
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
FEATURE2_DIR = ROOT_DIR / 'feature2'
if str(FEATURE2_DIR) not in sys.path:
    sys.path.append(str(FEATURE2_DIR))

from searcher import VisualSearcher

router   = APIRouter()
searcher = VisualSearcher()   # singleton, index loaded at import


@router.post("/by-image")
async def search_by_image(
    file:    UploadFile = File(...),
    top_k:   int        = Query(default=8, ge=1, le=20),
    exclude: str        = Query(default=None, description="Product ID to exclude from results"),
):
    """
    User uploads any bag photo → returns most visually similar products.
    This is the "find similar" / "shop the look" endpoint.
    """
    if file.content_type not in ('image/jpeg', 'image/png', 'image/webp'):
        raise HTTPException(status_code=400, detail="JPEG, PNG, or WebP only")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Max 10MB")

    results = searcher.search_by_image(contents, top_k=top_k, exclude_product_id=exclude)
    return JSONResponse({"results": results, "count": len(results)})


@router.get("/by-product/{product_id}")
def search_by_product(
    product_id: str,
    top_k: int = Query(default=6, ge=1, le=20),
):
    """
    "More like this" on a product detail page.
    Uses the product's own indexed embedding as the query — no image upload needed.
    """
    try:
        results = searcher.search_by_product_id(product_id, top_k=top_k)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    return JSONResponse({"results": results, "count": len(results)})


@router.post("/add-product")
async def add_product(
    product_id: str,
    name:       str,
    type:       str,
    base_price: float,
    file:       UploadFile = File(...),
):
    """
    Called by Node.js backend when admin adds a new product.
    Incrementally adds it to the FAISS index without full rebuild.
    """
    from index_updater import add_product_to_index

    contents = await file.read()
    add_product_to_index({
        'product_id':  product_id,
        'image_url':   f'/uploads/{file.filename}',
        'image_bytes': contents,
        'name':        name,
        'type':        type,
        'base_price':  base_price,
    })
    searcher.reload_index()   # hot-reload without server restart
    return {"status": "added", "product_id": product_id}


@router.get("/health")
def health():
    return {
        "status":          "ok",
        "index_size":      searcher.index.ntotal,
        "embedding_dim":   2048,
        "index_type":      type(searcher.index).__name__,
    }