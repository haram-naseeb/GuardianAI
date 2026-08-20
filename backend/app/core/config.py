"""Application configuration via environment variables.

Secrets are read from the environment / .env only — never hard-coded (Section 3).
`USE_MOCK_SERVICES=true` (the default) lets the whole app run today with zero
AI credentials. Flip individual providers on as credentials arrive tomorrow.
"""
from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"), env_file_encoding="utf-8", extra="ignore"
    )

    # --- App ---
    app_name: str = "Guardian AI"
    version: str = "0.1.0"
    app_env: str = "development"
    debug: bool = True

    # --- CORS (frontend dev server) ---
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
    ]

    # --- Master mock switch. When true, every provider uses its Mock impl. ---
    use_mock_services: bool = True

    # --- Per-provider selection (only consulted when use_mock_services is false).
    # --- These are the seams for tomorrow's Alibaba/Qwen/etc. integrations. ---
    llm_provider: str = "mock"          # mock | qwen | openai | gemini
    vision_provider: str = "mock"       # mock | qwen-vl | gemini-vision
    speech_provider: str = "mock"       # mock | whisper | qwen-audio
    rag_provider: str = "mock"          # mock | faiss
    location_provider: str = "mock"     # mock | maps
    notification_provider: str = "mock" # mock | (comms provider)

    # --- Credentials (empty by default; supplied via .env tomorrow) ---
    llm_api_key: str = ""
    llm_base_url: str = ""
    llm_model: str = ""
    vision_api_key: str = ""
    vision_model: str = ""
    embeddings_model: str = ""
    maps_api_key: str = ""

    # --- Knowledge base / RAG ---
    knowledge_base_dir: str = "../knowledge-base"

    @property
    def is_mock(self) -> bool:
        return self.use_mock_services

    def provider_map(self) -> dict[str, str]:
        if self.use_mock_services:
            return {k: "mock" for k in
                    ("llm", "vision", "speech", "rag", "location", "notification")}
        return {
            "llm": self.llm_provider,
            "vision": self.vision_provider,
            "speech": self.speech_provider,
            "rag": self.rag_provider,
            "location": self.location_provider,
            "notification": self.notification_provider,
        }


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
