"""Guardian AI — FastAPI application entrypoint.

Run locally:
    uvicorn app.main:app --reload --port 8000

Interactive docs: http://localhost:8000/docs
"""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.core.config import settings
from app.core.logging import configure_logging, get_logger

configure_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Warm the service registry so the first request isn't slow.
    from app.services.registry import get_services

    services = get_services()
    logger.info("%s v%s ready (mock_mode=%s)", settings.app_name, settings.version,
                services.is_mock)
    yield


app = FastAPI(
    title="Guardian AI",
    version=settings.version,
    description="AI emergency-response assistance system — decision support, not a "
                "medical diagnosis. Hospital pre-alert and notifications are simulated.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")


@app.get("/")
def root() -> dict:
    return {
        "service": settings.app_name,
        "version": settings.version,
        "docs": "/docs",
        "health": "/api/v1/health",
        "mock_mode": settings.use_mock_services,
    }
