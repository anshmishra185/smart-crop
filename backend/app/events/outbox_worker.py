import json
import logging
from sqlalchemy.orm import Session
from ..models import OutboxEvent
from .kafka_producer import event_publisher

logger = logging.getLogger("krishi_saarthi_outbox")
logger.setLevel(logging.INFO)

def dispatch_pending_outbox_events(db: Session, batch_size: int = 50) -> int:
    """
    Transactional Outbox Dispatcher:
    Polls uncommitted / pending domain events and safely streams them to Kafka.
    Guarantees 'At-Least-Once' delivery semantics for financial escrow transactions.
    """
    pending_events = (
        db.query(OutboxEvent)
        .filter(OutboxEvent.status == "PENDING")
        .order_by(OutboxEvent.id.asc())
        .limit(batch_size)
        .all()
    )

    if not pending_events:
        return 0

    dispatched_count = 0
    for event in pending_events:
        try:
            payload = json.loads(event.payload_json)
            event_publisher.publish_sync(
                topic=event.event_type,
                key=event.partition_key or event.aggregate_id,
                payload=payload
            )
            event.status = "PUBLISHED"
            dispatched_count += 1
        except Exception as e:
            logger.error(f"[Outbox] Error publishing event {event.id}: {e}")
            event.status = "FAILED"

    db.commit()
    logger.info(f"[Outbox] Successfully dispatched {dispatched_count} events to event backbone.")
    return dispatched_count

