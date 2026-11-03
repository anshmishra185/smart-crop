from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter
from ..schemas import MandiRatesResponse
from ..ml.mandi_forecaster import mandi_forecaster

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
