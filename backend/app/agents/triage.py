"""Medical / Emergency Triage Agent (Sections 6.1, 6.2).

Estimates emergency priority — it does NOT diagnose. It combines the description,
Vision findings, optional patient history, and answers to clarifying questions to
produce a cautious, structured assessment.

Today the decision logic is a deterministic rule engine so the demo is
reproducible and testable. When a real LLM is connected, replace `_assess` with a
structured model call (`services.llm.structured(...)`) grounded in the retrieved
RAG sources — the rest of the pipeline is unaffected.
"""
from __future__ import annotations

from dataclasses import dataclass

from app.graph.state import GraphState
from app.schemas.emergency import (
    ClarifyingQuestion,
    DangerSign,
    PossibleCondition,
)
from app.schemas.enums import IncidentType, Likelihood, Priority, Severity

_YES = {"yes", "y", "true", "haan", "ji", "ji haan"}
_NO = {"no", "n", "false", "nahi", "nahin"}


@dataclass
class Signals:
    unconscious: bool = False
    consciousness_known: bool = False
    not_breathing: bool = False
    breathing_known: bool = False
    severe_bleeding: bool = False
    bleeding_known: bool = False
    trapped: bool = False
    trapped_known: bool = False
    chest_pain: bool = False
    breathing_difficulty: bool = False
    fire: bool = False


def _answer(clarifications: dict[str, str], key: str) -> tuple[bool, bool]:
    """Return (is_yes, is_known) for a clarifying answer."""
    if key not in clarifications:
        return False, False
    val = (clarifications[key] or "").strip().lower()
    if val in _YES:
        return True, True
    if val in _NO:
        return False, True
    return False, False  # "not sure"


