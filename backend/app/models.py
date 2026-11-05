from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    phone_number = Column(String(20), unique=True, index=True, nullable=True)
    email = Column(String(120), unique=True, index=True, nullable=True)
    role = Column(String(50), default="farmer")
    state = Column(String(100), default="Punjab")
    district = Column(String(100), default="Ludhiana")
    is_kyc_verified = Column(Boolean, default=False)
    aadhaar_masked_hash = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    listings = relationship("CropListing", back_populates="seller")
    orders = relationship("MandiOrder", back_populates="buyer")


class OtpRecord(Base):
    __tablename__ = "otp_records"

    id = Column(Integer, primary_key=True, index=True)
    identifier = Column(String(120), index=True, nullable=False)  # Phone number or email
    channel = Column(String(20), nullable=False)  # "phone" or "email"
    otp_code = Column(String(10), nullable=False)
    purpose = Column(String(20), default="login")  # "login" or "signup"
    full_name = Column(String(120), nullable=True)
    role = Column(String(50), default="farmer")
    expires_at = Column(DateTime, nullable=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)


class CropListing(Base):
    __tablename__ = "crop_listings"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    seller_name = Column(String(120), nullable=False)
    seller_phone = Column(String(20), nullable=False)
    title = Column(String(200), nullable=False)
    crop_category = Column(String(100), nullable=False)
    variety = Column(String(100), nullable=False)
    quantity_quintals = Column(Float, nullable=False)
    price_per_quintal = Column(Float, nullable=False)
    moisture_percentage = Column(Float, default=11.5)
    quality_grade = Column(String(20), default="Grade A+")
    harvest_date = Column(String(50), nullable=True)
    mandi_location = Column(String(120), default="Khanna Mandi")
    state = Column(String(100), default="Punjab")
    organic_certified = Column(Boolean, default=False)
    verification_hash = Column(String(100), nullable=True)
    status = Column(String(50), default="ACTIVE")
    created_at = Column(DateTime, default=utc_now)

    seller = relationship("User", back_populates="listings")
    orders = relationship("MandiOrder", back_populates="listing")


class MandiOrder(Base):
    __tablename__ = "mandi_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(64), unique=True, index=True, nullable=False)
    listing_id = Column(Integer, ForeignKey("crop_listings.id"), nullable=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    buyer_name = Column(String(120), nullable=False)
    buyer_phone = Column(String(20), nullable=False)
    delivery_address = Column(Text, nullable=False)
    pin_code = Column(String(10), nullable=False)
    quantity_quintals = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    escrow_fee = Column(Float, default=0.0)
    payment_mode = Column(String(30), default="COD")
    payment_id = Column(String(120), nullable=True)
    idempotency_key = Column(String(128), unique=True, index=True, nullable=True)
    qr_delivery_token = Column(String(64), unique=True, index=True, nullable=True)
    escrow_settled_at = Column(DateTime, nullable=True)
    payment_status = Column(String(50), default="ESCROW_LOCKED")
    tracking_status = Column(String(50), default="ORDER_PLACED")
    created_at = Column(DateTime, default=utc_now)

    listing = relationship("CropListing", back_populates="orders")
    buyer = relationship("User", back_populates="orders")


class DiseaseDiagnosis(Base):
    __tablename__ = "disease_diagnoses"

    id = Column(Integer, primary_key=True, index=True)
    image_hash = Column(String(64), index=True, nullable=True)
    image_filename = Column(String(255), nullable=True)
    crop_name = Column(String(100), nullable=False)
    disease_name = Column(String(150), nullable=False)
    pathogen_type = Column(String(50), nullable=False)
    confidence_score = Column(Float, nullable=False)
    severity_level = Column(String(50), default="Moderate")
    affected_area_percentage = Column(Float, default=15.0)
    chemical_remedy = Column(Text, nullable=False)
    biological_remedy = Column(Text, nullable=False)
    prevention_advice = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utc_now)


class SoilAssessment(Base):
    __tablename__ = "soil_assessments"

    id = Column(Integer, primary_key=True, index=True)
    nitrogen = Column(Float, nullable=False)
    phosphorus = Column(Float, nullable=False)
    potassium = Column(Float, nullable=False)
    ph_level = Column(Float, nullable=False)
    rainfall_mm = Column(Float, nullable=False)
    temperature_c = Column(Float, nullable=False)
    humidity_pct = Column(Float, nullable=False)
    recommended_crops = Column(Text, nullable=False)
    estimated_gross_margin = Column(Float, default=0.0)
    soil_health_grade = Column(String(20), default="Optimal")
    created_at = Column(DateTime, default=utc_now)
