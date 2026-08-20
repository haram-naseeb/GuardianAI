"""Service interfaces (Protocols) — the swap-in seam (Sections 3, 24).

Agents depend on these *interfaces*, never on a concrete provider. Today every
interface is satisfied by a Mock* implementation; tomorrow a Qwen / Whisper /
FAISS / Maps implementation drops in behind the same Protocol with no change to
agents, the graph, or the API. Provider selection happens in `registry.py`.
"""
from __future__ import annotations

from typing import Optional, Protocol, runtime_checkable

from app.schemas.emergency import (
    HospitalRecommendation,
    ImageMeta,
    KnowledgeSource,
    LocationInput,
    NotificationStatus,
    VisionResult,
)
from app.schemas.enums import IncidentType, NotificationChannel, Priority


class TranscriptionResult:
    """Lightweight DTO returned by SpeechService."""

    def __init__(self, text: str, language: str, confidence: float = 1.0, mock: bool = True):
        self.text = text
        self.language = language
        self.confidence = confidence
        self.mock = mock


@runtime_checkable
class LLMService(Protocol):
    """Text reasoning / generation. Real impl: Qwen, GPT, Gemini, etc."""

    name: str

    def complete(self, prompt: str, *, system: Optional[str] = None, temperature: float = 0.2,
                 max_tokens: int = 512) -> str: ...

    def structured(self, prompt: str, *, system: Optional[str] = None,
                   schema: Optional[dict] = None) -> dict:
        """Return a JSON object (real impl uses the model's JSON/tool mode)."""
        ...


@runtime_checkable
class VisionService(Protocol):
    """Multimodal image understanding. Real impl: Qwen-VL, Gemini Vision."""

    name: str

    def analyze(self, image: Optional[ImageMeta]) -> VisionResult: ...


@runtime_checkable
class SpeechService(Protocol):
    """Speech-to-text. Real impl: Whisper / Qwen-Audio."""

    name: str

    def transcribe(self, audio_ref: Optional[str], *, language: str = "en") -> TranscriptionResult: ...


@runtime_checkable
class RAGService(Protocol):
    """Trusted-knowledge retrieval. Real impl: FAISS + embeddings."""

    name: str

    def retrieve(self, query: str, *, top_k: int = 4,
                 incident_type: Optional[IncidentType] = None) -> list[KnowledgeSource]: ...


@runtime_checkable
class LocationService(Protocol):
    """Hospital / location search. Real impl: Maps API."""

    name: str

    def find_hospitals(self, location: Optional[LocationInput], *,
                       incident_type: IncidentType, priority: Priority,
                       limit: int = 3) -> list[HospitalRecommendation]: ...


@runtime_checkable
class NotificationService(Protocol):
    """Family / hospital / emergency notifications. Demo mode = simulated."""

    name: str

    def notify(self, channel: NotificationChannel, *, summary: str,
               priority: Priority) -> NotificationStatus: ...
