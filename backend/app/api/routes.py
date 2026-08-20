"""API v1 routes.

Endpoints:
  GET  /api/v1/health                     — service + provider status
  POST /api/v1/emergency/analyze          — the core analysis (Section 22)
  POST /api/v1/emergency/transcribe       — mock speech-to-text (Section 4.3)
  GET  /api/v1/emergency/scenarios        — demo scenarios for the UI picker
  GET  /api/v1/emergency/session/{id}     — retrieve a stored analysis/report
"""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.config import settings
from app.core.logging import get_logger, sanitize_error
from app.repositories.memory import get_session_repository
from app.schemas.emergency import (
    EmergencyAnalysisRequest,
    EmergencyAnalysisResponse,
    HealthResponse,
)
from app.services.analysis import analyze_emergency
from app.services.registry import get_services

logger = get_logger(__name__)
router = APIRouter()


class TranscribeRequest(BaseModel):
    language: str = "en"
    audio_ref: Optional[str] = None


class TranscribeResponse(BaseModel):
    text: str
    language: str
    confidence: float
    mock: bool


class ScenarioInfo(BaseModel):
    id: str
    label: str
    description: str
    has_image: bool
    image_hint: Optional[str] = None


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    services = get_services()
    return HealthResponse(
        version=settings.version, mock_mode=services.is_mock,
        providers={
            "llm": services.llm.name, "vision": services.vision.name,
            "speech": services.speech.name, "rag": services.rag.name,
            "location": services.location.name, "notification": services.notification.name,
        },
    )


@router.post("/emergency/analyze", response_model=EmergencyAnalysisResponse)
def analyze(request: EmergencyAnalysisRequest) -> EmergencyAnalysisResponse:
    if not request.effective_description() and request.image is None and not request.scenario:
        raise HTTPException(status_code=422,
                            detail="Provide an emergency description, image, or scenario.")
    try:
        return analyze_emergency(request)
    except Exception as exc:  # sanitized — never leak internals/PII (Section 28)
        logger.exception("analysis failed")
        raise HTTPException(status_code=500,
                            detail=f"Analysis failed: {sanitize_error(exc)}")


@router.post("/emergency/transcribe", response_model=TranscribeResponse)
def transcribe(request: TranscribeRequest) -> TranscribeResponse:
    result = get_services().speech.transcribe(request.audio_ref, language=request.language)
    return TranscribeResponse(text=result.text, language=result.language,
                              confidence=result.confidence, mock=result.mock)


@router.get("/emergency/scenarios", response_model=list[ScenarioInfo])
def scenarios() -> list[ScenarioInfo]:
    return [
        ScenarioInfo(id="road_accident", label="Road accident",
                     description="My brother had a bike accident. He is lying on the road and bleeding.",
                     has_image=True, image_hint="road_accident"),
        ScenarioInfo(id="cardiac", label="Chest pain",
                     description="My father has severe chest pain and is sweating and short of breath.",
                     has_image=False, image_hint="cardiac"),
        ScenarioInfo(id="minor_cut", label="Minor cut",
                     description="I have a small cut on my finger from a knife. It is bleeding a little.",
                     has_image=False, image_hint="minor_cut"),
        ScenarioInfo(id="fall", label="Fall / fracture",
                     description="An elderly woman slipped and fell. She cannot move her leg.",
                     has_image=True, image_hint="fall"),
        ScenarioInfo(id="burn", label="Burn",
                     description="A child spilled boiling water and has a burn on the arm.",
                     has_image=False, image_hint="burn"),
    ]


@router.get("/emergency/session/{session_id}", response_model=EmergencyAnalysisResponse)
def get_session(session_id: str) -> EmergencyAnalysisResponse:
    session = get_session_repository().get(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found.")
    return EmergencyAnalysisResponse.model_validate(session.response)
