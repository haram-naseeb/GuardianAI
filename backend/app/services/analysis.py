"""Analysis application service.

Orchestrates one emergency analysis end to end: build graph state → run the
workflow → assemble the structured `EmergencyAnalysisResponse` → persist the
session. This is the single call site the API depends on.
"""
from __future__ import annotations

import time

from app.core.logging import get_logger, safe_patient_summary
from app.graph.state import GraphState
from app.graph.workflow import run_workflow
from app.models.domain import EmergencySession
from app.repositories.memory import get_session_repository
from app.schemas.emergency import (
    EmergencyAnalysisRequest,
    EmergencyAnalysisResponse,
    ResponseMeta,
    SafetyValidation,
    VisionResult,
)
from app.services.registry import get_services
from app.utils.ids import now_iso, session_id

logger = get_logger(__name__)


def analyze_emergency(request: EmergencyAnalysisRequest) -> EmergencyAnalysisResponse:
    started = time.perf_counter()
    services = get_services()

    # Privacy-safe logging only (Section 28): never the description or history.
    logger.info("analyze: lang=%s has_image=%s scenario=%s | %s",
                request.language, request.image is not None, request.scenario,
                safe_patient_summary(request.patient_history))

    state = GraphState(request=request, services=services)
    run_workflow(state)

    sid = session_id()
    processing_ms = int((time.perf_counter() - started) * 1000)

    # Vision may not have run (no image) — the response contract always needs one.
    vision = state.vision if state.vision is not None else VisionResult(analyzed=False)

    response = EmergencyAnalysisResponse(
        session_id=sid,
        timestamp=now_iso(),
        language=request.language,
        incident_type=state.incident_type,
        summary=state.summary,
        observed_conditions=state.observed_conditions,
        vision=vision,
        priority=state.priority,
        priority_confidence=state.priority_confidence,
        danger_signs=state.danger_signs,
        possible_conditions=state.possible_conditions,
        why_priority=state.why_priority,
        clarifying_questions=state.clarifying_questions,
        immediate_actions=state.immediate_actions,
        hospital=state.hospital,
        hospital_alternatives=state.hospital_alternatives,
        notifications=state.notifications,
        pre_alert=state.pre_alert,
        sources=state.sources,
        safety=state.safety or _default_safety(),
        report=state.report,
        meta=ResponseMeta(
            mock=services.is_mock,
            processing_ms=processing_ms,
            providers={
                "llm": services.llm.name, "vision": services.vision.name,
                "speech": services.speech.name, "rag": services.rag.name,
                "location": services.location.name, "notification": services.notification.name,
            },
            graph_path=state.visited,
        ),
    )

    _persist(sid, request, response)
    return response


def _persist(sid: str, request: EmergencyAnalysisRequest,
             response: EmergencyAnalysisResponse) -> None:
    try:
        get_session_repository().save(EmergencySession(
            id=sid, created_at=response.timestamp, language=request.language,
            priority=response.priority.value, incident_type=response.incident_type.value,
            response=response.model_dump(mode="json"),
        ))
    except Exception as exc:  # persistence must never break the emergency response
        logger.warning("session persistence skipped: %s", exc.__class__.__name__)


def _default_safety() -> SafetyValidation:
    return SafetyValidation(
        grounded=False, consistent_with_danger_signs=True, unsupported_diagnosis=False,
        should_escalate=False, contact_emergency_services=False,
        notes=["Safety validation unavailable."], passed=False)
