/**
 * Voice capture for describing an emergency hands-free. In this foundation build
 * the audio is NOT actually uploaded — recording is simulated (live timer +
 * synthetic waveform) and the transcript comes from the backend's mock speech
 * service (Section 12, clearly labelled as mock). Swapping in a real recorder +
 * transcription later means changing only this hook and the speech service.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/services/api";

export type RecorderStatus =
  | "idle"
  | "recording"
  | "transcribing"
  | "done"
  | "error";

const MAX_LEVELS = 40;

export function useVoiceRecorder(language: string) {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [seconds, setSeconds] = useState(0);
  const [levels, setLevels] = useState<number[]>([]);
  const [transcript, setTranscript] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => stopTimer, [stopTimer]);

  const start = useCallback(() => {
    setStatus("recording");
    setSeconds(0);
    setLevels([]);
    setTranscript("");
    timer.current = setInterval(() => {
      setSeconds((s) => s + 1);
      // Synthetic waveform amplitude (0.2–1) — visual feedback only.
      setLevels((prev) => {
        const next = [...prev, 0.25 + Math.random() * 0.75];
        return next.slice(-MAX_LEVELS);
      });
    }, 250);
  }, []);

  const stop = useCallback(async () => {
    stopTimer();
    setStatus("transcribing");
    try {
      const res = await api.transcribe(language);
      setTranscript(res.text);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }, [language, stopTimer]);

  const reset = useCallback(() => {
    stopTimer();
    setStatus("idle");
    setSeconds(0);
    setLevels([]);
    setTranscript("");
  }, [stopTimer]);

  return { status, seconds, levels, transcript, setTranscript, start, stop, reset };
}
