/**
 * TypeScript mirror of the backend Pydantic contract
 * (backend/app/schemas/emergency.py). Keep these in sync when the contract
 * changes — this is the single source of truth for the frontend.
 */

export type Priority = "CRITICAL" | "HIGH" | "MODERATE" | "LOW";

export type IncidentType =
  | "ROAD_ACCIDENT"
  | "MEDICAL_EMERGENCY"
  | "CARDIAC"
  | "BLEEDING"
  | "FALL"
  | "BURN"
  | "FIRE"
  | "BREATHING"
  | "MINOR_INJURY"
  | "UNKNOWN";

export type Severity = "CRITICAL" | "WARNING" | "INFO";
export type Likelihood = "POSSIBLE" | "SUSPECTED" | "UNLIKELY";
export type NotificationChannel = "family" | "hospital" | "emergency_service";
export type NotificationState = "SIMULATED_SENT" | "PREPARED" | "NOT_SENT";

// --- Request ---------------------------------------------------------------
export interface LocationInput {
  label?: string | null;
  lat?: number | null;
  lng?: number | null;
  source?: string;
}

export interface PatientHistory {
  name?: string | null;
  age?: number | null;
  allergies?: string | null;
  conditions?: string | null;
  medications?: string | null;
  blood_group?: string | null;
  notes?: string | null;
}

export interface ImageMeta {
  filename?: string | null;
  content_type?: string | null;
  size_bytes?: number | null;
  source?: string;
  data_url?: string | null;
  scenario_hint?: string | null;
}

export interface EmergencyAnalysisRequest {
  description: string;
  language: string;
  location?: LocationInput | null;
  patient_history?: PatientHistory | null;
  image?: ImageMeta | null;
  transcription?: string | null;
  clarifications?: Record<string, string>;
  scenario?: string | null;
}

// --- Response building blocks ---------------------------------------------
export interface Detection {
  label: string;
  confidence: number;
}

export interface VisionResult {
  analyzed: boolean;
  detections: Detection[];
  notes?: string | null;
  usable: boolean;
}

export interface DangerSign {
  label: string;
  detail?: string | null;
  severity: Severity;
}

export interface PossibleCondition {
  label: string;
  likelihood: Likelihood;
  note?: string | null;
}

export interface ClarifyingQuestion {
  id: string;
  question: string;
  why?: string | null;
  options: string[];
}

export interface ImmediateAction {
  step: number;
  text: string;
  critical: boolean;
}

export interface KnowledgeSource {
  id: string;
  title: string;
  source: string;
  snippet?: string | null;
  url?: string | null;
  score?: number | null;
}

export interface HospitalRecommendation {
  id: string;
  name: string;
  address?: string | null;
  distance_km?: number | null;
  eta_minutes?: number | null;
  transport?: string | null;
  phone?: string | null;
  capabilities: string[];
  lat?: number | null;
  lng?: number | null;
  map_url?: string | null;
  open_now?: boolean | null;
}

export interface NotificationStatus {
  channel: NotificationChannel;
  state: NotificationState;
  detail: string;
  simulated: boolean;
}

export interface HospitalPreAlert {
  state: NotificationState;
  hospital_name?: string | null;
  priority: Priority;
  incident_type: IncidentType;
  summary: string;
  location_label?: string | null;
  eta_minutes?: number | null;
  danger_signs: string[];
  sent_at?: string | null;
  simulated: boolean;
}

export interface SafetyValidation {
  grounded: boolean;
  consistent_with_danger_signs: boolean;
  unsupported_diagnosis: boolean;
  should_escalate: boolean;
  contact_emergency_services: boolean;
  notes: string[];
  passed: boolean;
}

export interface EmergencyReport {
  reference_id: string;
  incident_type: IncidentType;
  time: string;
  location?: LocationInput | null;
  patient?: PatientHistory | null;
  observed_conditions: string[];
  possible_injuries: string[];
  priority: Priority;
  danger_signs: string[];
  recommended_hospital?: HospitalRecommendation | null;
  sources: KnowledgeSource[];
  notes?: string | null;
}

export interface ResponseMeta {
  mock: boolean;
  processing_ms?: number | null;
  providers: Record<string, string>;
  graph_path: string[];
}

export interface EmergencyAnalysisResponse {
  session_id: string;
  timestamp: string;
  language: string;
  incident_type: IncidentType;
  summary: string;
  observed_conditions: string[];
  vision: VisionResult;
  priority: Priority;
  priority_confidence: number;
  danger_signs: DangerSign[];
  possible_conditions: PossibleCondition[];
  why_priority: string[];
  clarifying_questions: ClarifyingQuestion[];
  immediate_actions: ImmediateAction[];
  hospital?: HospitalRecommendation | null;
  hospital_alternatives: HospitalRecommendation[];
  notifications: NotificationStatus[];
  pre_alert?: HospitalPreAlert | null;
  sources: KnowledgeSource[];
  safety: SafetyValidation;
  report: EmergencyReport;
  disclaimer: string;
  meta: ResponseMeta;
}

export interface ScenarioInfo {
  id: string;
  label: string;
  description: string;
  has_image: boolean;
  image_hint?: string | null;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  mock_mode: boolean;
  providers: Record<string, string>;
}
