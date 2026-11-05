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


# 16. Transactional Outbox Pattern & Event Backbone Dispatcher
def test_transactional_outbox_dispatch():
    from backend.app.models import OutboxEvent
    from backend.app.events.outbox_worker import dispatch_pending_outbox_events
    from backend.app.events.kafka_producer import event_publisher
    db = SessionLocal()
    try:
        # Create synthetic outbox event
        test_event = OutboxEvent(
            aggregate_type="MandiOrder",
            aggregate_id=f"TEST-ORD-{uuid.uuid4().hex[:6]}",
            event_type="mandi.procurement.order.created",
            payload_json=json.dumps({"test": True, "amount": 50000}),
            status="PENDING",
            partition_key="Khanna Mandi"
        )
        db.add(test_event)
        db.commit()

        # Run outbox worker
        dispatched = dispatch_pending_outbox_events(db=db)
        assert dispatched >= 1

        # Check DB state updated to PUBLISHED
        db.refresh(test_event)
        assert test_event.status == "PUBLISHED"

        # Check in-memory event publisher received the event
        assert len(event_publisher.published_events) > 0
    finally:
        db.close()


# 17. Pluggable KYC Providers & AES-256 Envelope Encryption
def test_kyc_providers_and_envelope_encryption():
    from backend.app.services.kyc_provider import (
        SandboxKycProvider,
        ProductionDigiLockerProvider,
        envelope_encryption
    )

    # Test Sandbox Provider
    sandbox = SandboxKycProvider()
    res1 = sandbox.verify_aadhaar("5489 1234 3891", "123456", "Balwinder Singh")
    assert res1["success"] is True
    assert res1["masked_aadhaar"] == "XXXX-XXXX-3891"

    # Test Production DigiLocker Provider (Cryptographic Signature Verification)
    digilocker = ProductionDigiLockerProvider()
    res2 = digilocker.verify_aadhaar("5489 1234 3891", "654321", "Balwinder Singh")
    assert res2["success"] is True
    assert "CCA-INDIA-" in res2["cert_serial"]

    # Test AES-256-GCM Envelope Encryption & Authenticated Decryption
    secret_aadhaar = "548912343891"
    cipher_token = envelope_encryption.encrypt(secret_aadhaar)
    assert cipher_token != secret_aadhaar
    decrypted = envelope_encryption.decrypt(cipher_token)
    assert decrypted == secret_aadhaar


# 18. Razorpay Route Split Calculation (98.5% Farmer / 1.5% APMC Cess)
def test_razorpay_route_splits():
    from backend.app.routers.marketplace import create_mandi_order
    from backend.app.schemas import MandiOrderCreate
    from backend.app.models import OutboxEvent
    db = SessionLocal()
    try:
        payload = MandiOrderCreate(
            buyer_name="Adani Agri Logistics Hub",
            buyer_phone="+91 98888 11223",
            delivery_address="Mandi Yard Silo 4, Ludhiana",
            pin_code="141001",
            quantity_quintals=100.0,
            payment_mode="RAZORPAY"
        )
        order = create_mandi_order(payload=payload, db=db)
        
        # Verify outbox event contains 98.5% direct farmer split
        event = db.query(OutboxEvent).filter(OutboxEvent.aggregate_id == order.order_number).first()
        assert event is not None
        data = json.loads(event.payload_json)
        splits = data["razorpay_route_splits"]
        total = data["total_amount_inr"]
        assert splits["farmer_bank_account_inr"] == round(total * 0.985, 2)
        assert splits["apmc_mandi_cess_inr"] == round(total * 0.015, 2)
    finally:
        db.close()


