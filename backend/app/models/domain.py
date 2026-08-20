"""Persistence domain models (Section 27).

These describe the entities Guardian AI will store. They are deliberately
decoupled from the API schemas so the storage layer can evolve independently.
Only `EmergencySession` is actively persisted today (via the in-memory repo);
the rest define the target shape for the real database (Alibaba Cloud) tomorrow.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class User:
    id: str
    display_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    is_guest: bool = True  # Emergency mode requires no account (Section 9.1)


@dataclass
class PatientHistoryRecord:
    id: str
    age: Optional[int] = None
    blood_group: Optional[str] = None
    # Sensitive free-text fields are stored encrypted at rest in the real DB.
    allergies: Optional[str] = None
    conditions: Optional[str] = None
    medications: Optional[str] = None
    notes: Optional[str] = None


@dataclass
class EmergencyAssessment:
    id: str
    priority: str
    incident_type: str
    confidence: float
    danger_signs: list[str] = field(default_factory=list)


@dataclass
class HospitalRecommendationRecord:
    id: str
    name: str
    distance_km: Optional[float] = None
    eta_minutes: Optional[int] = None


@dataclass
class EmergencyReportRecord:
    reference_id: str
    session_id: str
    created_at: str


@dataclass
class NotificationRecord:
    id: str
    session_id: str
    channel: str
    state: str


@dataclass
class KnowledgeSourceRecord:
    id: str
    title: str
    source: str
    url: Optional[str] = None


@dataclass
class EmergencySession:
    """The primary persisted record for one emergency analysis."""

    id: str
    created_at: str
    language: str
    priority: str
    incident_type: str
    response: dict = field(default_factory=dict)  # serialised EmergencyAnalysisResponse
