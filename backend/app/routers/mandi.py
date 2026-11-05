from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter
from ..schemas import MandiRatesResponse
from ..ml.mandi_forecaster import mandi_forecaster
from ..services.agmarknet_service import agmarknet_service

router = APIRouter(prefix="/api/v1/mandi", tags=["Mandi Rates & Forecast"])

@router.get("/rates", response_model=MandiRatesResponse)
def get_mandi_rates(
    state: Optional[str] = None
):
    """
    Get live APMC Mandi rates, MSP benchmarks, and 7-day predictive trend forecasts.
    """
    state_filter = state if isinstance(state, str) else None
    rates = mandi_forecaster.get_live_mandi_rates(state=state_filter)
    return {
        "mandi_cluster": "North India APMC Agri-Terminal Network (Punjab, Haryana, Rajasthan)",
        "updated_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        "total_commodities": len(rates),
        "rates": rates
    }

@router.get("/agmarknet/live-feed")
async def get_agmarknet_live_feed(
    state: Optional[str] = None,
    district: Optional[str] = None,
    commodity: Optional[str] = None
):
    """
    National Agmarknet & e-NAM real-time commodity prices with XFetch caching.
    """
    rates = await agmarknet_service.get_live_mandi_rates(state=state, district=district, commodity=commodity)
    return {
        "source": "Ministry of Agriculture & Farmers Welfare (Agmarknet / OGD)",
        "cached_via": "XFetch Probabilistic Early Expiration",
        "total_records": len(rates),
        "records": rates
    }

@router.get("/enam/verify-lot/{lot_id}")
async def verify_enam_lot(lot_id: str):
    """
    Verify APMC physical weighbridge slip and moisture certificate via e-NAM clearinghouse.
    """
    return await agmarknet_service.get_enam_gatepass_status(lot_id=lot_id)