class TriageAgent:
    name = "triage"

    # --- Signal extraction --------------------------------------------------
    def _extract(self, state: GraphState) -> Signals:
        req = state.request
        text = req.effective_description().lower()
        c = req.clarifications or {}
        s = Signals()

        # Explicit clarifying answers take priority over free text.
        yes, known = _answer(c, "conscious")
        if known:
            s.unconscious, s.consciousness_known = (not yes), True
        elif any(k in text for k in ("unconscious", "not responding", "unresponsive",
                                     "passed out", "behosh", "faint")):
            s.unconscious, s.consciousness_known = True, True

        yes, known = _answer(c, "breathing")
        if known:
            s.not_breathing, s.breathing_known = (not yes), True
        elif any(k in text for k in ("not breathing", "cannot breathe", "can't breathe",
                                     "saans nahi", "no breathing")):
            s.not_breathing, s.breathing_known = True, True

        yes, known = _answer(c, "bleeding")
        if known:
            s.severe_bleeding, s.bleeding_known = yes, True
        elif any(t in text for t in (
                "heavy bleeding", "bleeding heavily", "severe bleeding", "lot of blood",
                "lots of blood", "a lot of blood", "gushing", "won't stop", "wont stop",
                "profuse", "hemorrhage", "bleeding badly", "bohot khoon", "khoon beh")):
            # Only qualified, severe descriptions count as severe bleeding. A plain
            # mention of "blood"/"bleeding" leaves severity unknown so we can ask.
            s.severe_bleeding, s.bleeding_known = True, True

        yes, known = _answer(c, "trapped")
        if known:
            s.trapped, s.trapped_known = yes, True
        elif "trapped" in text or "phansa" in text:
            s.trapped, s.trapped_known = True, True

        # Vision reinforcement.
        if state.vision and state.vision.usable:
            for d in state.vision.detections:
                lbl = d.label.lower()
                if "bleeding" in lbl and d.confidence >= 0.75:
                    s.severe_bleeding, s.bleeding_known = True, True
                if "fire" in lbl or "smoke" in lbl:
                    s.fire = True

        s.chest_pain = any(k in text for k in ("chest pain", "chest", "seenay", "dil")) \
            or state.incident_type is IncidentType.CARDIAC
        s.breathing_difficulty = any(k in text for k in (
            "difficulty breathing", "shortness of breath", "hard to breathe",
            "breathing difficulty", "saans")) or state.incident_type is IncidentType.BREATHING
        if state.incident_type in (IncidentType.FIRE,):
            s.fire = True
        return s

    # --- Priority rules -----------------------------------------------------
    def _priority(self, state: GraphState, s: Signals) -> Priority:
        it = state.incident_type
        if s.unconscious or s.not_breathing:
            return Priority.CRITICAL
        if it is IncidentType.ROAD_ACCIDENT and s.severe_bleeding:
            return Priority.CRITICAL
        if s.fire:
            return Priority.CRITICAL
        if s.severe_bleeding:
            return Priority.HIGH
        if s.chest_pain or it is IncidentType.CARDIAC or s.breathing_difficulty:
            return Priority.HIGH
        if it is IncidentType.ROAD_ACCIDENT:
            return Priority.HIGH  # accidents are serious by default, pending clarification
        if it in (IncidentType.FALL, IncidentType.BURN):
            return Priority.MODERATE
        if it is IncidentType.MINOR_INJURY:
            return Priority.LOW
        if it is IncidentType.UNKNOWN and not state.request.effective_description().strip():
            return Priority.LOW
        return Priority.MODERATE

    # --- Danger signs -------------------------------------------------------
    def _danger_signs(self, state: GraphState, s: Signals) -> list[DangerSign]:
        signs: list[DangerSign] = []
        if s.unconscious:
            signs.append(DangerSign(label="Person appears unconscious",
                                    detail="Reported as unresponsive.", severity=Severity.CRITICAL))
        if s.not_breathing:
            signs.append(DangerSign(label="No normal breathing reported",
                                    severity=Severity.CRITICAL))
        if s.severe_bleeding:
            sev = Severity.CRITICAL if state.incident_type in (
                IncidentType.ROAD_ACCIDENT, IncidentType.BLEEDING) else Severity.WARNING
            signs.append(DangerSign(label="Severe bleeding suspected", severity=sev))
        if s.fire:
            signs.append(DangerSign(label="Fire / smoke present", severity=Severity.CRITICAL))
        if s.chest_pain:
            signs.append(DangerSign(label="Reported chest pain", severity=Severity.WARNING))
        if s.breathing_difficulty:
            signs.append(DangerSign(label="Reported breathing difficulty", severity=Severity.WARNING))
        if s.trapped:
            signs.append(DangerSign(label="Person may be trapped", severity=Severity.WARNING))
        if state.incident_type is IncidentType.ROAD_ACCIDENT:
            signs.append(DangerSign(label="Road accident detected", severity=Severity.INFO))
        return signs

    def _possible_conditions(self, state: GraphState, s: Signals) -> list[PossibleCondition]:
        it = state.incident_type
        out: list[PossibleCondition] = []
        if it in (IncidentType.ROAD_ACCIDENT, IncidentType.FALL):
            out.append(PossibleCondition(label="Possible traumatic injury",
                                         likelihood=Likelihood.SUSPECTED))
        if s.severe_bleeding:
            out.append(PossibleCondition(label="Possible significant blood loss",
                                         likelihood=Likelihood.POSSIBLE))
        if it is IncidentType.CARDIAC or s.chest_pain:
            out.append(PossibleCondition(label="Possible cardiac event",
                                         likelihood=Likelihood.SUSPECTED,
                                         note="Requires urgent professional evaluation."))
        if it is IncidentType.BURN:
            out.append(PossibleCondition(label="Possible burn injury", likelihood=Likelihood.SUSPECTED))
        if it is IncidentType.BREATHING:
            out.append(PossibleCondition(label="Possible respiratory distress",
                                         likelihood=Likelihood.SUSPECTED))
        if it is IncidentType.MINOR_INJURY:
            out.append(PossibleCondition(label="Minor injury", likelihood=Likelihood.POSSIBLE))
        return out

    def _why(self, state: GraphState, signs: list[DangerSign]) -> list[str]:
        why = [d.label for d in signs if d.severity in (Severity.CRITICAL, Severity.WARNING)]
        # Ensure the incident context is represented.
        if state.incident_type is IncidentType.ROAD_ACCIDENT and \
                "Road accident detected" not in why:
            why.append("Road accident detected")
        return why or ["Based on the information provided."]

    # --- Clarifying questions (Section 6.2) ---------------------------------
    def _clarifying(self, state: GraphState, s: Signals) -> list[ClarifyingQuestion]:
        qs: list[ClarifyingQuestion] = []
        opts = ["Yes", "No", "Not sure"]
        injury_like = state.incident_type in (
            IncidentType.ROAD_ACCIDENT, IncidentType.FALL, IncidentType.BLEEDING,
            IncidentType.CARDIAC, IncidentType.BREATHING, IncidentType.UNKNOWN,
        )
        if injury_like and not s.consciousness_known:
            qs.append(ClarifyingQuestion(id="conscious", question="Is the person conscious?",
                                         why="Consciousness is a key indicator of severity.", options=opts))
        if injury_like and not s.breathing_known:
            qs.append(ClarifyingQuestion(id="breathing", question="Is the person breathing normally?",
                                         why="Abnormal breathing signals a life-threatening emergency.",
                                         options=opts))
        if state.incident_type in (IncidentType.ROAD_ACCIDENT, IncidentType.BLEEDING) \
                and not s.bleeding_known:
            qs.append(ClarifyingQuestion(id="bleeding", question="Is there heavy bleeding?",
                                         why="Severe bleeding raises priority to critical.", options=opts))
        if state.incident_type is IncidentType.ROAD_ACCIDENT and not s.trapped_known:
            qs.append(ClarifyingQuestion(id="trapped", question="Is the person trapped?",
                                         why="Being trapped affects how help should approach.", options=opts))
        return qs[:3]

    def _confidence(self, s: Signals, clarifying: list, vision_ok: bool) -> float:
        conf = 0.5
        if vision_ok:
            conf += 0.15
        for known in (s.consciousness_known, s.breathing_known, s.bleeding_known):
            if known:
                conf += 0.08
        conf -= 0.08 * len(clarifying)
        return round(max(0.3, min(0.95, conf)), 2)

    # --- Entry point --------------------------------------------------------
    def run(self, state: GraphState) -> GraphState:
        state.mark(self.name)
        s = self._extract(state)

        state.priority = self._priority(state, s)
        state.danger_signs = self._danger_signs(state, s)
        state.possible_conditions = self._possible_conditions(state, s)
        state.why_priority = self._why(state, state.danger_signs)
        state.clarifying_questions = self._clarifying(state, s)
        state.priority_confidence = self._confidence(
            s, state.clarifying_questions, bool(state.vision and state.vision.usable))

        # Enrich observed conditions with resolved textual signals.
        extra = []
        if s.unconscious:
            extra.append("Person appears unconscious")
        if s.not_breathing:
            extra.append("No normal breathing reported")
        for e in extra:
            if e not in state.observed_conditions:
                state.observed_conditions.append(e)
        return state
