# serve/routers/forecast_router.py

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
import sys
sys.path.append('feature_5_forecasting')

from predict import forecast, forecast_all

router = APIRouter()


@router.get("/{product_type}")
def get_forecast(
    product_type: str,
    horizon: int = Query(default=30, ge=7, le=90,
                         description="Days to forecast ahead"),
):
    """
    Get demand forecast for a specific product type.
    product_type: BASIC | PREMIUM | CUSTOMIZED
    """
    valid = ['BASIC', 'PREMIUM', 'CUSTOMIZED']
    if product_type.upper() not in valid:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid product_type. Choose from: {valid}"
        )

    try:
        result = forecast(product_type.upper(), horizon)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    return JSONResponse(content={
        "product_type": product_type.upper(),
        "horizon_days": horizon,
        "forecasts":    result,
        "count":        len(result),
    })


@router.get("/")
def get_all_forecasts(
    horizon: int = Query(default=30, ge=7, le=90),
):
    """Forecast all three product types at once."""
    result = forecast_all(horizon)
    return JSONResponse(content={
        "horizon_days": horizon,
        "forecasts":    result,
    })


@router.get("/health")
def health():
    from pathlib import Path
    import yaml
    with open('feature_5_forecasting/configs/forecast_config.yaml') as f:
        cfg = yaml.safe_load(f)

    models_ready = {}
    for ptype in cfg['product_types']:
        model = cfg['active_model'].get(ptype, 'prophet')
        if model == 'prophet':
            path = Path(f"feature_5_forecasting/weights/prophet_{ptype.lower()}.pkl")
        else:
            path = Path(f"feature_5_forecasting/weights/lstm_{ptype.lower()}.pt")
        models_ready[ptype] = path.exists()

    return {"status": "ok", "models_ready": models_ready}