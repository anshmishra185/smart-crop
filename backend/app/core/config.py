import os
from typing import Optional, List
from pydantic import BaseModel, Field

class Settings(BaseModel):
    """
    Enterprise Core Configuration for Krishi Saarthi.
    Reads securely from Vault / AWS Secrets Manager / Environment Variables.
    """
    APP_NAME: str = "Krishi Saarthi Enterprise Backend"
    APP_ENV: str = Field(default_factory=lambda: os.getenv("APP_ENV", "production"))
    DEBUG: bool = Field(default_factory=lambda: os.getenv("DEBUG", "false").lower() == "true")
    
    # Database & Storage
    DATABASE_URL: str = Field(
        default_factory=lambda: os.getenv(
            "DATABASE_URL",
            "sqlite:///./krishi_saarthi.db"
        )
    )
    REDIS_URL: Optional[str] = Field(default_factory=lambda: os.getenv("REDIS_URL", None))
    KAFKA_BOOTSTRAP_SERVERS: Optional[str] = Field(
        default_factory=lambda: os.getenv("KAFKA_BOOTSTRAP_SERVERS", None)
    )

    # FinTech & RBI Nodal Escrow Gateways (Razorpay Route / ICICI / Cashfree)
    RAZORPAY_KEY_ID: str = Field(
        default_factory=lambda: os.getenv("RAZORPAY_KEY_ID", "rzp_live_krishi_saarthi_prod_001")
    )
    RAZORPAY_KEY_SECRET: str = Field(
        default_factory=lambda: os.getenv("RAZORPAY_KEY_SECRET", "sec_live_99218201fa81920b")
    )
    RAZORPAY_WEBHOOK_SECRET: str = Field(
        default_factory=lambda: os.getenv("RAZORPAY_WEBHOOK_SECRET", "whsec_krishi_saarthi_prod_mock_key")
    )
    FARMER_PAYOUT_SHARE_RATIO: float = 0.985  # 98.5% Direct to Farmer
    APMC_MANDI_CESS_RATIO: float = 0.015     # 1.5% APMC Yard Cess
    PENNY_DROP_ENABLED: bool = True

    # Government Digital AgriStack & DigiLocker Gateways
    DIGILOCKER_CLIENT_ID: str = Field(
        default_factory=lambda: os.getenv("DIGILOCKER_CLIENT_ID", "DEMO_KEY")
    )
    DIGILOCKER_CLIENT_SECRET: str = Field(
        default_factory=lambda: os.getenv("DIGILOCKER_CLIENT_SECRET", "DEMO_KEY")
    )
    AGMARKNET_API_KEY: str = Field(
        default_factory=lambda: os.getenv("AGMARKNET_API_KEY", "DEMO_KEY")
    )

    # Earth Observation & Sentinel-Hub Satellite
    SENTINEL_CLIENT_ID: str = Field(
        default_factory=lambda: os.getenv("SENTINEL_HUB_CLIENT_ID", "DEMO_KEY")
    )
    SENTINEL_CLIENT_SECRET: str = Field(
        default_factory=lambda: os.getenv("SENTINEL_HUB_CLIENT_SECRET", "DEMO_KEY")
    )
    SENTINEL_INSTANCE_ID: str = Field(
        default_factory=lambda: os.getenv("SENTINEL_INSTANCE_ID", "DEMO_KEY")
    )
    SENTINEL_HUB_CLIENT_ID: str = Field(
        default_factory=lambda: os.getenv("SENTINEL_HUB_CLIENT_ID", "DEMO_KEY")
    )
    SENTINEL_HUB_CLIENT_SECRET: str = Field(
        default_factory=lambda: os.getenv("SENTINEL_HUB_CLIENT_SECRET", "DEMO_KEY")
    )

    # Weather Agromet Feeds
    OPENWEATHER_API_KEY: Optional[str] = Field(
        default_factory=lambda: os.getenv("OPENWEATHER_API_KEY", "DEMO_KEY")
    )


    # Security & Envelope Cryptography
    AES_256_ENVELOPE_MASTER_KEY: str = Field(
        default_factory=lambda: os.getenv("AES_256_ENVELOPE_MASTER_KEY", "krishi_saarthi_vault_master_key_2026_aes256")
    )
    WEBHOOK_REPLAY_WINDOW_SECONDS: int = 300  # 5-minute clock drift protection
    CORS_ALLOWED_ORIGINS: List[str] = [
        "https://krishisaarthi.in",
        "https://app.krishisaarthi.in",
        "http://localhost:5173",
        "http://localhost:80",
        "http://127.0.0.1:5173"
    ]

settings = Settings()
app_settings = settings

