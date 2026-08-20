"""Shared state passed between graph nodes (Section 25).

Mirrors the state object a LangGraph `StateGraph` would carry. Each node reads
from and writes to this dataclass; the API layer serialises the final state into
`EmergencyAnalysisResponse`.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

from app.schemas.emergency import (
    ClarifyingQuestion,
    DangerSign,
    EmergencyAnalysisRequest,
    EmergencyReport,
    HospitalPreAlert,
    HospitalRecommendation,
    ImmediateAction,
    KnowledgeSource,
    NotificationStatus,
    PossibleCondition,
    SafetyValidation,
    VisionResult,
)
from app.schemas.enums import IncidentType, Priority
from app.services.registry import ServiceBundle


@dataclass
class GraphState:
    request: EmergencyAnalysisRequest
    services: ServiceBundle

    # Intake (Coordinator)
    scenario_id: Optional[str] = None
    incident_type: IncidentType = IncidentType.UNKNOWN
    summary: str = ""

    # Vision
    vision: Optional[VisionResult] = None
    observed_conditions: list[str] = field(default_factory=list)

    # Triage
    priority: Priority = Priority.LOW
    priority_confidence: float = 0.0
    danger_signs: list[DangerSign] = field(default_factory=list)
    possible_conditions: list[PossibleCondition] = field(default_factory=list)
    why_priority: list[str] = field(default_factory=list)
    clarifying_questions: list[ClarifyingQuestion] = field(default_factory=list)

    # Knowledge (RAG) + grounded guidance
    sources: list[KnowledgeSource] = field(default_factory=list)
    immediate_actions: list[ImmediateAction] = field(default_factory=list)

    # Location / hospital
    hospital: Optional[HospitalRecommendation] = None
    hospital_alternatives: list[HospitalRecommendation] = field(default_factory=list)

    # Safety, report, escalation
    safety: Optional[SafetyValidation] = None
    report: Optional[EmergencyReport] = None
    notifications: list[NotificationStatus] = field(default_factory=list)
    pre_alert: Optional[HospitalPreAlert] = None

    # Bookkeeping
    visited: list[str] = field(default_factory=list)

    def mark(self, node: str) -> None:
        self.visited.append(node)