# 19. Webhook Anti-Replay Protection (Timestamp & Nonce)
def test_webhook_anti_replay_protection():
    import hmac, hashlib
    from backend.app.routers.marketplace import verify_and_process_razorpay_webhook, RAZORPAY_WEBHOOK_SECRET
    from fastapi import HTTPException
    db = SessionLocal()
    try:
        # Replay attack with timestamp older than 300 seconds
        old_epoch = 1500000000  # Year 2017
        body = json.dumps({
            "id": "evt_replay_attack_001",
            "event": "payment.captured",
            "created_at": old_epoch,
            "payload": {"payment": {"entity": {"id": "pay_replay_001", "amount": 1000}}}
        }).encode("utf-8")
        sig = hmac.new(RAZORPAY_WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()

        with pytest.raises(HTTPException) as excinfo:
            verify_and_process_razorpay_webhook(body, sig, db)
        assert excinfo.value.status_code == 400
        assert "Anti-Replay" in excinfo.value.detail
    finally:
        db.close()


# 20. Circuit Breaker Fast-Fail & Prometheus Metrics SLIs
def test_circuit_breaker_and_prometheus_metrics():
    from backend.app.services.circuit_breaker import CircuitBreaker, CircuitBreakerOpenException
    from backend.app.main import prometheus_metrics

    # Test Circuit Breaker
    cb = CircuitBreaker(failure_threshold=2, recovery_timeout_seconds=10)
    def fail_fn():
        raise ConnectionError("APMC Mandi Gateway Timeout")

    with pytest.raises(ConnectionError):
        cb.execute(fail_fn)
    with pytest.raises(ConnectionError):
        cb.execute(fail_fn)

    # Third call should immediately fast-fail with CircuitBreakerOpenException
    with pytest.raises(CircuitBreakerOpenException):
        cb.execute(fail_fn)
    assert cb.state == "OPEN"

    # Test Prometheus Metrics Endpoint
    metrics_str = prometheus_metrics()
    assert "krishi_saarthi_http_requests_total" in metrics_str
    assert "krishi_saarthi_inference_duration_seconds" in metrics_str
    assert "krishi_saarthi_escrow_settled_amount_inr" in metrics_str


# 21. Banking Gateway: Penny Drop & Razorpay Route Split (98.5% Farmer / 1.5% APMC)
def test_banking_gateway_route_split_and_penny_drop():
    from backend.app.services.banking_gateway import banking_gateway

    # Test Penny Drop verification
    penny_res = banking_gateway.verify_bank_account_penny_drop(
        account_number="50100234567890",
        ifsc_code="HDFC0000123",
        expected_farmer_name="Gurpreet Singh"
    )
    assert penny_res.status == "VERIFIED"
    assert penny_res.name_match_score >= 0.95
    assert penny_res.bank_name == "HDFC Bank Ltd"
    assert "HDFC0000123" in penny_res.ifsc_code

    # Test Dual Route Split Settlement
    route_split = banking_gateway.calculate_route_splits(total_amount_inr=100000.0)
    assert route_split["farmer_direct_payout_inr"] == 98500.0  # 98.5%
    assert route_split["apmc_mandi_cess_inr"] == 1500.0        # 1.5%

    # Test Dynamic UPI Intent
    upi_intent = banking_gateway.generate_dynamic_upi_qr(
        order_number="ORD-TEST-9988",
        amount_inr=50000.0,
        payee_name="Krishi Saarthi Escrow"
    )
    assert upi_intent.startswith("upi://pay?")
    assert "am=50000.00" in upi_intent
    assert "cu=INR" in upi_intent


# 22. DigiLocker & India AgriStack Kisan D-ID Gateway
def test_digilocker_agristack_gateway():
    from backend.app.services.digilocker_gateway import digilocker_gateway

    # Test Consent URL generation
    oauth_url = digilocker_gateway.generate_consent_url(
        farmer_phone="+919814455210",
        redirect_uri="https://krishisaarthi.in/oauth/callback"
    )
    assert "https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize" in oauth_url
    assert "response_type=code" in oauth_url
    assert "scope=Aadhaar+LandRecord+PMKisan" in oauth_url

    # Test Kisan D-ID Profile Fetch
    kisan_profile = digilocker_gateway.fetch_agristack_farmer_profile(
        auth_code="digilocker_auth_code_mock_001",
        farmer_name="Sardar Balwinder Singh Dhillon",
        aadhaar_hash="XXXX-XXXX-3891"
    )
    assert kisan_profile.kisan_did.startswith("IN-PB-LDH-")
    assert kisan_profile.digital_signature_valid is True
    assert kisan_profile.land_record_ror["state"] == "Punjab"
    assert kisan_profile.land_record_ror["total_area_hectares"] == 8.4




# 23. Agmarknet APMC Live Price Service & e-NAM Clearinghouse
def test_agmarknet_service_and_enam_gatepass():
    from backend.app.services.agmarknet_service import agmarknet_service

    rates = agmarknet_service.get_live_mandi_rates(state="Punjab")
    assert isinstance(rates, list)
    assert len(rates) > 0
    first_rate = rates[0]
    assert "commodity" in first_rate
    assert "modal_price_per_quintal" in first_rate
    assert first_rate["modal_price_per_quintal"] > 0

    # Test e-NAM Gatepass Status
    gatepass = agmarknet_service.get_enam_gatepass_status(lot_id="LOT-KHANNA-2026-99")
    assert gatepass["enam_portal_status"] == "AUTHENTICATED_AT_APMC_WEIGHBRIDGE"
    assert "weighment_slips" in gatepass
    assert gatepass["weighment_slips"]["moisture_content_pct"] <= 14.0


# 24. IMD Agromet Advisory & Foliar Spore Pressure Index (FSPI)
def test_live_weather_and_foliar_spore_index():
    from backend.app.services.live_weather_service import live_weather_service

    weather = live_weather_service.get_current_agromet_telemetry(
        latitude=30.9010,
        longitude=75.8573,
        crop_type="Wheat"
    )
    assert "telemetry" in weather
    assert "temperature_c" in weather["telemetry"]
    assert "agromet_advisory" in weather
    assert "spore_pressure_index_0_to_100" in weather["agromet_advisory"]
    assert "advisory_pa" in weather["agromet_advisory"]
    assert "irrigation_recommendation" in weather


# 25. Copernicus Sentinel-2 L2A Satellite Pipeline
def test_copernicus_sentinel_pipeline():
    from backend.app.services.satellite_pipeline import copernicus_pipeline

    result = copernicus_pipeline.process_field_envelope(
        min_lon=75.80,
        min_lat=30.85,
        max_lon=75.92,
        max_lat=30.95,
        cluster_name="Ludhiana Agro Cluster"
    )
    assert result["cluster"] == "Ludhiana Agro Cluster"
    assert "Sentinel-2" in result["satellite_mission"]
    assert "spectral_indices" in result
    assert "NDVI" in result["spectral_indices"]
    assert "SAVI" in result["spectral_indices"]
    assert "EVI" in result["spectral_indices"]
    assert len(result["cells"]) == 36  # 6x6 grid






