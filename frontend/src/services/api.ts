/**
 * Typed API client — the only module that talks to the backend. UI components
 * never call `fetch` directly. Swapping the backend URL (VITE_API_BASE) or
 * transport happens here alone.
 */
import type {
  EmergencyAnalysisRequest,
  EmergencyAnalysisResponse,
  HealthResponse,
  ScenarioInfo,
} from "@/types/emergency";

const API_BASE = `${import.meta.env.VITE_API_BASE ?? ""}/api/v1`;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new ApiError(
      "Could not reach the Guardian AI backend. Is the server running on port 8000?",
      0,
    );
  }

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) detail = typeof body.detail === "string" ? body.detail : detail;
    } catch {
      /* keep default */
    }
    throw new ApiError(detail, res.status);
  }
  return (await res.json()) as T;
}

export const api = {
  health: () => request<HealthResponse>("/health"),

  analyze: (payload: EmergencyAnalysisRequest) =>
    request<EmergencyAnalysisResponse>("/emergency/analyze", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  transcribe: (language: string, audioRef?: string) =>
    request<{ text: string; language: string; confidence: number; mock: boolean }>(
      "/emergency/transcribe",
      { method: "POST", body: JSON.stringify({ language, audio_ref: audioRef ?? null }) },
    ),

  scenarios: () => request<ScenarioInfo[]>("/emergency/scenarios"),

  session: (id: string) =>
    request<EmergencyAnalysisResponse>(`/emergency/session/${encodeURIComponent(id)}`),
};
