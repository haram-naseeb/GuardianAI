"""Service registry / dependency injection (Sections 24, 35).

The ONE place in the codebase that maps provider names to concrete classes.
Agents receive a `ServiceBundle` and never import a provider directly, so wiring
in Alibaba/Qwen/Whisper/FAISS tomorrow means adding a branch here — nothing else
changes.
"""
from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache

from app.core.config import settings
from app.core.logging import get_logger
from app.services.base import (
    LLMService,
    LocationService,
    NotificationService,
    RAGService,
    SpeechService,
    VisionService,
)
from app.services.llm_service import MockLLMService
from app.services.location_service import MockLocationService
from app.services.notification_service import MockNotificationService
from app.services.rag_service import MockRAGService
from app.services.report_service import ReportBuilder
from app.services.safety_service import SafetyValidator
from app.services.speech_service import MockSpeechService
from app.services.vision_service import MockVisionService

logger = get_logger(__name__)


def _unsupported(kind: str, provider: str):
    raise NotImplementedError(
        f"{kind} provider '{provider}' is not wired yet. Add it in "
        f"app/services/registry.py (see the mock branch) once credentials exist."
    )


def _make_llm(provider: str) -> LLMService:
    if provider == "mock":
        return MockLLMService()
    # elif provider == "qwen": return QwenLLMService(...)   # <-- tomorrow
    _unsupported("LLM", provider)


def _make_vision(provider: str) -> VisionService:
    if provider == "mock":
        return MockVisionService()
    # elif provider == "qwen-vl": return QwenVisionService(...)
    _unsupported("Vision", provider)


def _make_speech(provider: str) -> SpeechService:
    if provider == "mock":
        return MockSpeechService()
    # elif provider == "whisper": return WhisperSpeechService(...)
    _unsupported("Speech", provider)


def _make_rag(provider: str) -> RAGService:
    if provider == "mock":
        return MockRAGService()
    # elif provider == "faiss": return FaissRAGService(...)
    _unsupported("RAG", provider)


def _make_location(provider: str) -> LocationService:
    if provider == "mock":
        return MockLocationService()
    # elif provider == "maps": return MapsLocationService(...)
    _unsupported("Location", provider)


def _make_notification(provider: str) -> NotificationService:
    if provider == "mock":
        return MockNotificationService()
    _unsupported("Notification", provider)


@dataclass
class ServiceBundle:
    llm: LLMService
    vision: VisionService
    speech: SpeechService
    rag: RAGService
    location: LocationService
    notification: NotificationService
    safety: SafetyValidator
    report: ReportBuilder

    @property
    def is_mock(self) -> bool:
        return self.llm.name == "mock"


@lru_cache
def get_services() -> ServiceBundle:
    pm = settings.provider_map()
    logger.info("Initialising services (mock_mode=%s) providers=%s",
                settings.use_mock_services, pm)
    return ServiceBundle(
        llm=_make_llm(pm["llm"]),
        vision=_make_vision(pm["vision"]),
        speech=_make_speech(pm["speech"]),
        rag=_make_rag(pm["rag"]),
        location=_make_location(pm["location"]),
        notification=_make_notification(pm["notification"]),
        safety=SafetyValidator(),
        report=ReportBuilder(),
    )
