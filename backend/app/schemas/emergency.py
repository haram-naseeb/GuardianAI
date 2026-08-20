"""Pydantic schemas — the API contract for Guardian AI.

These models define the structured request and response for the emergency
analysis endpoint. The frontend's TypeScript types mirror this file exactly.

Design rule (Section 15): Guardian AI estimates priority and surfaces observed
indicators — it never returns a definitive medical diagnosis. The schema names
reflect that: `possible_conditions`, `observed_conditions`, `danger_signs`.
"""
from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field

from app.schemas.enums import (
    IncidentType,
    Likelihood,
    NotificationChannel,
    NotificationState,
    Priority,
    Severity,
)

# ---------------------------------------------------------------------------
# Shared / input models
# ---------------------------------------------------------------------------


class LocationInput(BaseModel):
    label: Optional[str] = Field(None, description="Human-readable place, e.g. 'Gulberg, Lahore'")
    lat: Optional[float] = None
    lng: Optional[float] = None
    source: str = Field("manual", description="'detected' (geolocation) or 'manual'")


class PatientHistory(BaseModel):
    """Optional and may be partially filled (Section 4.5).

    Sensitive: never logged in full (see app/core/logging.py)."""

    name: Optional[str] = None
    age: Optional[int] = Field(None, ge=0, le=130)
    allergies: Optional[str] = None
    conditions: Optional[str] = None
    medications: Optional[str] = None
    blood_group: Optional[str] = None
    notes: Optional[str] = None


class ImageMeta(BaseModel):
    """Metadata about a captured/uploaded incident image.

    We deliberately keep the heavy pixel payload optional. In mock mode the
    Vision service can key off `scenario_hint`; a real Vision provider will read
    `data_url` (base64) instead."""

    filename: Optional[str] = None
    content_type: Optional[str] = None
    size_bytes: Optional[int] = None
    source: str = Field("upload", description="'camera' or 'upload'")
    data_url: Optional[str] = Field(None, description="base64 data URL (used by real vision provider)")
    scenario_hint: Optional[str] = Field(None, description="demo hint for the mock vision service")


class EmergencyAnalysisRequest(BaseModel):
    description: str = Field("", description="Free-text emergency description (may come from voice).")
    language: str = Field("en", description="User's preferred language code.")
    location: Optional[LocationInput] = None
    patient_history: Optional[PatientHistory] = None
    image: Optional[ImageMeta] = None
    transcription: Optional[str] = Field(None, description="Voice transcription, if separate from description.")
    clarifications: dict[str, str] = Field(
        default_factory=dict,
        description="Answers to previously-asked clarifying questions, keyed by question id.",
    )
    scenario: Optional[str] = Field(
        None, description="Optional demo scenario selector (e.g. 'road_accident')."
    )

    def effective_description(self) -> str:
        parts = [p for p in (self.description, self.transcription) if p]
        return " ".join(parts).strip()


# ---------------------------------------------------------------------------
# Response building blocks
# ---------------------------------------------------------------------------


class Detection(BaseModel):
    label: str
    confidence: float = Field(ge=0.0, le=1.0)


class VisionResult(BaseModel):
    analyzed: bool = False
    detections: list[Detection] = Field(default_factory=list)
    notes: Optional[str] = None
    usable: bool = Field(True, description="False for blurry/unusable images.")


class DangerSign(BaseModel):
    label: str
    detail: Optional[str] = None
    severity: Severity = Severity.WARNING


class PossibleCondition(BaseModel):
    """Cautious, non-diagnostic language only."""

    label: str
    likelihood: Likelihood = Likelihood.POSSIBLE
    note: Optional[str] = None


class ClarifyingQuestion(BaseModel):
    id: str
    question: str
    why: Optional[str] = None
    options: list[str] = Field(default_factory=list)


class ImmediateAction(BaseModel):
    step: int
    text: str
    critical: bool = False


class KnowledgeSource(BaseModel):
    id: str
    title: str
    source: str = Field(..., description="Publisher/authority, e.g. 'WHO Basic Emergency Care'.")
    snippet: Optional[str] = None
    url: Optional[str] = None
    score: Optional[float] = None


