import time
import uuid
import json
import logging
from datetime import datetime, timezone
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("krishi_saarthi_telemetry")
logger.setLevel(logging.INFO)

class CorrelationIdAndTelemetryMiddleware(BaseHTTPMiddleware):
    """
    Enterprise Observability Middleware:
    1. Attaches X-Request-ID to every incoming HTTP request and response.
    2. Measures exact processing latency (X-Process-Time-Ms).
    3. Outputs structured JSON telemetry logs.
    """
    async def dispatch(self, request: Request, call_next):
        # 1. Propagate or generate unique correlation request ID
        request_id = request.headers.get("X-Request-ID", f"req_{uuid.uuid4().hex[:12]}")
        request.state.request_id = request_id

        start_time = time.perf_counter()
        response = await call_next(request)
        process_time_ms = round((time.perf_counter() - start_time) * 1000.0, 2)

        # 2. Add response observability headers
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time-Ms"] = str(process_time_ms)

        # 3. Structured JSON log line
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "latency_ms": process_time_ms
        }
        logger.info(json.dumps(log_entry))

        return response

