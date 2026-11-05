import io
import uuid
import hmac
import json
import hashlib
import pytest
from PIL import Image
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


# 1. Observability, Telemetry & Diagnostics Test
def test_health_check_and_telemetry():
    from backend.app.main import health_check
    res = health_check()
    assert res["status"] in ["healthy", "degraded"]
    assert "latency_ms" in res["database"]
    assert res["ai_deep_learning"]["onnx_runtime_ready"] is True
    assert res["ai_deep_learning"]["classes_count"] >= 4
    assert "memory_usage_pct" in res["system_resources"]


# 2. Rate Limiting Middleware Configuration & Path Protection
def test_rate_limiter_protection():
    from backend.app.middleware.rate_limiter import SlidingWindowRateLimiter
    limiter = SlidingWindowRateLimiter(app=None, max_requests=60, window_seconds=60)
    assert limiter.max_requests == 60
    assert "/api/v1/predict/disease" in limiter.rate_limited_paths
    assert "/api/v1/marketplace/orders" in limiter.rate_limited_paths
    assert "/api/v1/auth/request-otp" in limiter.rate_limited_paths


# 3. Deep Learning Computer Vision Disease Diagnosis
def test_deep_learning_disease_detection():
    from backend.app.routers.disease import process_leaf_disease_diagnosis
    db = SessionLocal()
    try:
        img_bytes = create_synthetic_leaf(color=(160, 110, 40))
        res = process_leaf_disease_diagnosis(contents=img_bytes, filename="blight_leaf.png", db=db)
        assert res.crop_name is not None
        assert res.confidence_score >= 0.80
        assert res.cibrc_approved is True
        assert "MobileNetV3" in res.model_architecture
        assert res.inference_latency_ms is not None
        assert isinstance(res.differential_diagnoses, list)
    finally:
        db.close()


# 4. Idempotent Order Creation & Anti-Double-Charging
def test_idempotent_order_creation():
    from backend.app.routers.marketplace import create_mandi_order
    from backend.app.schemas import MandiOrderCreate
    db = SessionLocal()
    try:
        idempotency_key = f"idemp_test_key_{uuid.uuid4().hex[:8]}"
        order_payload = MandiOrderCreate(
            buyer_name="Kisan Agro Processing Hub",
            buyer_phone="+91 98765 00112",
            delivery_address="GT Road Grain Market, Khanna",
            pin_code="141401",
            quantity_quintals=15.0,
            payment_mode="RAZORPAY",
            payment_id="pay_idemp_001"
        )
        # First call creates order
        order1 = create_mandi_order(payload=order_payload, idempotency_key=idempotency_key, db=db)
        # Second call with SAME idempotency key returns exact SAME order without charging twice
        order2 = create_mandi_order(payload=order_payload, idempotency_key=idempotency_key, db=db)
        assert order1.order_number == order2.order_number
        assert order1.idempotency_key == idempotency_key
    finally:
        db.close()


# 5. Razorpay Cryptographic HMAC-SHA256 Webhook Verification
def test_razorpay_hmac_webhook():
    from backend.app.routers.marketplace import verify_and_process_razorpay_webhook, RAZORPAY_WEBHOOK_SECRET
    from fastapi import HTTPException
    db = SessionLocal()
    try:
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

        secret = RAZORPAY_WEBHOOK_SECRET
        valid_signature = hmac.new(
            key=secret.encode(),
            msg=webhook_body,
            digestmod=hashlib.sha256
        ).hexdigest()

        res = verify_and_process_razorpay_webhook(webhook_body, valid_signature, db)
        assert res["status"] == "success"

        # Tampered signature should be rejected with 400
        with pytest.raises(HTTPException) as excinfo:
            verify_and_process_razorpay_webhook(webhook_body, "tampered_fake_signature", db)
        assert excinfo.value.status_code == 400
    finally:
        db.close()