class HospitalRecommendation(BaseModel):
    id: str
    name: str
    address: Optional[str] = None
    distance_km: Optional[float] = None
    eta_minutes: Optional[int] = None
    transport: Optional[str] = Field(None, description="Recommended transport, e.g. 'Ambulance'.")
    phone: Optional[str] = None
    capabilities: list[str] = Field(default_factory=list)
    lat: Optional[float] = None
    lng: Optional[float] = None
    map_url: Optional[str] = None
    open_now: Optional[bool] = None


class NotificationStatus(BaseModel):
    channel: NotificationChannel
    state: NotificationState
    detail: str
    simulated: bool = True


class HospitalPreAlert(BaseModel):
    state: NotificationState = NotificationState.SIMULATED_SENT
    hospital_name: Optional[str] = None
    priority: Priority
    incident_type: IncidentType
    summary: str
    location_label: Optional[str] = None
    eta_minutes: Optional[int] = None
    danger_signs: list[str] = Field(default_factory=list)
    sent_at: Optional[str] = None
    simulated: bool = True


class SafetyValidation(BaseModel):
    """Control-layer check applied before guidance reaches the user (Section 6.3)."""

    grounded: bool
    consistent_with_danger_signs: bool
    unsupported_diagnosis: bool
    should_escalate: bool
    contact_emergency_services: bool
    notes: list[str] = Field(default_factory=list)
    passed: bool = True


class EmergencyReport(BaseModel):
    reference_id: str
    incident_type: IncidentType
    time: str
    location: Optional[LocationInput] = None
    patient: Optional[PatientHistory] = None
    observed_conditions: list[str] = Field(default_factory=list)
    possible_injuries: list[str] = Field(default_factory=list)
    priority: Priority
    danger_signs: list[str] = Field(default_factory=list)
    recommended_hospital: Optional[HospitalRecommendation] = None
    sources: list[KnowledgeSource] = Field(default_factory=list)
    notes: Optional[str] = None


class ResponseMeta(BaseModel):
    mock: bool = True
    processing_ms: Optional[int] = None
    providers: dict[str, str] = Field(default_factory=dict)
    graph_path: list[str] = Field(default_factory=list, description="Ordered nodes the workflow visited.")


# ---------------------------------------------------------------------------
# Top-level response
# ---------------------------------------------------------------------------


class EmergencyAnalysisResponse(BaseModel):
    session_id: str
    timestamp: str
    language: str

    # 1. What seems to have happened?
    incident_type: IncidentType
    summary: str
    observed_conditions: list[str] = Field(default_factory=list)
    vision: VisionResult

    # 2. How serious is it?
    priority: Priority
    priority_confidence: float = Field(0.0, ge=0.0, le=1.0)
    danger_signs: list[DangerSign] = Field(default_factory=list)
    possible_conditions: list[PossibleCondition] = Field(default_factory=list)
    why_priority: list[str] = Field(default_factory=list)
    clarifying_questions: list[ClarifyingQuestion] = Field(default_factory=list)

    # 3. What should I do right now?
    immediate_actions: list[ImmediateAction] = Field(default_factory=list)

    # 4. Where should I get help?
    hospital: Optional[HospitalRecommendation] = None
    hospital_alternatives: list[HospitalRecommendation] = Field(default_factory=list)

    # 5. Who has been notified?
    notifications: list[NotificationStatus] = Field(default_factory=list)
    pre_alert: Optional[HospitalPreAlert] = None

    # Grounding + explainability + trust
    sources: list[KnowledgeSource] = Field(default_factory=list)
    safety: SafetyValidation
    report: EmergencyReport

    disclaimer: str = (
        "Guardian AI is a decision-support assistant and does not provide a medical "
        "diagnosis or replace professional emergency services. In a life-threatening "
        "emergency, contact your local emergency number immediately."
    )
    meta: ResponseMeta = Field(default_factory=ResponseMeta)


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "guardian-ai-backend"
    version: str
    mock_mode: bool
    providers: dict[str, str] = Field(default_factory=dict)
