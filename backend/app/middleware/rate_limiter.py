import os
import time
from collections import defaultdict
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

class SlidingWindowRateLimiter(BaseHTTPMiddleware):
    """
    Enterprise Sliding Window Rate Limiter for DDoS & Abuse Prevention.
    Supports Redis distributed key-expiry windows when REDIS_URL is configured,
    with automatic zero-dependency in-memory fallback.
    """
    def __init__(self, app, max_requests: int = 60, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.clients = defaultdict(list)
        self.redis_client = None

        # Check for optional Redis connection
        redis_url = os.getenv("REDIS_URL")
        if redis_url:
            try:
                import redis
                self.redis_client = redis.from_url(redis_url, decode_responses=True)
                self.redis_client.ping()
                print(f"[RateLimiter] Connected to Redis cluster at {redis_url}")
            except Exception as e:
                print(f"[RateLimiter] Redis unavailable ({e}). Using in-memory sliding window.")
                self.redis_client = None

        # Protect specific compute-intensive or payment endpoints
        self.rate_limited_paths = [
            "/api/v1/predict/disease",
            "/api/v1/marketplace/orders",
            "/api/v1/auth/request-otp"
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

        # 1. Distributed Redis Sliding Window (when available)
        if self.redis_client:
            try:
                key = f"ratelimit:{client_ip}:{path}"
                pipe = self.redis_client.pipeline()
                clear_before = now - self.window_seconds
                pipe.zremrangebyscore(key, 0, clear_before)
                pipe.zcard(key)
                pipe.zadd(key, {str(now): now})
                pipe.expire(key, self.window_seconds)
                results = pipe.execute()
                current_requests = results[1]

                if current_requests >= self.max_requests:
                    return JSONResponse(
                        status_code=429,
                        content={
                            "detail": "Too many requests. Rate limit exceeded for sensitive agritech operations.",
                            "retry_after_seconds": self.window_seconds
                        },
                        headers={
                            "Retry-After": str(self.window_seconds),
                            "X-RateLimit-Limit": str(self.max_requests),
                            "X-RateLimit-Remaining": "0"
                        }
                    )

                response = await call_next(request)
                response.headers["X-RateLimit-Limit"] = str(self.max_requests)
                response.headers["X-RateLimit-Remaining"] = str(max(0, self.max_requests - current_requests - 1))
                return response
            except Exception:
                # If Redis fails mid-operation, gracefully fall through to in-memory
                pass

        # 2. Resilient In-Memory Sliding Window Fallback
        client_history = self.clients[client_ip]
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
