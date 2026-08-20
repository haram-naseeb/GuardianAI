"""Keyword-based scenario inference for the mock/triage layer.

This is deliberately simple and deterministic so the demo is reproducible and
testable. When a real LLM is connected, the Triage agent can defer this decision
to a structured model call instead (see agents/triage.py).
"""
from __future__ import annotations

from typing import Optional

from app.services.mock_data import SCENARIO_PROFILES
from app.schemas.enums import IncidentType


def infer_scenario(text: str, explicit: Optional[str] = None) -> Optional[str]:
    """Return the best-matching scenario id, or None if nothing matches."""
    if explicit and explicit in SCENARIO_PROFILES:
        return explicit

    lowered = (text or "").lower()
    if not lowered.strip():
        return None

    best: Optional[str] = None
    best_score = 0
    # Iterate in definition order so higher-acuity scenarios (cardiac, breathing)
    # win ties over generic ones, matching the dict declaration order.
    for scenario_id, profile in SCENARIO_PROFILES.items():
        score = sum(1 for kw in profile["keywords"] if kw in lowered)
        if score > best_score:
            best_score = score
            best = scenario_id
    return best


def incident_for_scenario(scenario_id: Optional[str]) -> IncidentType:
    if scenario_id and scenario_id in SCENARIO_PROFILES:
        return SCENARIO_PROFILES[scenario_id]["incident_type"]
    return IncidentType.UNKNOWN
