"""Privacy-aware logging (Section 28).

Guardian AI handles sensitive patient information. This module configures
logging and provides helpers that guarantee we never write full patient
history, CNIC, or free-text medical notes to logs — only coarse, non-identifying
signals ("patient_history: present, fields=[age, allergies]").
"""
from __future__ import annotations

import logging
import re
from typing import Any, Optional

from app.core.config import settings

_CNIC_RE = re.compile(r"\b\d{5}-?\d{7}-?\d\b")  # Pakistani CNIC pattern
_SENSITIVE_FIELDS = {"name", "allergies", "conditions", "medications", "notes", "blood_group"}


def configure_logging() -> None:
    logging.basicConfig(
        level=logging.DEBUG if settings.debug else logging.INFO,
        format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    )
    # Keep third-party noise down.
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)


def redact(text: Optional[str]) -> str:
    """Redact CNIC-like sequences from any free text before logging."""
    if not text:
        return ""
    return _CNIC_RE.sub("[REDACTED-CNIC]", text)


def safe_patient_summary(patient: Any) -> str:
    """Describe *which* patient fields were provided, never their values."""
    if patient is None:
        return "patient_history: absent"
    data = patient.model_dump(exclude_none=True) if hasattr(patient, "model_dump") else dict(patient)
    present = [k for k in data.keys() if k in _SENSITIVE_FIELDS or k == "age"]
    return f"patient_history: present, fields={sorted(present)}"


def sanitize_error(exc: Exception) -> str:
    """Produce a user-safe error message that never leaks internals or PII."""
    return redact(str(exc)) or exc.__class__.__name__
