"""Report builder — assembles the Emergency Handover Report (Section 10).

Pure assembly logic that gathers the other agents' outputs into a single
structured report suitable for sharing with responders or a hospital.
"""
from __future__ import annotations

from typing import Optional

from app.schemas.emergency import (
    DangerSign,
    EmergencyReport,
    HospitalRecommendation,
    KnowledgeSource,
    LocationInput,
    PatientHistory,
    PossibleCondition,
)
from app.schemas.enums import IncidentType, Priority
from app.utils.ids import now_iso, reference_id


class ReportBuilder:
    name = "report-agent"

    def build(self, *, incident_type: IncidentType, priority: Priority,
              location: Optional[LocationInput], patient: Optional[PatientHistory],
              observed_conditions: list[str], possible_conditions: list[PossibleCondition],
              danger_signs: list[DangerSign], hospital: Optional[HospitalRecommendation],
              sources: list[KnowledgeSource], notes: Optional[str] = None) -> EmergencyReport:
        return EmergencyReport(
            reference_id=reference_id(),
            incident_type=incident_type,
            time=now_iso(),
            location=location,
            patient=patient,
            observed_conditions=observed_conditions,
            possible_injuries=[c.label for c in possible_conditions],
            priority=priority,
            danger_signs=[d.label for d in danger_signs],
            recommended_hospital=hospital,
            sources=sources,
            notes=notes,
        )
