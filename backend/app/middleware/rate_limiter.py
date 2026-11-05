import os
import time
import json
from collections import defaultdict

class SlidingWindowRateLimiter:
    """
    Enterprise Sliding Window Rate Limiter for DDoS & Abuse Prevention (Pure ASGI).
    Supports Redis distributed key-expiry windows when REDIS_URL is configured,
    with automatic zero-dependency in-memory fallback.
    """
    def __init__(self, app, max_requests: int = 60, window_seconds: int = 60):
        self.app = app
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.clients = defaultdict(list)
        self.redis_client = None

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

        self.rate_limited_paths = [
            "/api/v1/predict/disease",
            "/api/v1/marketplace/orders",
            "/api/v1/auth/request-otp"
        ]

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        path = scope.get("path", "")
        method = scope.get("method", "GET")
        is_sensitive = any(path.startswith(p) for p in self.rate_limited_paths)

        if not is_sensitive or method == "OPTIONS":
            await self.app(scope, receive, send)
            return

        headers = dict(scope.get("headers", []))
        forwarded = headers.get(b"x-forwarded-for")
        if forwarded:
            client_ip = forwarded.decode("latin1").split(",")[0].strip()
        else:
            client = scope.get("client")
            client_ip = client[0] if client else "127.0.0.1"

        now = time.time()
        remaining = self.max_requests
        is_blocked = False
        retry_after = self.window_seconds

        # 1. Distributed Redis Sliding Window
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
                    is_blocked = True
                else:
                    remaining = max(0, self.max_requests - current_requests - 1)
            except Exception:
                pass

        if not self.redis_client or (not is_blocked and remaining == self.max_requests):
            # 2. In-Memory Sliding Window
            client_history = self.clients[client_ip]
            self.clients[client_ip] = [ts for ts in client_history if now - ts < self.window_seconds]

            if len(self.clients[client_ip]) >= self.max_requests:
                is_blocked = True
                retry_after = max(1, int(self.window_seconds - (now - self.clients[client_ip][0])))
            else:
                self.clients[client_ip].append(now)
                remaining = max(0, self.max_requests - len(self.clients[client_ip]))

        if is_blocked:
            err_body = json.dumps({
                "detail": "Too many requests. Rate limit exceeded for sensitive agritech operations.",
                "retry_after_seconds": retry_after
            }).encode("utf-8")
            await send({
                "type": "http.response.start",
                "status": 429,
                "headers": [
                    (b"content-type", b"application/json"),
                    (b"retry-after", str(retry_after).encode("ascii")),
                    (b"x-ratelimit-limit", str(self.max_requests).encode("ascii")),
                    (b"x-ratelimit-remaining", b"0"),
                    (b"content-length", str(len(err_body)).encode("ascii")),
                ]
            })
            await send({
                "type": "http.response.body",
                "body": err_body,
                "more_body": False
            })
            return

        async def send_wrapper(message):
            if message["type"] == "http.response.start":
                res_headers = list(message.get("headers", []))
                res_headers.append((b"x-ratelimit-limit", str(self.max_requests).encode("ascii")))
                res_headers.append((b"x-ratelimit-remaining", str(remaining).encode("ascii")))
                message["headers"] = res_headers
            await send(message)

        await self.app(scope, receive, send_wrapper)
