import time
from collections import defaultdict
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

class SlidingWindowRateLimiter(BaseHTTPMiddleware):
    """
    In-memory Sliding Window Rate Limiter for DDoS & Abuse Prevention.
    Protects compute-intensive endpoints (AI Disease inference and Escrow orders).
    """
    def __init__(self, app, max_requests: int = 60, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.clients = defaultdict(list)
        # Protect specific compute-intensive or payment endpoints
        self.rate_limited_paths = [
            "/api/v1/predict/disease",
            "/api/v1/marketplace/orders"
        ]

    async def dispatch(self, request: Request, call_next):
        # Only rate limit targeted sensitive endpoints
        path = request.url.path
        is_sensitive = any(path.startswith(p) for p in self.rate_limited_paths)

        if not is_sensitive or request.method == "OPTIONS":
            return await call_next(request)

        # Get client IP (support X-Forwarded-For if behind reverse proxy/Cloudflare)
        forwarded = request.headers.get("X-Forwarded-For")
        client_ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "127.0.0.1")

        now = time.time()
        client_history = self.clients[client_ip]

        # Prune requests outside the current sliding window
        self.clients[client_ip] = [ts for ts in client_history if now - ts < self.window_seconds]

        if len(self.clients[client_ip]) >= self.max_requests:
            retry_after = int(self.window_seconds - (now - self.clients[client_ip][0]))
            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Too many requests. Rate limit exceeded for sensitive agritech operations.",
                    "retry_after_seconds": max(1, retry_after)
                },
                headers={
                    "Retry-After": str(max(1, retry_after)),
                    "X-RateLimit-Limit": str(self.max_requests),
                    "X-RateLimit-Remaining": "0"
                }
            )

        self.clients[client_ip].append(now)
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(self.max_requests)
        response.headers["X-RateLimit-Remaining"] = str(max(0, self.max_requests - len(self.clients[client_ip])))
        return response

