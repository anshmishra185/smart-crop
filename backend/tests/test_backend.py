import io
import pytest
from PIL import Image
import httpx
from backend.app.main import app
from backend.app.database import SessionLocal, Base, engine
from backend.app.models import CropListing, MandiOrder, DiseaseDiagnosis, SoilAssessment

@pytest.fixture(scope="session", autouse=True)
def init_db():
    Base.metadata.create_all(bind=engine)
    yield

def create_synthetic_leaf(color=(25, 145, 25)):
    img = Image.new("RGB", (256, 256), color=color)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf.getvalue()

@pytest.fixture
def anyio_backend():
    return 'asyncio'

# 1. Health & Microservice Diagnostics Test
@pytest.mark.anyio
async def test_health_check():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "Krishi Saarthi" in data["service"]
        assert "CIB&RC" in data["ai_vision_engine"]
        assert "SQLAlchemy" in data["database"]

# 2. AI Vision Crop Disease Detection Tests
@pytest.mark.anyio
async def test_disease_detection():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        img_bytes = create_synthetic_leaf(color=(20, 180, 20))
        files = {"file": ("test_leaf.png", img_bytes, "image/png")}
        response = await client.post("/api/v1/predict/disease", files=files)
        assert response.status_code == 200
        data = response.json()
        assert "crop_name" in data
        assert "confidence_score" in data
        assert data["confidence_score"] >= 0.85
        assert data["cibrc_approved"] is True
        assert isinstance(data["symptoms"], list)

# 3. AI Soil Fertility & Agronomic Recommendation Tests
@pytest.mark.anyio
async def test_crop_recommendation_wheat():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "nitrogen": 135.0,
            "phosphorus": 60.0,
            "potassium": 50.0,
            "ph_level": 6.8,
            "rainfall_mm": 600.0,
            "temperature_c": 20.0,
            "humidity_pct": 60.0
        }
        response = await client.post("/api/v1/predict/crop-recommendation", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "Wheat" in data["primary_recommendation"]["crop_name"]
        assert data["primary_recommendation"]["suitability_score"] > 0.85
        assert len(data["top_recommendations"]) >= 3

# 4. APMC Mandi Benchmark Rates & Forecast Test
@pytest.mark.anyio
async def test_mandi_rates_feed():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/mandi/rates")
        assert response.status_code == 200
        data = response.json()
        assert data["total_commodities"] >= 4
        assert any("Wheat" in r["commodity"] for r in data["rates"])

# 5. Mandi Marketplace Crop Lot Creation & Fetching
@pytest.mark.anyio
async def test_marketplace_listing_flow():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Get listings
        get_res = await client.get("/api/v1/marketplace/listings")
        assert get_res.status_code == 200

        # Post new crop lot
        new_lot = {
            "title": "Bio-Organic Mustard - Pusa Bold High Oil",
            "crop_category": "Mustard",
            "variety": "Pusa Bold Special",
            "quantity_quintals": 95.0,
            "price_per_quintal": 6150.0,
            "moisture_percentage": 7.5,
            "quality_grade": "Grade A+",
            "harvest_date": "2026-03-20",
            "mandi_location": "Khanna Mandi",
            "state": "Punjab",
            "organic_certified": True,
            "seller_name": "Major Harpreet Singh",
            "seller_phone": "+91 98144 55210"
        }
        post_res = await client.post("/api/v1/marketplace/listings", json=new_lot)
        assert post_res.status_code == 201
        created = post_res.json()
        assert created["verification_hash"].startswith("KS-APMC-")

# 6. Mandi Orders & Dual Escrow Settlement (Razorpay + COD)
@pytest.mark.anyio
async def test_order_settlement_razorpay():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        order_payload = {
            "buyer_name": "Ludhiana Roller Flour Mills Pvt Ltd",
            "buyer_phone": "+91 98888 12345",
            "delivery_address": "Silo Yard 4, G.T. Road, Ludhiana",
            "pin_code": "141001",
            "quantity_quintals": 30.0,
            "payment_mode": "RAZORPAY",
            "payment_id": "pay_test_rzp_89218a"
        }
        response = await client.post("/api/v1/marketplace/orders", json=order_payload)
        assert response.status_code == 201
        order = response.json()
        assert order["order_number"].startswith("ORD-")
        assert order["payment_status"] == "ESCROW_LOCKED"
        assert order["payment_mode"] == "RAZORPAY"

        # Verify tracking
        track = await client.get(f"/api/v1/marketplace/orders/{order['order_number']}")
        assert track.status_code == 200
        assert track.json()["order_number"] == order["order_number"]

@pytest.mark.anyio
async def test_order_settlement_cod():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        order_payload = {
            "buyer_name": "Aggarwal Traders Mandi Hub",
            "buyer_phone": "+91 97777 54321",
            "delivery_address": "Shop No 14, APMC Mandi, Sirsa",
            "pin_code": "125055",
            "quantity_quintals": 20.0,
            "payment_mode": "COD"
        }
        response = await client.post("/api/v1/marketplace/orders", json=order_payload)
        assert response.status_code == 201
        order = response.json()
        assert order["payment_status"] == "PENDING_DELIVERY_COD"
        assert order["payment_mode"] == "COD"

# 7. Database Records Persistence Check
def test_database_persistence():
    db = SessionLocal()
    try:
        listings_count = db.query(CropListing).count()
        assert listings_count > 0
        orders_count = db.query(MandiOrder).count()
        assert orders_count > 0
        diagnosis_count = db.query(DiseaseDiagnosis).count()
        assert diagnosis_count > 0
        assessment_count = db.query(SoilAssessment).count()
        assert assessment_count > 0
    finally:
        db.close()
