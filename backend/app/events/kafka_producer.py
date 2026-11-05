import os
import json
import logging
from typing import Dict, Any, List

logger = logging.getLogger("krishi_saarthi_events")
logger.setLevel(logging.INFO)

class EventPublisher:
    """
    Enterprise Event Publisher with Apache Kafka / Redpanda integration
    and zero-dependency in-memory resilience for local development and CI testing.
    """
    def __init__(self):
        self.bootstrap_servers = os.getenv("KAFKA_BOOTSTRAP_SERVERS")
        self.published_events: List[Dict[str, Any]] = []
        self._producer = None

    async def start(self):
        if self.bootstrap_servers:
            try:
                from aiokafka import AIOKafkaProducer
                self._producer = AIOKafkaProducer(
                    bootstrap_servers=self.bootstrap_servers,
                    enable_idempotence=True,
                    acks="all",
                    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
                    key_serializer=lambda k: k.encode("utf-8") if k else None
                )
                await self._producer.start()
                logger.info(f"[Kafka] Connected to cluster at {self.bootstrap_servers}")
            except Exception as e:
                logger.warning(f"[Kafka] Cluster unavailable ({e}). Using in-memory event buffer.")
                self._producer = None

    async def stop(self):
        if self._producer:
            try:
                await self._producer.stop()
            except Exception:
                pass

    def publish_sync(self, topic: str, key: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Synchronously records or buffers the event."""
        event_record = {
            "topic": topic,
            "key": key,
            "payload": payload,
            "status": "BUFFERED_IN_MEMORY"
        }
        self.published_events.append(event_record)
        logger.info(f"[EventStream] Event recorded -> Topic: {topic} | Key: {key}")
        return event_record

    async def publish_async(self, topic: str, key: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Publishes event to Kafka topic or in-memory fallback buffer."""
        if self._producer:
            try:
                await self._producer.send_and_wait(topic, key=key, value=payload)
                return {"topic": topic, "key": key, "status": "DELIVERED_TO_KAFKA"}
            except Exception as e:
                logger.error(f"[Kafka] Failed to deliver event: {e}")

        return self.publish_sync(topic, key, payload)

# Global singleton event publisher
event_publisher = EventPublisher()

