"""Small helpers for identifiers and timestamps."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def session_id() -> str:
    return f"ga_{uuid.uuid4().hex[:12]}"


def reference_id() -> str:
    """Human-friendly report reference, e.g. GA-8F3A2C."""
    return f"GA-{uuid.uuid4().hex[:6].upper()}"


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Great-circle distance in km (used by the mock location service)."""
    from math import asin, cos, radians, sin, sqrt

    r = 6371.0
    dlat = radians(lat2 - lat1)
    dlng = radians(lng2 - lng1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng / 2) ** 2
    return round(2 * r * asin(sqrt(a)), 1)
