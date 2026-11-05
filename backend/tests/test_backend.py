import io
import hmac
import json
import hashlib
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
    img = Image.new("RGB", (224, 224), color=color)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf.getvalue()

@pytest.fixture
def anyio_backend():
    return 'asyncio'

# 1. Observability, Telemetry & Diagnostics Test
@pytest.mark.anyio
async def test_health_check_and_telemetry():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] in ["healthy", "degraded"]
        assert "latency_ms" in data["database"]
        assert data["ai_deep_learning"]["onnx_runtime_ready"] is True
        assert data["ai_deep_learning"]["classes_count"] >= 4
        assert "memory_usage_pct" in data["system_resources"]

        # Verify Correlation Tracing Headers
        assert "x-request-id" in response.headers
        assert "x-process-time-ms" in response.headers


# 2. Rate Limiting Middleware Protection
@pytest.mark.anyio
async def test_rate_limiter_headers():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        img_bytes = create_synthetic_leaf()
        files = {"file": ("test_leaf.png", img_bytes, "image/png")}
        response = await client.post("/api/v1/predict/disease", files=files)
        assert response.status_code == 200
        assert "x-ratelimit-limit" in response.headers
        assert "x-ratelimit-remaining" in response.headers


# 3. Deep Learning Computer Vision Disease Diagnosis
@pytest.mark.anyio
async def test_deep_learning_disease_detection():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        img_bytes = create_synthetic_leaf(color=(160, 110, 40))
        files = {"file": ("blight_leaf.png", img_bytes, "image/png")}
        response = await client.post("/api/v1/predict/disease", files=files)
        assert response.status_code == 200
        data = response.json()
        assert "crop_name" in data
        assert "confidence_score" in data
        assert data["confidence_score"] >= 0.85
        assert data["cibrc_approved"] is True
        assert "MobileNetV3" in data["model_architecture"]
        assert "inference_latency_ms" in data
        assert isinstance(data["differential_diagnoses"], list)


# 4. Idempotent Order Creation & Anti-Double-Charging
@pytest.mark.anyio
async def test_idempotent_order_creation():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        idempotency_key = "idemp_test_key_99281a"
        order_payload = {
            "buyer_name": "Kisan Agro Processing Hub",
            "buyer_phone": "+91 98765 00112",
            "delivery_address": "GT Road Grain Market, Khanna",
            "pin_code": "141401",
            "quantity_quintals": 15.0,
            "payment_mode": "RAZORPAY",
            "payment_id": "pay_idemp_001"
        }
        # First call creates order
        res1 = await client.post(
            "/api/v1/marketplace/orders",
            json=order_payload,
            headers={"Idempotency-Key": idempotency_key}
        )
        assert res1.status_code == 201
        order1 = res1.json()

        # Second call with SAME idempotency key returns exact SAME order without charging twice
        res2 = await client.post(
            "/api/v1/marketplace/orders",
            json=order_payload,
            headers={"Idempotency-Key": idempotency_key}
        )
        assert res2.status_code in [200, 201]
        order2 = res2.json()
        assert order1["order_number"] == order2["order_number"]
        assert order1["idempotency_key"] == idempotency_key


# 5. Razorpay Cryptographic HMAC-SHA256 Webhook Verification
@pytest.mark.anyio
async def test_razorpay_hmac_webhook():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Create an order first
        order_payload = {
            "buyer_name": "Punjab Bio Millers Ltd",
            "buyer_phone": "+91 98111 22334",
            "delivery_address": "Sector 3 Mandi Complex",
            "pin_code": "141002",
            "quantity_quintals": 10.0,
            "payment_mode": "RAZORPAY",
            "payment_id": "pay_webhook_test_123"
        }
        order_res = await client.post("/api/v1/marketplace/orders", json=order_payload)
        assert order_res.status_code == 201

        # Simulate Razorpay Webhook Event
        webhook_body = json.dumps({
            "event": "payment.captured",
            "payload": {
                "payment": {
                    "entity": {
                        "id": "pay_webhook_test_123",
                        "amount": 2400000,
                        "currency": "INR",
                        "status": "captured"
                    }
                }
            }
        }).encode("utf-8")

        secret = "whsec_krishi_saarthi_prod_mock_key"
        valid_signature = hmac.new(
            key=secret.encode(),
            msg=webhook_body,
            digestmod=hashlib.sha256
        ).hexdigest()

        # Post webhook with valid signature
        res = await client.post(
            "/api/v1/marketplace/webhooks/razorpay",
            content=webhook_body,
            headers={"X-Razorpay-Signature": valid_signature, "Content-Type": "application/json"}
        )
        assert res.status_code == 200
        assert res.json()["status"] == "success"

        # Verify tamper resistance (invalid signature rejection)
        bad_res = await client.post(
            "/api/v1/marketplace/webhooks/razorpay",
            content=webhook_body,
            headers={"X-Razorpay-Signature": "tampered_fake_signature", "Content-Type": "application/json"}
        )
        assert bad_res.status_code == 400


