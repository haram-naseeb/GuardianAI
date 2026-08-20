import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { priorityMeta } from "@/lib/priority";
import { useI18n } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import type { EmergencyAnalysisResponse } from "@/types/emergency";

interface Props {
  data: EmergencyAnalysisResponse;
}

/**
 * The hero severity card — the single most important thing on the page. Severity
 * is conveyed by colour AND icon AND text label (Section 31), never colour alone.
 */
export function PriorityCard({ data }: Props) {
  const { t } = useI18n();
  const meta = priorityMeta[data.priority];
  const Icon = meta.icon;
  const pct = Math.round(data.priority_confidence * 100);
  const pr = t.priority[data.priority];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border p-5 shadow-soft sm:p-6",
        meta.border,
        meta.soft,
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "grid h-14 w-14 shrink-0 place-items-center rounded-2xl shadow-soft",
            meta.solid,
            meta.pulse && "animate-pulse-ring",
          )}
        >
          <Icon className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("text-2xl font-extrabold tracking-tight", meta.text)}>
              {pr.label}
            </span>
            <Badge variant="outline" className="font-medium">
              {t.incident[data.incident_type]}
            </Badge>
          </div>
          <p className="mt-1 text-sm font-medium text-foreground/80">{pr.tagline}</p>
        </div>
      </div>

      {/* Confidence meter */}
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>{t.results.priorityConfidence(pct)}</span>
          <span className="tabular-nums">{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-background/60">
          <motion.div
            className={cn("h-full rounded-full", meta.solid)}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          />
        </div>
      </div>
    </div>
  );
}
