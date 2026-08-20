"""Vision Agent (Section 3.3).

Its only responsibility is to understand the incident image and surface visual
indicators (collision, bleeding, fire/smoke, a person lying down). It delegates
the actual image understanding to the VisionService provider (mock today).
"""
from __future__ import annotations

from app.graph.state import GraphState


class VisionAgent:
    name = "vision"

    def run(self, state: GraphState) -> GraphState:
        state.mark(self.name)
        result = state.services.vision.analyze(state.request.image)
        state.vision = result

        # Turn confident visual detections into observed conditions.
        for det in result.detections:
            if det.confidence >= 0.6:
                label = det.label
                if label not in state.observed_conditions:
                    state.observed_conditions.append(label)
        return state
