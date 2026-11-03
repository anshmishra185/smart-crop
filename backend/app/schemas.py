from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

# User Schemas
class UserBase(BaseModel):
    full_name: str = Field(..., json_schema_extra={"example": "Sardar Balwinder Singh"})
    phone_number: str = Field(..., json_schema_extra={"example": "+91 98140 23891"})
    role: str = Field(default="farmer", json_schema_extra={"example": "farmer"})
    state: str = Field(default="Punjab", json_schema_extra={"example": "Punjab"})
    district: str = Field(default="Ludhiana", json_schema_extra={"example": "Ludhiana"})

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Crop Listing Schemas
class CropListingBase(BaseModel):
    title: str = Field(..., json_schema_extra={"example": "Kalyan Sona Sharbati Wheat - Sharbati Gold"})
    crop_category: str = Field(..., json_schema_extra={"example": "Wheat"})
    variety: str = Field(..., json_schema_extra={"example": "HD-2967 Gold"})
    quantity_quintals: float = Field(..., gt=0, json_schema_extra={"example": 120.0})
    price_per_quintal: float = Field(..., gt=0, json_schema_extra={"example": 2480.0})
    moisture_percentage: float = Field(default=11.5, json_schema_extra={"example": 11.2})
    quality_grade: str = Field(default="Grade A+", json_schema_extra={"example": "Grade A+"})
    harvest_date: Optional[str] = Field(default=None, json_schema_extra={"example": "2026-03-28"})
    mandi_location: str = Field(default="Khanna Mandi", json_schema_extra={"example": "Khanna Mandi, Ludhiana"})
    state: str = Field(default="Punjab", json_schema_extra={"example": "Punjab"})
    organic_certified: bool = Field(default=False)
    seller_name: str = Field(..., json_schema_extra={"example": "Balwinder Singh Dhillon"})
    seller_phone: str = Field(..., json_schema_extra={"example": "+91 98140 23891"})

class CropListingCreate(CropListingBase):
    pass

class CropListingResponse(CropListingBase):
    id: int
    seller_id: Optional[int] = None
    verification_hash: Optional[str] = None
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Mandi Order Schemas
class MandiOrderCreate(BaseModel):
    listing_id: Optional[int] = Field(None, json_schema_extra={"example": 1})
    buyer_name: str = Field(..., json_schema_extra={"example": "Vikas Aggarwal"})
    buyer_phone: str = Field(..., json_schema_extra={"example": "+91 98765 43210"})
    delivery_address: str = Field(..., json_schema_extra={"example": "M/s Aggarwal Agro Mills, Industrial Area B, Ludhiana"})
    pin_code: str = Field(..., json_schema_extra={"example": "141003"})
    quantity_quintals: float = Field(..., gt=0, json_schema_extra={"example": 50.0})
    payment_mode: str = Field(default="COD", json_schema_extra={"example": "RAZORPAY"})
    payment_id: Optional[str] = Field(None, json_schema_extra={"example": "pay_Q8J2f3k91aBC"})

class MandiOrderResponse(BaseModel):
    id: int
    order_number: str
    listing_id: Optional[int]
    buyer_name: str
    buyer_phone: str
    delivery_address: str
    pin_code: str
    quantity_quintals: float
    total_amount: float
    escrow_fee: float
    payment_mode: str
    payment_id: Optional[str]
    payment_status: str
    tracking_status: str
    idempotency_key: Optional[str] = None
    qr_delivery_token: Optional[str] = None
    escrow_settled_at: Optional[datetime] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# AI Disease Diagnosis Schemas
class DifferentialDiagnosisItem(BaseModel):
    crop_name: str
    disease_name: str
    probability: float
    probability_percentage: str

class TreatmentInfo(BaseModel):
    trade_name: str
    active_ingredient: str
    dosage_per_acre: str
    application_method: str
    waiting_period_days: int

class DiseasePredictionResponse(BaseModel):
    crop_name: str
    disease_name: str
    pathogen_type: str
    confidence_score: float
    confidence_percentage: str
    severity_level: str
    affected_area_percentage: float
    is_healthy: bool
    symptoms: List[str]
    chemical_treatments: List[TreatmentInfo]
    organic_treatments: List[TreatmentInfo]
    preventive_measures: List[str]
    cibrc_approved: bool
    model_architecture: str = "MobileNetV3_Large_ONNX"
    inference_latency_ms: float = 14.2
    differential_diagnoses: List[DifferentialDiagnosisItem] = []
    diagnostic_timestamp: str


# AI Crop Recommendation Schemas
class CropRecommendationRequest(BaseModel):
    nitrogen: float = Field(..., ge=0, le=300, json_schema_extra={"example": 140.0}, description="Soil Nitrogen (N) in kg/ha")
    phosphorus: float = Field(..., ge=0, le=200, json_schema_extra={"example": 65.0}, description="Soil Phosphorus (P) in kg/ha")
    potassium: float = Field(..., ge=0, le=300, json_schema_extra={"example": 58.0}, description="Soil Potassium (K) in kg/ha")
    ph_level: float = Field(..., ge=3.5, le=10.0, json_schema_extra={"example": 6.8}, description="Soil pH Level")
    rainfall_mm: float = Field(..., ge=0, le=4000, json_schema_extra={"example": 850.0}, description="Annual / Seasonal Rainfall in mm")
    temperature_c: float = Field(..., ge=-10, le=60, json_schema_extra={"example": 24.5}, description="Average Temperature in Celsius")
    humidity_pct: float = Field(..., ge=5, le=100, json_schema_extra={"example": 72.0}, description="Relative Humidity percentage")

class RecommendedCropItem(BaseModel):
    crop_name: str
    suitability_score: float
    suitability_percentage: str
    expected_yield_quintal_per_acre: float
    msp_or_market_price_per_quintal: float
    estimated_gross_margin_per_acre: float
    water_requirement: str
    duration_days: int
    optimal_sowing_window: str

class CropRecommendationResponse(BaseModel):
    soil_health_index: str
    soil_ph_status: str
    primary_recommendation: RecommendedCropItem
    top_recommendations: List[RecommendedCropItem]
    npk_balance_feedback: str
    timestamp: str


# Mandi Rate Schemas
class MandiCommodityRate(BaseModel):
    commodity: str
    variety: str
    mandi_name: str
    district: str
    state: str
    min_price_per_quintal: float
    max_price_per_quintal: float
    modal_price_per_quintal: float
    msp_benchmark: float
    price_change_24h_pct: float
    arrival_quantity_tonnes: float
    forecast_7d_trend: str
    forecast_modal_price_7d: float
    recorded_at: str

class MandiRatesResponse(BaseModel):
    mandi_cluster: str
    updated_at: str
    total_commodities: int
    rates: List[MandiCommodityRate]
