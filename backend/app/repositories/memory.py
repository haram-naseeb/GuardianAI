"""In-memory session repository (Section 27).

Default implementation used today. It stores only coarse fields plus the
serialised response, and is intentionally ephemeral (process memory). Swap for a
persistent, encrypted store when the real database is connected — the API depends
only on the `SessionRepository` Protocol.
"""
from __future__ import annotations

from collections import OrderedDict
from functools import lru_cache
from typing import Optional

from app.models.domain import EmergencySession


class InMemorySessionRepository:
    def __init__(self, max_items: int = 200) -> None:
        self._store: "OrderedDict[str, EmergencySession]" = OrderedDict()
        self._max = max_items

    def save(self, session: EmergencySession) -> EmergencySession:
        self._store[session.id] = session
        self._store.move_to_end(session.id)
        while len(self._store) > self._max:
            self._store.popitem(last=False)  # evict oldest
        return session

    def get(self, session_id: str) -> Optional[EmergencySession]:
        return self._store.get(session_id)

    def list(self, limit: int = 50) -> list[EmergencySession]:
        return list(reversed(list(self._store.values())))[:limit]


@lru_cache
def get_session_repository() -> InMemorySessionRepository:
    return InMemorySessionRepository()
