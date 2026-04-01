from fastapi import FastAPI


def _try_include(app: FastAPI, import_path: str, prefix: str, tags: list[str]):
    """Load routers defensively so one missing dependency doesn't kill the API."""
    try:
        module_path, router_name = import_path.split(":", 1)
        module = __import__(module_path, fromlist=[router_name])
        router = getattr(module, router_name)
        app.include_router(router, prefix=prefix, tags=tags)
        return {"loaded": True, "error": None}
    except Exception as exc:
        return {"loaded": False, "error": str(exc)}

app = FastAPI(title="RecycleBag ML Service", version="1.0.0")

router_status = {
    "sentiment": _try_include(
        app,
        "serve.routers.sentiment_router:router",
        "/sentiment",
        ["sentiment"],
    ),
    "forecast": _try_include(
        app,
        "serve.routers.forecast_router:router",
        "/forecast",
        ["forecasting"],
    ),
    "search": _try_include(
        app,
        "serve.routers.visual_search_router:router",
        "/search",
        ["visual-search"],
    ),
    "textile": _try_include(
        app,
        "serve.routers.textile_router:router",
        "/textile",
        ["textile"],
    ),
}

@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "recyclebag-ml",
        "routers": router_status,
    }