"""Repository interfaces (Section 27, 35).

Storage is behind an abstract interface so the concrete backend can be swapped
(in-memory today → Alibaba Cloud Database / Firebase / Postgres tomorrow) without
touching the API or agent layers.
"""
from __future__ import annotations

from typing import Optional, Protocol, runtime_checkable

from app.models.domain import EmergencySession


@runtime_checkable
class SessionRepository(Protocol):
    def save(self, session: EmergencySession) -> EmergencySession: ...
    def get(self, session_id: str) -> Optional[EmergencySession]: ...
    def list(self, limit: int = 50) -> list[EmergencySession]: ...
