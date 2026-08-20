import { Check, Loader2, Mic, RotateCcw, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { useI18n, type Lang } from "@/i18n";

function formatTime(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface Props {
  language: Lang;
  onUseTranscript: (text: string) => void;
}

export function VoiceRecorder({ language, onUseTranscript }: Props) {
  const { t } = useI18n();
  const rec = useVoiceRecorder(language);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <Mic className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">{t.emergency.voiceLabel}</span>
      </div>

      <div className="rounded-lg border bg-muted/30 p-3">
        {rec.status === "idle" && (
          <Button type="button" variant="outline" size="md" onClick={rec.start} className="w-full">
            <Mic className="h-4 w-4" />
            {t.emergency.voiceStart}
          </Button>
        )}

        {rec.status === "recording" && (
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-critical opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-critical" />
            </span>
            <span className="w-10 shrink-0 text-sm font-semibold tabular-nums">
              {formatTime(rec.seconds)}
            </span>
            <div className="flex h-8 flex-1 items-center gap-0.5 overflow-hidden" aria-hidden>
              {rec.levels.map((lvl, i) => (
                <span
                  key={i}
                  className="w-1 shrink-0 rounded-full bg-primary/60"
                  style={{ height: `${Math.max(10, lvl * 100)}%` }}
                />
              ))}
            </div>
            <Button type="button" variant="critical" size="sm" onClick={rec.stop} className="shrink-0">
              <Square className="h-3.5 w-3.5" />
              {t.emergency.voiceStop}
            </Button>
          </div>
        )}

        {rec.status === "transcribing" && (
          <div className="flex items-center gap-2 py-1 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.emergency.voiceTranscribing}
          </div>
        )}

        {(rec.status === "done" || rec.status === "error") && (
          <div className="space-y-2.5">
            <Textarea
              value={rec.transcript}
              onChange={(e) => rec.setTranscript(e.target.value)}
              className="min-h-[80px] bg-background"
              aria-label={t.emergency.voiceTranscript}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onUseTranscript(rec.transcript);
                  rec.reset();
                }}
                disabled={!rec.transcript.trim()}
              >
                <Check className="h-3.5 w-3.5" />
                {t.emergency.voiceUse}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={rec.start}>
                <RotateCcw className="h-3.5 w-3.5" />
                {t.emergency.voiceStart}
              </Button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">{t.emergency.voiceHint}</p>
    </div>
  );
}
