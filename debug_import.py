print("Step 1: importing asyncio", flush=True)
import asyncio
print("Step 2: importing httpx", flush=True)
import httpx
print("Step 3: importing backend.app.main", flush=True)
from backend.app.main import app
print("Step 4: imported backend.app.main", flush=True)

async def main():
    print("Step 5: starting async client", flush=True)
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        print("Step 6: posting request-otp", flush=True)
        res1 = await client.post("/api/v1/auth/request-otp", json={
            "identifier": "+91 98140 23891",
            "channel": "phone",
            "purpose": "signup",
            "full_name": "Sardar Balwinder Singh Dhillon"
        })
        print("Request OTP status:", res1.status_code, flush=True)
        data1 = res1.json()
        print("Response:", data1, flush=True)
        otp = data1["dev_otp"]

        print("Step 7: posting verify-otp", flush=True)
        res2 = await client.post("/api/v1/auth/verify-otp", json={
            "identifier": "+91 98140 23891",
            "otp_code": otp
        })
        print("Verify OTP status:", res2.status_code, flush=True)
        print("Verify Response:", res2.json(), flush=True)

if __name__ == "__main__":
    asyncio.run(main())
