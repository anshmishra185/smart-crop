"""
Krishi Saarthi Backend Launcher
Starts FastAPI server respecting dynamic cloud PORT (Render, Railway, AWS, or local 8000).
"""
import os
import sys
import uvicorn

if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    port = int(os.getenv("PORT", 8000))

    print("=" * 60)
    print(" KRISHI SAARTHI AI/ML BACKEND MICROSERVICE")
    print("=" * 60)
    print(f" -> Server Port: {port}")
    print(f" -> Interactive Swagger Docs: http://0.0.0.0:{port}/docs")
    print(f" -> System Health Check: http://0.0.0.0:{port}/api/v1/health")
    print("=" * 60)

    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=False, workers=1)

