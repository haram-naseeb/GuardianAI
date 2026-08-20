"""Mock Notification service (Section 16, 17, 23).

Simulates alerts to family, hospital (pre-alert), and emergency services. Clearly
labelled as simulated — no real dispatch occurs. Swap for a real comms provider
behind the same `NotificationService` Protocol once partnerships exist.
"""
from __future__ import annotations

from app.core.logging import get_logger
from app.schemas.emergency import NotificationStatus
from app.schemas.enums import NotificationChannel, NotificationState, Priority

logger = get_logger(__name__)

_DETAIL = {
    NotificationChannel.FAMILY: "Family contact notification simulated.",
    NotificationChannel.HOSPITAL: "Hospital pre-alert simulated.",
    NotificationChannel.EMERGENCY_SERVICE: "Emergency service escalation prepared.",
}


class MockNotificationService:
    name = "mock"

    def notify(self, channel: NotificationChannel, *, summary: str,
               priority: Priority) -> NotificationStatus:
        # Emergency-service escalation is only *prepared* (never auto-dispatched).
        if channel is NotificationChannel.EMERGENCY_SERVICE:
            state = NotificationState.PREPARED
        else:
            state = NotificationState.SIMULATED_SENT
        # Log the channel + state only — never the incident summary content.
        logger.info("notification channel=%s state=%s priority=%s", channel.value,
                    state.value, priority.value)
        return NotificationStatus(channel=channel, state=state,
                                  detail=_DETAIL[channel], simulated=True)