# 6. APMC Digital Escrow Release & QR Lot Verification
def test_escrow_release_flow():
    from backend.app.routers.marketplace import create_mandi_order, release_escrow_to_farmer
    from backend.app.schemas import MandiOrderCreate
    db = SessionLocal()
    try:
        order_payload = MandiOrderCreate(
            buyer_name="Malwa Trading Corporation",
            buyer_phone="+91 98777 66554",
            delivery_address="APMC Silo 9, Bathinda",
            pin_code="151001",
            quantity_quintals=20.0,
            payment_mode="RAZORPAY"
        )
        order = create_mandi_order(payload=order_payload, db=db)
        order_num = order.order_number
        qr_token = order.qr_delivery_token

        # Release escrow upon physical delivery verification
        released_order = release_escrow_to_farmer(order_number=order_num, qr_token=qr_token, db=db)
        assert released_order.payment_status == "ESCROW_SETTLED_TO_FARMER"
        assert released_order.tracking_status == "MANDI_DELIVERED"
        assert released_order.escrow_settled_at is not None
    finally:
        db.close()


# 7. AI Agronomic Crop Recommendation Engine
def test_crop_recommendation_wheat():
    from backend.app.routers.recommendations import get_crop_recommendation
    from backend.app.schemas import CropRecommendationRequest
    db = SessionLocal()
    try:
        payload = CropRecommendationRequest(
            nitrogen=135.0,
            phosphorus=60.0,
            potassium=50.0,
            ph_level=6.8,
            rainfall_mm=600.0,
            temperature_c=20.0,
            humidity_pct=60.0
        )
        data = get_crop_recommendation(request=payload, db=db)
        assert "Wheat" in data["primary_recommendation"]["crop_name"]
        assert data["primary_recommendation"]["suitability_score"] > 0.85
        assert len(data["top_recommendations"]) >= 3
    finally:
        db.close()


# 8. Mandi Rates & Forecast
def test_mandi_rates_feed():
    from backend.app.routers.mandi import get_mandi_rates
    data = get_mandi_rates()
    assert data["total_commodities"] >= 4
    assert any("Wheat" in r["commodity"] for r in data["rates"])


# 9. Marketplace Listings CRUD
def test_marketplace_listing_flow():
    from backend.app.routers.marketplace import get_crop_listings, create_crop_listing
    from backend.app.schemas import CropListingCreate
    db = SessionLocal()
    try:
        listings = get_crop_listings(db=db)
        assert len(listings) > 0

        new_lot = CropListingCreate(
            title="Bio-Organic Mustard - Pusa Bold High Oil",
            crop_category="Mustard",
            variety="Pusa Bold Special",
            quantity_quintals=95.0,
            price_per_quintal=6150.0,
            moisture_percentage=7.5,
            quality_grade="Grade A+",
            harvest_date="2026-03-20",
            mandi_location="Khanna Mandi",
            state="Punjab",
            organic_certified=True,
            seller_name="Major Harpreet Singh",
            seller_phone="+91 98144 55210"
        )
        created = create_crop_listing(payload=new_lot, db=db)
        assert created.verification_hash.startswith("KS-APMC-")
    finally:
        db.close()



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
    from backend.app.routers.auth import request_otp, verify_otp
    from backend.app.schemas import OtpRequest, OtpVerifyRequest
    db = SessionLocal()
    try:
        # Step 1: Request Mobile OTP for Login/Signup
        phone_req = OtpRequest(
            identifier="+91 98140 23891",
            channel="phone",
            purpose="signup",
            full_name="Sardar Balwinder Singh Dhillon",
            role="farmer"
        )
        res1 = request_otp(phone_req, db)
        assert res1.success is True
        assert "OTP successfully sent" in res1.message
        assert "+91 ******3891" in res1.masked_identifier
        dev_otp = res1.dev_otp
        assert len(dev_otp) == 6

        # Step 2: Verify with correct OTP
        verify_req = OtpVerifyRequest(
            identifier="+91 98140 23891",
            otp_code=dev_otp
        )
        res2 = verify_otp(verify_req, db)
        assert res2.success is True
        assert res2.token is not None
        assert res2.user.phone_number == "+91 98140 23891"
        assert res2.user.role == "farmer"

        # Step 3: Test Email OTP Flow
        email_req = OtpRequest(
            identifier="farmer.gurpreet@punjabagri.in",
            channel="email",
            purpose="login",
            full_name="Gurpreet Kaur"
        )
        res3 = request_otp(email_req, db)
        assert res3.success is True
        email_otp = res3.dev_otp

        res4 = verify_otp(
            OtpVerifyRequest(identifier="farmer.gurpreet@punjabagri.in", otp_code=email_otp),
            db
        )
        assert res4.user.email == "farmer.gurpreet@punjabagri.in"
    finally:
        db.close()


