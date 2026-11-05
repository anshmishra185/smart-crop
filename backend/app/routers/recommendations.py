import json
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import SoilAssessment
from ..schemas import CropRecommendationRequest, CropRecommendationResponse
from ..ml.crop_recommender import crop_recommender_engine
from ..services.live_weather_service import live_weather_service

router = APIRouter(prefix="/api/v1/predict", tags=["AI Crop Recommendation & Agromet"])

@router.post("/crop-recommendation", response_model=CropRecommendationResponse)
def get_crop_recommendation(
    request: CropRecommendationRequest,
    db: Session = Depends(get_db)
):
    """
    Evaluates soil N-P-K mineral levels, pH balance, and agro-climatic conditions.
    Returns ranked crop suitability, expected yield, and projected gross margins.
    """
    result = crop_recommender_engine.predict(
        n=request.nitrogen,
        p=request.phosphorus,
        k=request.potassium,
        ph=request.ph_level,
        rain=request.rainfall_mm,
        temp=request.temperature_c,
        humidity=request.humidity_pct
    )

    # Store in Database
    try:
        assessment = SoilAssessment(
            nitrogen=request.nitrogen,
            phosphorus=request.phosphorus,
            potassium=request.potassium,
            ph_level=request.ph_level,
            rainfall_mm=request.rainfall_mm,
            temperature_c=request.temperature_c,
            humidity_pct=request.humidity_pct,
            recommended_crops=json.dumps([c["crop_name"] for c in result["top_recommendations"]]),
            estimated_gross_margin=result["primary_recommendation"]["estimated_gross_margin_per_acre"],
            soil_health_grade=result["soil_health_index"]
        )
        db.add(assessment)
        db.commit()
    except Exception:
        db.rollback()

    return result

@router.get("/weather-advisory")
async def get_live_weather_advisory(
    lat: float = Query(30.9010, description="Latitude coordinate"),
    lon: float = Query(75.8573, description="Longitude coordinate"),
    crop: str = Query("Wheat", description="Active standing crop")
):
    """
    Real-time IMD Doppler Weather & Foliar Spore Pressure Index (FSPI).
    Predicts pre-symptomatic fungal infection windows across micro-climatic zones.
    """
    return await live_weather_service.get_current_agromet_telemetry(
        latitude=lat,
        longitude=lon,
        crop_type=crop
    )


