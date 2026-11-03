"""0001_initial_schema

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-11-03 12:52:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '0001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. users
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('full_name', sa.String(length=120), nullable=False),
        sa.Column('phone_number', sa.String(length=20), nullable=False, unique=True),
        sa.Column('role', sa.String(length=50), server_default='farmer'),
        sa.Column('state', sa.String(length=100), server_default='Punjab'),
        sa.Column('district', sa.String(length=100), server_default='Ludhiana'),
        sa.Column('created_at', sa.DateTime(), nullable=True)
    )

    # 2. crop_listings
    op.create_table(
        'crop_listings',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('seller_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('seller_name', sa.String(length=120), nullable=False),
        sa.Column('seller_phone', sa.String(length=20), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('crop_category', sa.String(length=100), nullable=False),
        sa.Column('variety', sa.String(length=100), nullable=False),
        sa.Column('quantity_quintals', sa.Float(), nullable=False),
        sa.Column('price_per_quintal', sa.Float(), nullable=False),
        sa.Column('moisture_percentage', sa.Float(), server_default='11.5'),
        sa.Column('quality_grade', sa.String(length=20), server_default='Grade A+'),
        sa.Column('harvest_date', sa.String(length=50), nullable=True),
        sa.Column('mandi_location', sa.String(length=120), server_default='Khanna Mandi'),
        sa.Column('state', sa.String(length=100), server_default='Punjab'),
        sa.Column('organic_certified', sa.Boolean(), server_default='0'),
        sa.Column('verification_hash', sa.String(length=100), nullable=True),
        sa.Column('status', sa.String(length=50), server_default='ACTIVE'),
        sa.Column('created_at', sa.DateTime(), nullable=True)
    )

    # 3. mandi_orders
    op.create_table(
        'mandi_orders',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('order_number', sa.String(length=64), nullable=False, unique=True),
        sa.Column('listing_id', sa.Integer(), sa.ForeignKey('crop_listings.id'), nullable=True),
        sa.Column('buyer_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('buyer_name', sa.String(length=120), nullable=False),
        sa.Column('buyer_phone', sa.String(length=20), nullable=False),
        sa.Column('delivery_address', sa.Text(), nullable=False),
        sa.Column('pin_code', sa.String(length=10), nullable=False),
        sa.Column('quantity_quintals', sa.Float(), nullable=False),
        sa.Column('total_amount', sa.Float(), nullable=False),
        sa.Column('escrow_fee', sa.Float(), server_default='0.0'),
        sa.Column('payment_mode', sa.String(length=30), server_default='COD'),
        sa.Column('payment_id', sa.String(length=120), nullable=True),
        sa.Column('idempotency_key', sa.String(length=128), unique=True, nullable=True),
        sa.Column('qr_delivery_token', sa.String(length=64), unique=True, nullable=True),
        sa.Column('escrow_settled_at', sa.DateTime(), nullable=True),
        sa.Column('payment_status', sa.String(length=50), server_default='ESCROW_LOCKED'),
        sa.Column('tracking_status', sa.String(length=50), server_default='ORDER_PLACED'),
        sa.Column('created_at', sa.DateTime(), nullable=True)
    )

    # 4. disease_diagnoses
    op.create_table(
        'disease_diagnoses',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('image_hash', sa.String(length=64), nullable=True),
        sa.Column('image_filename', sa.String(length=255), nullable=True),
        sa.Column('crop_name', sa.String(length=100), nullable=False),
        sa.Column('disease_name', sa.String(length=150), nullable=False),
        sa.Column('pathogen_type', sa.String(length=50), nullable=False),
        sa.Column('confidence_score', sa.Float(), nullable=False),
        sa.Column('severity_level', sa.String(length=50), server_default='Moderate'),
        sa.Column('affected_area_percentage', sa.Float(), server_default='15.0'),
        sa.Column('chemical_remedy', sa.Text(), nullable=False),
        sa.Column('biological_remedy', sa.Text(), nullable=False),
        sa.Column('prevention_advice', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True)
    )

    # 5. soil_assessments
    op.create_table(
        'soil_assessments',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('nitrogen', sa.Float(), nullable=False),
        sa.Column('phosphorus', sa.Float(), nullable=False),
        sa.Column('potassium', sa.Float(), nullable=False),
        sa.Column('ph_level', sa.Float(), nullable=False),
        sa.Column('rainfall_mm', sa.Float(), nullable=False),
        sa.Column('temperature_c', sa.Float(), nullable=False),
        sa.Column('humidity_pct', sa.Float(), nullable=False),
        sa.Column('recommended_crops', sa.Text(), nullable=False),
        sa.Column('estimated_gross_margin', sa.Float(), server_default='0.0'),
        sa.Column('soil_health_grade', sa.String(length=20), server_default='Optimal'),
        sa.Column('created_at', sa.DateTime(), nullable=True)
    )

def downgrade() -> None:
    op.drop_table('soil_assessments')
    op.drop_table('disease_diagnoses')
    op.drop_table('mandi_orders')
    op.drop_table('crop_listings')
    op.drop_table('users')

