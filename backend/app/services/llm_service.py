"""Mock LLM service (Section 23).

Provides deterministic, templated text so the app runs with no credentials.
Swap for Qwen/GPT/Gemini behind the same `LLMService` Protocol — the agents that
call `.complete()` / `.structured()` do not change.
"""
from __future__ import annotations

from typing import Optional


class MockLLMService:
    name = "mock"

    def complete(self, prompt: str, *, system: Optional[str] = None,
                 temperature: float = 0.2, max_tokens: int = 512) -> str:
        # A real provider generates here. The mock echoes a concise, safe line so
        # callers that only need narrative text still work.
        return prompt.strip()[:max_tokens]

    def structured(self, prompt: str, *, system: Optional[str] = None,
                   schema: Optional[dict] = None) -> dict:
        # Real impl: model JSON/tool mode. Mock defers decisions to rule-based
        # logic in the Triage agent, so it returns an empty object here.
        return {}
