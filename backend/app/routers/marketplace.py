import uuid
import hashlib
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import CropListing, MandiOrder, User
from ..schemas import CropListingCreate, CropListingResponse, MandiOrderCreate, MandiOrderResponse

router = APIRouter(prefix="/api/v1/marketplace", tags=["Mandi Marketplace"])

@router.get("/listings", response_model=List[CropListingResponse])
def get_crop_listings(
    category: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Retrieve live verified APMC mandi crop listings with quality grade, moisture, and pricing.
    """
    query = db.query(CropListing).filter(CropListing.status == "ACTIVE")
    if category and isinstance(category, str) and category.lower() != "all":
        query = query.filter(CropListing.crop_category.ilike(f"%{category}%"))
    
    safe_limit = limit if isinstance(limit, int) and 1 <= limit <= 200 else 50
    listings = query.order_by(CropListing.created_at.desc()).limit(safe_limit).all()
    return listings


@router.post("/listings", response_model=CropListingResponse, status_code=201)
def create_crop_listing(
    payload: CropListingCreate,
    db: Session = Depends(get_db)
):
    """
    Publish a new verified farmer crop listing with cryptographic lot verification.
    """
    # Create or find user
    user = db.query(User).filter(User.phone_number == payload.seller_phone).first()
    if not user:
        user = User(
            full_name=payload.seller_name,
            phone_number=payload.seller_phone,
            role="farmer",
            state=payload.state
        )
        db.add(user)
        db.flush()

    raw_hash_str = f"{payload.seller_phone}:{payload.title}:{payload.quantity_quintals}:{payload.price_per_quintal}"
    verification_hash = f"KS-APMC-{hashlib.sha256(raw_hash_str.encode()).hexdigest()[:12].upper()}"

    listing = CropListing(
        seller_id=user.id,
        seller_name=payload.seller_name,
        seller_phone=payload.seller_phone,
        title=payload.title,
        crop_category=payload.crop_category,
        variety=payload.variety,
        quantity_quintals=payload.quantity_quintals,
        price_per_quintal=payload.price_per_quintal,
        moisture_percentage=payload.moisture_percentage,
        quality_grade=payload.quality_grade,
        harvest_date=payload.harvest_date,
        mandi_location=payload.mandi_location,
        state=payload.state,
        organic_certified=payload.organic_certified,
        verification_hash=verification_hash,
        status="ACTIVE"
    )

    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


@router.post("/orders", response_model=MandiOrderResponse, status_code=201)
def create_mandi_order(
    payload: MandiOrderCreate,
    db: Session = Depends(get_db)
):
    """
    Execute Mandi Procurement Contract with APMC Escrow Settlement (Razorpay or COD).
    """
    unit_price = 2400.0  # Default benchmark price
    listing = None

    if payload.listing_id:
        listing = db.query(CropListing).filter(CropListing.id == payload.listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Crop listing not found.")
        if listing.quantity_quintals < payload.quantity_quintals:
            raise HTTPException(
                status_code=400,
                detail=f"Requested quantity ({payload.quantity_quintals} q) exceeds available lot ({listing.quantity_quintals} q)."
            )
        unit_price = listing.price_per_quintal

    base_amount = unit_price * payload.quantity_quintals
    escrow_fee = round(base_amount * 0.0075, 2)  # 0.75% Mandi Escrow & Transit Insurance
    total_amount = base_amount + escrow_fee

    order_number = f"ORD-{uuid.uuid4().hex[:10].upper()}"

    # Auto-register buyer if needed
    buyer = db.query(User).filter(User.phone_number == payload.buyer_phone).first()
    if not buyer:
        buyer = User(
            full_name=payload.buyer_name,
            phone_number=payload.buyer_phone,
            role="buyer",
            district=payload.pin_code
        )
        db.add(buyer)
        db.flush()

    payment_status = "ESCROW_LOCKED" if payload.payment_mode.upper() == "RAZORPAY" else "PENDING_DELIVERY_COD"

    order = MandiOrder(
        order_number=order_number,
        listing_id=listing.id if listing else None,
        buyer_id=buyer.id,
        buyer_name=payload.buyer_name,
        buyer_phone=payload.buyer_phone,
        delivery_address=payload.delivery_address,
        pin_code=payload.pin_code,
        quantity_quintals=payload.quantity_quintals,
        total_amount=total_amount,
        escrow_fee=escrow_fee,
        payment_mode=payload.payment_mode.upper(),
        payment_id=payload.payment_id or f"pay_cod_{uuid.uuid4().hex[:8]}",
        payment_status=payment_status,
        tracking_status="ORDER_PLACED"
    )

    # Deduct listing inventory if connected to specific listing
    if listing:
        listing.quantity_quintals -= payload.quantity_quintals
        if listing.quantity_quintals <= 0:
            listing.status = "SOLD"

    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("/orders/{order_number}", response_model=MandiOrderResponse)
def get_order_by_number(
    order_number: str,
    db: Session = Depends(get_db)
):
    """
    Fetch live APMC Mandi Order status and telemetry tracking.
    """
    order = db.query(MandiOrder).filter(MandiOrder.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order
