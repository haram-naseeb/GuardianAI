"""Coordinator Agent (Section 3.3).

The manager of the system. It performs intake (understanding what kind of
emergency this is and normalising inputs) and, at the end, composes the single
human-readable summary from the specialists' outputs. Routing between agents is
handled by the graph (workflow.py), which the Coordinator conceptually owns.
"""
from __future__ import annotations

from app.graph.state import GraphState
from app.utils.scenario import incident_for_scenario, infer_scenario


class CoordinatorAgent:
    name = "coordinator"

    def intake(self, state: GraphState) -> GraphState:
        state.mark(self.name)
        req = state.request
        text = req.effective_description()
        state.scenario_id = infer_scenario(text, req.scenario)
        state.incident_type = incident_for_scenario(state.scenario_id)
        return state

    def compose(self, state: GraphState) -> GraphState:
        """Assemble the one-line 'what seems to have happened' summary."""
        state.mark(self.name + ":compose")
        conditions = state.observed_conditions[:3]
        incident_label = state.incident_type.value.replace("_", " ").title()
        if state.incident_type.value == "UNKNOWN":
            base = "Reported emergency"
        else:
            base = incident_label
        if conditions:
            state.summary = f"{base} — " + "; ".join(conditions) + "."
        else:
            text = state.request.effective_description().strip()
            state.summary = base + (f" — {text[:120]}" if text else ".")
        return state
