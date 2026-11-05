import asyncio
import httpx
from backend.app.main import app

async def main():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Test 1: Phone OTP
        print("\n--- Testing Phone OTP ---")
        res1 = await client.post("/api/v1/auth/request-otp", json={
            "identifier": "+91 98140 23891",
            "channel": "phone",
            "purpose": "signup",
            "full_name": "Sardar Balwinder Singh Dhillon"
        })
        print("Request OTP status:", res1.status_code)
        data1 = res1.json()
        print("Response:", data1)
        otp = data1["dev_otp"]

        res2 = await client.post("/api/v1/auth/verify-otp", json={
            "identifier": "+91 98140 23891",
            "otp_code": otp
        })
        print("Verify OTP status:", res2.status_code)
        print("Verify Response:", res2.json())

        # Test 2: Email OTP
        print("\n--- Testing Email OTP ---")
        res3 = await client.post("/api/v1/auth/request-otp", json={
            "identifier": "farmer.test@punjabagri.in",
            "channel": "email",
            "purpose": "login"
        })
        print("Request Email OTP status:", res3.status_code)
        otp_email = res3.json()["dev_otp"]

        res4 = await client.post("/api/v1/auth/verify-otp", json={
            "identifier": "farmer.test@punjabagri.in",
            "otp_code": otp_email
        })
        print("Verify Email OTP status:", res4.status_code)
        print("User profile:", res4.json()["user"])

if __name__ == "__main__":
    asyncio.run(main())
