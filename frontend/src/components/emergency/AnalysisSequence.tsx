import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2, ShieldPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

interface Props {
  hasImage: boolean;
  /** True once the backend response has arrived. */
  ready: boolean;
  onComplete: () => void;
}

const STEP_MS = 600;

/**
 * Staged "AI agents at work" animation shown while analyzing. It always plays
 * through its steps (even though the mock backend is instant) so the transition
 * feels considered, then hands off once the real result is ready.
 */
export function AnalysisSequence({ hasImage, ready, onComplete }: Props) {
  const { t } = useI18n();

  const steps = useMemo(() => {
    const a = t.analysis;
    return [
      a.understanding,
      ...(hasImage ? [a.vision] : []),
      a.triage,
      a.knowledge,
      a.location,
      a.safety,
      a.report,
    ];
  }, [t, hasImage]);

  const [active, setActive] = useState(0);
  const completed = useRef(false);

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => Math.min(i + 1, steps.length - 1)),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, [steps.length]);

  useEffect(() => {
    if (ready && active >= steps.length - 1 && !completed.current) {
      completed.current = true;
      const to = setTimeout(onComplete, 550);
      return () => clearTimeout(to);
    }
  }, [ready, active, steps.length, onComplete]);

  const progress = Math.round(((active + 1) / steps.length) * 100);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft animate-pulse-ring">
            <ShieldPlus className="h-7 w-7" />
          </span>
          <h2 className="text-xl font-bold tracking-tight">{t.analysis.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.analysis.subtitle}</p>
        </div>

        <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        <ul className="space-y-1">
          {steps.map((label, i) => {
            const done = i < active;
            const current = i === active;
            return (
              <li
                key={i}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  current && "bg-primary/5",
                )}
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-low" />
                ) : current ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                )}
                <span
                  className={cn(
                    "font-medium",
                    done && "text-muted-foreground",
                    current && "text-foreground",
                    !done && !current && "text-muted-foreground/60",
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}
