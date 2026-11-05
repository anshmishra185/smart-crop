import time
import uuid
import json
import logging
from datetime import datetime, timezone

logger = logging.getLogger("krishi_saarthi_telemetry")
logger.setLevel(logging.INFO)

class CorrelationIdAndTelemetryMiddleware:
    """
    Enterprise Observability Pure ASGI Middleware:
    1. Attaches X-Request-ID to every incoming HTTP request and response.
    2. Measures exact processing latency (X-Process-Time-Ms).
    3. Outputs structured JSON telemetry logs without blocking or AnyIO deadlock risk.
    """
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        headers = dict(scope.get("headers", []))
        req_id_raw = headers.get(b"x-request-id")
        request_id = req_id_raw.decode("latin1") if req_id_raw else f"req_{uuid.uuid4().hex[:12]}"

        start_time = time.perf_counter()

        async def send_wrapper(message):
            if message["type"] == "http.response.start":
                process_time_ms = round((time.perf_counter() - start_time) * 1000.0, 2)
                res_headers = list(message.get("headers", []))
                res_headers.append((b"x-request-id", request_id.encode("latin1")))
                res_headers.append((b"x-process-time-ms", str(process_time_ms).encode("latin1")))
                message["headers"] = res_headers

                log_entry = {
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "request_id": request_id,
                    "method": scope.get("method"),
                    "path": scope.get("path"),
                    "status_code": message.get("status"),
                    "latency_ms": process_time_ms
                }
                logger.info(json.dumps(log_entry))
            await send(message)

        await self.app(scope, receive, send_wrapper)