# 12. Rejection of Invalid or Forged OTP
def test_rejection_of_invalid_otp():
    from backend.app.routers.auth import verify_otp
    from backend.app.schemas import OtpVerifyRequest
    from fastapi import HTTPException
    db = SessionLocal()
    try:
        bad_verify = OtpVerifyRequest(
            identifier="+91 99999 11111",
            otp_code="000000"
        )
        with pytest.raises(HTTPException) as excinfo:
            verify_otp(bad_verify, db)
        assert excinfo.value.status_code == 400
        assert "Invalid or expired OTP" in excinfo.value.detail
    finally:
        db.close()


# 13. Aadhaar e-KYC Verification Sandbox Flow
def test_aadhaar_kyc_verification_flow():
    from backend.app.routers.auth import verify_aadhaar_kyc
    from backend.app.schemas import AadhaarKycRequest
    db = SessionLocal()
    try:
        kyc_payload = AadhaarKycRequest(
            aadhaar_number="5489 1234 3891",
            otp_code="123456",
            full_name="Sardar Balwinder Singh Dhillon"
        )
        res = verify_aadhaar_kyc(kyc_payload, db)
        assert res.success is True
        assert res.is_kyc_verified is True
        assert "3891" in res.aadhaar_masked_hash
        assert res.user.is_kyc_verified is True
    finally:
        db.close()


# 14. e-NAM APMC Digital Gate Pass Generation
def test_enam_gatepass_generation():
    from backend.app.routers.marketplace import generate_enam_gatepass
    db = SessionLocal()
    try:
        # Query an existing seeded order
        order = db.query(MandiOrder).first()
        assert order is not None
        res = generate_enam_gatepass(order_number=order.order_number, db=db)
        assert res.gatepass_number.startswith("eNAM-PB-")
        assert res.order_number == order.order_number
        assert "QR-" in res.qr_verification_token
        assert res.moisture_percentage > 0
        assert res.net_quantity_quintals > 0
    finally:
        db.close()


# 15. Sentinel-2 Satellite Multi-Spectral NDVI Assessment Pipeline
def test_sentinel2_satellite_ndvi_pipeline():
    from backend.app.routers.satellite import list_clusters, get_ndvi_assessment
    # Test cluster list
    clusters = list_clusters()
    assert len(clusters) >= 4
    assert any(c["id"] == "ludhiana" for c in clusters)

    # Test NDVI Assessment for Ludhiana
    data = get_ndvi_assessment(cluster="Ludhiana", grid_resolution="10m")
    assert "Sentinel-2" in data.satellite_mission
    assert data.average_ndvi > 0
    assert "Foliar stress" in data.pre_symptomatic_alert or "Canopy biomass" in data.pre_symptomatic_alert
    assert len(data.cells) == 36  # 6x6 grid
    first_cell = data.cells[0]
    assert first_cell.nir_band8 > 0
    assert first_cell.red_band4 > 0
    assert first_cell.ndvi is not None
    # Check NDVI formula consistency: (NIR - RED) / (NIR + RED)
    calculated_ndvi = round((first_cell.nir_band8 - first_cell.red_band4) / (first_cell.nir_band8 + first_cell.red_band4), 4)
    assert abs(calculated_ndvi - first_cell.ndvi) < 0.001