# 6. APMC Digital Escrow Release & QR Lot Verification
@pytest.mark.anyio
async def test_escrow_release_flow():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        order_payload = {
            "buyer_name": "Malwa Trading Corporation",
            "buyer_phone": "+91 98777 66554",
            "delivery_address": "APMC Silo 9, Bathinda",
            "pin_code": "151001",
            "quantity_quintals": 20.0,
            "payment_mode": "RAZORPAY"
        }
        order_res = await client.post("/api/v1/marketplace/orders", json=order_payload)
        order = order_res.json()
        order_num = order["order_number"]
        qr_token = order.get("qr_delivery_token")

        # Release escrow upon physical delivery verification
        release_res = await client.post(
            f"/api/v1/marketplace/orders/{order_num}/release-escrow",
            params={"qr_token": qr_token}
        )
        assert release_res.status_code == 200
        released_order = release_res.json()
        assert released_order["payment_status"] == "ESCROW_SETTLED_TO_FARMER"
        assert released_order["tracking_status"] == "MANDI_DELIVERED"
        assert released_order["escrow_settled_at"] is not None


# 7. AI Agronomic Crop Recommendation Engine
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


# 8. Mandi Rates & Forecast
@pytest.mark.anyio
async def test_mandi_rates_feed():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/mandi/rates")
        assert response.status_code == 200
        data = response.json()
        assert data["total_commodities"] >= 4
        assert any("Wheat" in r["commodity"] for r in data["rates"])


# 9. Marketplace Listings CRUD
@pytest.mark.anyio
async def test_marketplace_listing_flow():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        get_res = await client.get("/api/v1/marketplace/listings")
        assert get_res.status_code == 200

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


# 10. Database Persistence & Integrity
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


# 11. Mobile Number & Email OTP Request Authentication
def test_otp_request_and_verification_flow():
    import asyncio
    async def _run():
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
            # Step 1: Request Mobile OTP for Login/Signup
            phone_req = {
                "identifier": "+91 98140 23891",
                "channel": "phone",
                "purpose": "signup",
                "full_name": "Sardar Balwinder Singh Dhillon",
                "role": "farmer"
            }
            res1 = await client.post("/api/v1/auth/request-otp", json=phone_req)
            assert res1.status_code == 200
            data1 = res1.json()
            assert data1["success"] is True
            assert "OTP successfully sent" in data1["message"]
            assert "+91 ******3891" in data1["masked_identifier"]
            dev_otp = data1["dev_otp"]
            assert len(dev_otp) == 6

            # Step 2: Verify with correct OTP
            verify_req = {
                "identifier": "+91 98140 23891",
                "otp_code": dev_otp
            }
            res2 = await client.post("/api/v1/auth/verify-otp", json=verify_req)
            assert res2.status_code == 200
            data2 = res2.json()
            assert data2["success"] is True
            assert "token" in data2
            assert data2["user"]["phone_number"] == "+91 98140 23891"
            assert data2["user"]["role"] == "farmer"

            # Step 3: Test Email OTP Flow
            email_req = {
                "identifier": "farmer.gurpreet@punjabagri.in",
                "channel": "email",
                "purpose": "login",
                "full_name": "Gurpreet Kaur"
            }
            res3 = await client.post("/api/v1/auth/request-otp", json=email_req)
            assert res3.status_code == 200
            data3 = res3.json()
            email_otp = data3["dev_otp"]

            res4 = await client.post(
                "/api/v1/auth/verify-otp",
                json={"identifier": "farmer.gurpreet@punjabagri.in", "otp_code": email_otp}
            )
            assert res4.status_code == 200
            assert res4.json()["user"]["email"] == "farmer.gurpreet@punjabagri.in"

    asyncio.run(_run())


# 12. Rejection of Invalid or Forged OTP
def test_rejection_of_invalid_otp():
    import asyncio
    async def _run():
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
            bad_verify = {
                "identifier": "+91 99999 11111",
                "otp_code": "000000"
            }
            res = await client.post("/api/v1/auth/verify-otp", json=bad_verify)
            assert res.status_code == 400
            assert "Invalid or expired OTP" in res.json()["detail"]

    asyncio.run(_run())
