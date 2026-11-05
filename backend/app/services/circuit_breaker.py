import time
import logging
from typing import Callable, Any

logger = logging.getLogger("krishi_saarthi_circuit_breaker")
logger.setLevel(logging.INFO)

class CircuitBreakerOpenException(Exception):
    """Raised when an external dependency is failing and circuit is OPEN."""
    pass

class CircuitBreaker:
    """
    Enterprise Circuit Breaker (Resilience4j / Envoy pattern)
    Protects microservice from cascading failures during external APMC / Weather outages.
    """
    def __init__(self, failure_threshold: int = 5, recovery_timeout_seconds: int = 30):
        self.failure_threshold = failure_threshold
        self.recovery_timeout_seconds = recovery_timeout_seconds
        self.failure_count = 0
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
        self.last_state_change = time.time()

    def execute(self, func: Callable, *args, **kwargs) -> Any:
        now = time.time()

        # Check if circuit should transition from OPEN -> HALF_OPEN
        if self.state == "OPEN":
            if now - self.last_state_change > self.recovery_timeout_seconds:
                self.state = "HALF_OPEN"
                self.last_state_change = now
                logger.info("[CircuitBreaker] Transitioning from OPEN -> HALF_OPEN. Testing canary call.")
            else:
                raise CircuitBreakerOpenException("Circuit is OPEN. Downstream dependency unavailable. Fast-failing.")

        try:
            result = func(*args, **kwargs)
            # If successful in HALF_OPEN, reset back to CLOSED
            if self.state == "HALF_OPEN":
                self.state = "CLOSED"
                self.failure_count = 0
                self.last_state_change = now
                logger.info("[CircuitBreaker] Canary succeeded. Circuit transitioned to CLOSED.")
            return result
        except Exception as e:
            self.failure_count += 1
            if self.failure_count >= self.failure_threshold:
                self.state = "OPEN"
                self.last_state_change = now
                logger.error(f"[CircuitBreaker] Failure threshold reached ({self.failure_count}). Circuit is now OPEN.")
            raise e

def xfetch_probabilistic_early_expiration(
    cache_read_fn: Callable[[], Any],
    cache_write_fn: Callable[[Any, float], None],
    compute_fn: Callable[[], Any],
    beta: float = 1.0,
    ttl_seconds: float = 900.0
) -> Any:
    """
    XFetch Algorithm (Vattani et al., VLDB 2015)
    Probabilistic early expiration to prevent Cache Stampedes / Thundering Herd problems.
    Formula: -beta * delta * ln(random()) > (expiry - now)
    """
    import math
    import random

    now = time.time()
    cached_entry = cache_read_fn()

    if cached_entry:
        val, expiry, delta = cached_entry.get("val"), cached_entry.get("expiry", 0), cached_entry.get("delta", 0.05)
        # Probabilistic computation
        if now - (delta * beta * math.log(random.random() or 0.0001)) < expiry:
            return val

    # Compute fresh value
    t0 = time.time()
    fresh_val = compute_fn()
    delta = time.time() - t0
    expiry = now + ttl_seconds

    cache_write_fn({"val": fresh_val, "expiry": expiry, "delta": delta}, ttl_seconds)
    return fresh_val
