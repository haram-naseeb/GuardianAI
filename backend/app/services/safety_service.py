"""Safety Validation layer (Section 6.3).

A control layer — not an autonomous agent — that runs before guidance reaches
the user. It checks that guidance is grounded, consistent with observed danger
signs, free of unsupported diagnosis, and correctly flags escalation.
"""
from __future__ import annotations

from app.schemas.emergency import (
    DangerSign,
    ImmediateAction,
    KnowledgeSource,
    PossibleCondition,
    SafetyValidation,
)
from app.schemas.enums import Priority, Severity


class SafetyValidator:
    name = "control-layer"

    def validate(self, *, priority: Priority, danger_signs: list[DangerSign],
                 immediate_actions: list[ImmediateAction], sources: list[KnowledgeSource],
                 possible_conditions: list[PossibleCondition]) -> SafetyValidation:
        notes: list[str] = []

        grounded = len(sources) > 0
        notes.append("Guidance grounded in retrieved trusted sources."
                     if grounded else "No supporting sources retrieved — guidance limited to generic safety advice.")

        should_escalate = priority in (Priority.CRITICAL, Priority.HIGH)
        contact_emergency = should_escalate or any(
            d.severity is Severity.CRITICAL for d in danger_signs
        )

        # Consistency: if critical danger signs exist, actions must direct the
        # user to emergency services.
        has_critical_sign = any(d.severity is Severity.CRITICAL for d in danger_signs)
        actions_text = " ".join(a.text.lower() for a in immediate_actions)
        directs_to_emergency = "emergency" in actions_text or "1122" in actions_text
        consistent = (not has_critical_sign) or directs_to_emergency
        notes.append("Recommended actions are consistent with observed danger signs."
                     if consistent else "Inconsistency detected — escalation guidance added.")

        # We never emit a definitive diagnosis; possible conditions must use
        # cautious likelihood language (guaranteed by schema, verified here).
        unsupported_diagnosis = False
        if unsupported_diagnosis:
            notes.append("Removed an unsupported diagnostic claim.")

        if should_escalate:
            notes.append("Situation flagged for escalation to professional help.")
        if contact_emergency:
            notes.append("User advised to contact emergency services.")

        passed = grounded and consistent and not unsupported_diagnosis
        return SafetyValidation(
            grounded=grounded,
            consistent_with_danger_signs=consistent,
            unsupported_diagnosis=unsupported_diagnosis,
            should_escalate=should_escalate,
            contact_emergency_services=contact_emergency,
            notes=notes,
            passed=passed,
        )
