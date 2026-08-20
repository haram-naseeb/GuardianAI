"""Shared enumerations for Guardian AI.

Centralised so both the API schemas and the agent/graph layer refer to the
same canonical values. The frontend mirrors these in `frontend/src/types`.
"""
from __future__ import annotations

from enum import Enum


class Priority(str, Enum):
    """Emergency priority. Guardian AI estimates priority — it does not diagnose."""

    CRITICAL = "CRITICAL"  # Immediate, life-threatening danger signs observed
    HIGH = "HIGH"          # Serious condition requiring urgent professional attention
    MODERATE = "MODERATE"  # Concerning condition that should be evaluated soon
    LOW = "LOW"            # Minor or stable situation; general guidance applies

    @property
    def rank(self) -> int:
        return {"LOW": 0, "MODERATE": 1, "HIGH": 2, "CRITICAL": 3}[self.value]


class IncidentType(str, Enum):
    ROAD_ACCIDENT = "ROAD_ACCIDENT"
    MEDICAL_EMERGENCY = "MEDICAL_EMERGENCY"
    CARDIAC = "CARDIAC"
    BLEEDING = "BLEEDING"
    FALL = "FALL"
    BURN = "BURN"
    FIRE = "FIRE"
    BREATHING = "BREATHING"
    MINOR_INJURY = "MINOR_INJURY"
    UNKNOWN = "UNKNOWN"


class Severity(str, Enum):
    """Severity of an individual observed danger sign."""

    CRITICAL = "CRITICAL"
    WARNING = "WARNING"
    INFO = "INFO"


class Likelihood(str, Enum):
    """Cautious likelihood language for possible conditions (never a diagnosis)."""

    POSSIBLE = "POSSIBLE"
    SUSPECTED = "SUSPECTED"
    UNLIKELY = "UNLIKELY"


class NotificationChannel(str, Enum):
    FAMILY = "family"
    HOSPITAL = "hospital"
    EMERGENCY_SERVICE = "emergency_service"


class NotificationState(str, Enum):
    SIMULATED_SENT = "SIMULATED_SENT"
    PREPARED = "PREPARED"
    NOT_SENT = "NOT_SENT"


class Language(str, Enum):
    """Design-priority languages (Section 5). The final set depends on the
    speech/language models chosen during implementation."""

    EN = "en"       # English
    UR = "ur"       # Urdu
    ROMAN_UR = "ur-Latn"  # Roman Urdu (input scenario)
    PA = "pa"       # Punjabi
    SD = "sd"       # Sindhi
    PS = "ps"       # Pashto
    BAL = "bal"     # Balochi
