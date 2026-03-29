from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
import importlib.util
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
FEATURE5_DIR = ROOT_DIR / "feature_5_forecasting"

router = APIRouter()

forecast_fn = None
forecast_all_fn = None
_load_error = None


def _load_feature5():
    global forecast_fn, forecast_all_fn, _load_error
    if forecast_fn is not None and forecast_all_fn is not None:
        return

    original_sys_path = list(sys.path)
    try:
        sys.path.insert(0, str(FEATURE5_DIR))

        predict_path = FEATURE5_DIR / "predict.py"
        if not predict_path.exists():
            raise RuntimeError(f"Missing file: {predict_path}")

        spec = importlib.util.spec_from_file_location("feature5_predict", predict_path)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)

        forecast_fn = mod.forecast
        forecast_all_fn = mod.forecast_all
        _load_error = None
    except Exception as e:
        _load_error = str(e)
        raise
    finally:
        sys.path = original_sys_path


@router.get("/{product_type}")
def get_forecast(
    product_type: str,
    horizon: int = Query(default=30, ge=7, le=90),
):
    valid = ["BASIC", "PREMIUM", "CUSTOMIZED"]
    if product_type.upper() not in valid:
        raise HTTPException(status_code=400, detail=f"Invalid product_type. Choose from: {valid}")

    try:
        _load_feature5()
        result = forecast_fn(product_type.upper(), horizon)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception:
        raise HTTPException(status_code=503, detail=f"Forecast service unavailable: {_load_error}")

    return JSONResponse(content={
        "product_type": product_type.upper(),
        "horizon_days": horizon,
        "forecasts": result,
        "count": len(result),
    })


@router.get("/")
def get_all_forecasts(
    horizon: int = Query(default=30, ge=7, le=90),
):
    try:
        _load_feature5()
        result = forecast_all_fn(horizon)
    except Exception:
        raise HTTPException(status_code=503, detail=f"Forecast service unavailable: {_load_error}")

    return JSONResponse(content={
        "horizon_days": horizon,
        "forecasts": result,
    })


@router.get("/health")
def health():
    try:
        _load_feature5()
        return {"status": "ok", "ready": True}
    except Exception:
        return {"status": "degraded", "ready": False, "reason": _load_error}