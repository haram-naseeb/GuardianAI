"""Guardian AI workflow graph (Sections 3.2, 11, 25).

Builds the emergency-response graph and defines the tool/service nodes (knowledge
retrieval, location, safety validation, escalation) that the four AI agents are
routed through. Conditional edges implement the spec's routing:

    intake ─▶ (image?) ─▶ vision ─▶ triage ─▶ knowledge
              └────────────────────┘
    knowledge ─▶ (needs care?) ─▶ location ─▶ safety ─▶ report
                 └───────────────────────────┘
    report ─▶ (critical/high?) ─▶ escalation ─▶ compose ─▶ END
             └──────────────────────────────────┘
"""
from __future__ import annotations

from app.agents.coordinator import CoordinatorAgent
from app.agents.report import ReportAgent
from app.agents.triage import TriageAgent
from app.agents.vision import VisionAgent
from app.graph.engine import END, StateGraph
from app.graph.state import GraphState
from app.schemas.emergency import HospitalPreAlert, ImmediateAction
from app.schemas.enums import NotificationChannel, Priority

_coordinator = CoordinatorAgent()
_vision = VisionAgent()
_triage = TriageAgent()
_report = ReportAgent()


# --- Tool / service nodes ---------------------------------------------------
def knowledge_node(state: GraphState) -> GraphState:
    """RAG retrieval + grounded immediate-action guidance (Sections 7, 6.4)."""
    state.mark("knowledge")
    query = state.request.effective_description() or state.incident_type.value
    state.sources = state.services.rag.retrieve(
        query, top_k=4, incident_type=state.incident_type)

    urgent = state.priority in (Priority.CRITICAL, Priority.HIGH)
    # Each entry is (text, is_critical). Guidance stays generic + grounded — no
    # improvised medical instructions (Section 6.4).
    actions: list[tuple[str, bool]] = [(
        "Ensure the scene is safe before approaching (watch for traffic, fire, "
        "or electrical hazards).", False)]
    if urgent:
        actions.append(("Contact emergency services now (e.g., Rescue 1122).", True))
    if state.sources:
        actions.append((f"Follow verified guidance: {state.sources[0].snippet}", False))
    if state.priority is Priority.LOW:
        actions.append(("Monitor for any worsening and seek medical care if the "
                        "situation changes.", False))
    else:
        actions.append(("Seek immediate professional medical assistance.", urgent))

    state.immediate_actions = [
        ImmediateAction(step=i + 1, text=t, critical=c) for i, (t, c) in enumerate(actions)
    ]
    return state


def location_node(state: GraphState) -> GraphState:
    """Hospital / location search (Section 8)."""
    state.mark("location")
    hospitals = state.services.location.find_hospitals(
        state.request.location, incident_type=state.incident_type,
        priority=state.priority, limit=3)
    if hospitals:
        state.hospital = hospitals[0]
        state.hospital_alternatives = hospitals[1:]
    return state


def safety_node(state: GraphState) -> GraphState:
    """Safety Validation control layer (Section 6.3)."""
    state.mark("safety")
    state.safety = state.services.safety.validate(
        priority=state.priority, danger_signs=state.danger_signs,
        immediate_actions=state.immediate_actions, sources=state.sources,
        possible_conditions=state.possible_conditions)
    return state


def escalation_node(state: GraphState) -> GraphState:
    """Hospital pre-alert + notifications (Sections 8.2, 16, 17). Simulated."""
    state.mark("escalation")
    from app.utils.ids import now_iso

    summary = state.summary or state.incident_type.value
    for channel in (NotificationChannel.FAMILY, NotificationChannel.HOSPITAL,
                    NotificationChannel.EMERGENCY_SERVICE):
        state.notifications.append(
            state.services.notification.notify(channel, summary=summary, priority=state.priority))

    state.pre_alert = HospitalPreAlert(
        hospital_name=state.hospital.name if state.hospital else None,
        priority=state.priority,
        incident_type=state.incident_type,
        summary=summary,
        location_label=(state.request.location.label if state.request.location else None),
        eta_minutes=state.hospital.eta_minutes if state.hospital else None,
        danger_signs=[d.label for d in state.danger_signs],
        sent_at=now_iso(),
    )
    return state


# --- Routers ----------------------------------------------------------------
def _route_after_intake(state: GraphState) -> str:
    return "vision" if state.request.image is not None else "triage"


def _route_after_knowledge(state: GraphState) -> str:
    # Professional-care path unless the situation is minor/stable.
    return "skip" if state.priority is Priority.LOW else "location"


def _route_after_report(state: GraphState) -> str:
    return "escalate" if state.priority in (Priority.CRITICAL, Priority.HIGH) else "skip"


# --- Graph construction -----------------------------------------------------
def build_graph():
    g = StateGraph()
    g.add_node("intake", _coordinator.intake)
    g.add_node("vision", _vision.run)
    g.add_node("triage", _triage.run)
    g.add_node("knowledge", knowledge_node)
    g.add_node("location", location_node)
    g.add_node("safety", safety_node)
    g.add_node("report", _report.run)
    g.add_node("escalation", escalation_node)
    g.add_node("compose", _coordinator.compose)

    g.set_entry_point("intake")
    g.add_conditional_edges("intake", _route_after_intake,
                            {"vision": "vision", "triage": "triage"})
    g.add_edge("vision", "triage")
    g.add_edge("triage", "knowledge")
    g.add_conditional_edges("knowledge", _route_after_knowledge,
                            {"location": "location", "skip": "safety"})
    g.add_edge("location", "safety")
    g.add_edge("safety", "report")
    g.add_conditional_edges("report", _route_after_report,
                            {"escalate": "escalation", "skip": "compose"})
    g.add_edge("escalation", "compose")
    g.add_edge("compose", END)
    return g.compile()


# Compiled once and reused.
_GRAPH = build_graph()


def run_workflow(state: GraphState) -> GraphState:
    return _GRAPH.invoke(state)
