import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal, DATABASE_URL
from .models import CropListing, User
from .routers import disease, recommendations, marketplace, mandi

# 1. Initialize SQLite schema synchronously
Base.metadata.create_all(bind=engine)

# 2. Seed initial benchmark crop listings if empty
def seed_initial_data():
    db = SessionLocal()
    try:
        count = db.query(CropListing).count()
        if count == 0:
            seed_listings = [
                CropListing(
                    seller_name="Balwinder Singh Dhillon",
                    seller_phone="+91 98140 23891",
                    title="Certified Sharbati Wheat - HD-2967 Gold Grade",
                    crop_category="Wheat",
                    variety="HD-2967 Gold",
                    quantity_quintals=150.0,
                    price_per_quintal=2480.0,
                    moisture_percentage=11.2,
                    quality_grade="Grade A+",
                    harvest_date="2026-03-28",
                    mandi_location="Khanna Mandi, Ludhiana",
                    state="Punjab",
                    organic_certified=True,
                    verification_hash="KS-APMC-7F2A9B810C1E",
                    status="ACTIVE"
                ),
                CropListing(
                    seller_name="Gurpreet Kaur Brar",
                    seller_phone="+91 94172 88412",
                    title="Export Grade Basmati Paddy - Pusa 1121 Extra Long",
                    crop_category="Basmati Rice",
                    variety="Pusa 1121 Steamed",
                    quantity_quintals=220.0,
                    price_per_quintal=4120.0,
                    moisture_percentage=11.8,
                    quality_grade="Grade A+",
                    harvest_date="2026-04-02",
                    mandi_location="Taraori Mandi, Karnal",
                    state="Haryana",
                    organic_certified=False,
                    verification_hash="KS-APMC-9D3E1A4B7C2F",
                    status="ACTIVE"
                ),
                CropListing(
                    seller_name="Manmohan Singh Sandhu",
                    seller_phone="+91 98721 34901",
                    title="High-Oil Yellow Mustard - Pusa Bold 42% Oil Yield",
                    crop_category="Mustard",
                    variety="Pusa Bold",
                    quantity_quintals=85.0,
                    price_per_quintal=5980.0,
                    moisture_percentage=7.8,
                    quality_grade="Grade A",
                    harvest_date="2026-03-15",
                    mandi_location="Alwar Mandi",
                    state="Rajasthan",
                    organic_certified=True,
                    verification_hash="KS-APMC-4E8F2B1C6A9D",
                    status="ACTIVE"
                ),
                CropListing(
                    seller_name="Sukhdev Singh Gill",
                    seller_phone="+91 98155 77623",
                    title="Bt Cotton Long Staple - RCH-659 BG II Clean Lint",
                    crop_category="Cotton",
                    variety="RCH-659",
                    quantity_quintals=110.0,
                    price_per_quintal=7420.0,
                    moisture_percentage=8.2,
                    quality_grade="Grade A+",
                    harvest_date="2026-02-20",
                    mandi_location="Sirsa APMC Yard",
                    state="Haryana",
                    organic_certified=False,
                    verification_hash="KS-APMC-1C9A4B8F3E2D",
                    status="ACTIVE"
                )
            ]
            db.add_all(seed_listings)
            db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()

seed_initial_data()

app = FastAPI(
    title="Krishi Saarthi Enterprise Backend",
    description="High-Throughput AI/ML Agritech Microservice for Crop Pathology Vision, Soil Agronomic Recommendation, and APMC Mandi Escrow Marketplace.",
    version="2.0.0"
)

# Enable CORS for Web & Mobile Clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Subsystem Routers
app.include_router(disease.router)
app.include_router(recommendations.router)
app.include_router(marketplace.router)
app.include_router(mandi.router)

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Krishi Saarthi AI/ML Backend Microservice",
        "version": "2.0.0",
        "ai_vision_engine": "CIB&RC 38-Class Pathology ResNet Classifier (Active)",
        "ai_soil_engine": "Multi-Variable Agronomic Nutrient Matcher (Active)",
        "mandi_escrow_engine": "Dual Razorpay + Cash On Delivery Settlement (Active)",
        "database": f"SQLAlchemy Relational Engine ({'PostgreSQL Cloud' if 'postgresql' in DATABASE_URL else 'SQLite Embedded'}) (Connected)"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
