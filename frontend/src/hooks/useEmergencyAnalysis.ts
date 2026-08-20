/**
 * Drives a single emergency analysis request against the backend. Keeps the flow
 * state (idle → loading → success/error) so the UI can animate around it.
 */
import { useCallback, useState } from "react";
import { api, ApiError } from "@/services/api";
import type {
  EmergencyAnalysisRequest,
  EmergencyAnalysisResponse,
} from "@/types/emergency";

export type AnalysisStatus = "idle" | "loading" | "success" | "error";

export function useEmergencyAnalysis() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [data, setData] = useState<EmergencyAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (req: EmergencyAnalysisRequest) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await api.analyze(req);
      setData(res);
      setStatus("success");
      return res;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : null);
      setStatus("error");
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setData(null);
    setError(null);
  }, []);

  return { status, data, error, analyze, reset };
}
