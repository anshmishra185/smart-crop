import sys
from fastapi import FastAPI
from fastapi.testclient import TestClient
from backend.app.routers.auth import router
from backend.app.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(router, prefix="/api/v1/auth")

client = TestClient(app)

print("Sending request-otp for phone...", flush=True)
res1 = client.post("/api/v1/auth/request-otp", json={
    "identifier": "+91 98140 23891",
    "channel": "phone",
    "purpose": "signup",
    "full_name": "Balwinder Singh"
})
print("res1 status:", res1.status_code, flush=True)
print("res1 json:", res1.json(), flush=True)

otp = res1.json()["dev_otp"]
print("Sending verify-otp...", flush=True)
res2 = client.post("/api/v1/auth/verify-otp", json={
    "identifier": "+91 98140 23891",
    "otp_code": otp
})
print("res2 status:", res2.status_code, flush=True)
print("res2 json:", res2.json(), flush=True)
