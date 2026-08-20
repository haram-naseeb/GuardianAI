"""Report Agent (Section 3.3, 10).

Assembles the specialists' outputs into a structured Emergency Handover Report.
Thin wrapper over ReportBuilder so the "agent" concept from the spec maps to a
real call site in the graph.
"""
from __future__ import annotations

from app.graph.state import GraphState


class ReportAgent:
    name = "report"

    def run(self, state: GraphState) -> GraphState:
        state.mark(self.name)
        state.report = state.services.report.build(
            incident_type=state.incident_type,
            priority=state.priority,
            location=state.request.location,
            patient=state.request.patient_history,
            observed_conditions=state.observed_conditions,
            possible_conditions=state.possible_conditions,
            danger_signs=state.danger_signs,
            hospital=state.hospital,
            sources=state.sources,
            notes=None,
        )
        return state
