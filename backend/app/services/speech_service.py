"""Mock Speech-to-Text service (Section 23, 4.3).

Swap for Whisper / Qwen-Audio behind the same `SpeechService` Protocol. The mock
returns a canned transcription; the real transcription flow keeps the user in
control by letting them review/edit before submission (handled in the UI).
"""
from __future__ import annotations

from typing import Optional

from app.services.base import TranscriptionResult

_CANNED = {
    "en": "My brother had a bike accident. He is lying on the road and bleeding.",
    "ur": "میرے بھائی کا موٹر سائیکل حادثہ ہوا ہے۔ وہ سڑک پر پڑا ہے اور اس سے خون بہہ رہا ہے۔",
    "ur-Latn": "Mere bhai ka bike accident ho gaya hai. Wo road par para hai aur khoon beh raha hai.",
}


class MockSpeechService:
    name = "mock"

    def transcribe(self, audio_ref: Optional[str], *, language: str = "en") -> TranscriptionResult:
        text = _CANNED.get(language, _CANNED["en"])
        return TranscriptionResult(text=text, language=language, confidence=0.9, mock=True)
