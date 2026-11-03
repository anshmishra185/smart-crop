"""
Krishi Saarthi Backend Launcher
Starts FastAPI server on http://127.0.0.1:8000.
"""
import sys
import uvicorn

if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    print("=" * 60)
    print(" KRISHI SAARTHI AI/ML BACKEND MICROSERVICE")
    print("=" * 60)
    print(" -> Server URL: http://127.0.0.1:8000")
    print(" -> Interactive Swagger Docs: http://127.0.0.1:8000/docs")
    print(" -> ReDoc Documentation: http://127.0.0.1:8000/redoc")
    print(" -> System Health Check: http://127.0.0.1:8000/api/v1/health")
    print("=" * 60)

    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=False, workers=1)
