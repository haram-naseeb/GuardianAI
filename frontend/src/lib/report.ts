/**
 * Builds a plain-text handover report from an analysis response. Localised via
 * the active dictionary. Patient fields are included ONLY when the user entered
 * them — nothing is invented, and this text is generated on demand for the user
 * to share, never logged (Section 28).
 */
import type { Dict } from "@/i18n/en";
import type { EmergencyAnalysisResponse, PatientHistory } from "@/types/emergency";

function formatTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function patientLines(p: PatientHistory | null | undefined, t: Dict): string[] {
  if (!p) return [];
  const e = t.emergency;
  const pairs: [string, unknown][] = [
    [e.historyName, p.name],
    [e.historyAge, p.age],
    [e.historyBlood, p.blood_group],
    [e.historyAllergies, p.allergies],
    [e.historyConditions, p.conditions],
    [e.historyMedications, p.medications],
    [e.historyNotes, p.notes],
  ];
  return pairs
    .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "")
    .map(([label, v]) => `  - ${label}: ${v}`);
}

export function reportFilename(ref: string): string {
  return `guardian-report-${ref}.txt`;
}

export function buildReportText(data: EmergencyAnalysisResponse, t: Dict): string {
  const r = data.report;
  const L = t.results;
  const lines: string[] = [];
  const push = (s = "") => lines.push(s);
  const rule = () => push("-".repeat(52));

  push(`${t.common.appName.toUpperCase()} — ${L.reportTitle.toUpperCase()}`);
  push(`(${t.common.demoMode} · ${t.common.mockBadge})`);
  rule();
  push(`${L.reportRef}: ${r.reference_id}`);
  push(`${L.reportTime}: ${formatTime(r.time)}`);
  push(
    `${L.q2Serious}: ${t.priority[data.priority].label} ` +
      `(${Math.round(data.priority_confidence * 100)}%)`,
  );
  push(`${t.emergency.summaryScenario}: ${t.incident[data.incident_type]}`);
  push();

  push(`${L.q1What.toUpperCase()}`);
  push(data.summary);
  if (r.observed_conditions.length) {
    push(`${t.emergency.summaryDescription}: ${r.observed_conditions.join(", ")}`);
  }
  push();

  if (r.location?.label) {
    push(`${t.emergency.locationLabel.toUpperCase()}`);
    push(r.location.label);
    push();
  }

  const pl = patientLines(r.patient, t);
  if (pl.length) {
    push(`${t.emergency.historyLabel.toUpperCase()}`);
    pl.forEach(push);
    push();
  }

  if (r.danger_signs.length) {
    push(`${L.dangerTitle.toUpperCase()}`);
    r.danger_signs.forEach((d) => push(`  - ${d}`));
    push();
  }

  if (r.possible_injuries.length) {
    push(`${L.conditionsTitle.toUpperCase()}`);
    r.possible_injuries.forEach((c) => push(`  - ${c}`));
    push();
  }

  if (data.immediate_actions.length) {
    push(`${L.actionsTitle.toUpperCase()}`);
    data.immediate_actions.forEach((a) =>
      push(`  ${a.step}. ${a.text}${a.critical ? ` [${L.actionCritical}]` : ""}`),
    );
    push();
  }

  if (r.recommended_hospital) {
    const h = r.recommended_hospital;
    push(`${L.hospitalTitle.toUpperCase()}`);
    push(`  ${h.name}${h.address ? ` — ${h.address}` : ""}`);
    if (h.phone) push(`  ${L.hospitalCall}: ${h.phone}`);
    if (h.distance_km != null) push(`  ${L.hospitalDistance(h.distance_km)}`);
    if (h.transport) push(`  ${L.hospitalTransport}: ${h.transport}`);
    push();
  }

  if (r.sources.length) {
    push(`${L.sourcesTitle.toUpperCase()}`);
    r.sources.forEach((s) => push(`  - ${s.title} (${s.source})`));
    push();
  }

  rule();
  push(data.disclaimer);
  return lines.join("\n");
}
