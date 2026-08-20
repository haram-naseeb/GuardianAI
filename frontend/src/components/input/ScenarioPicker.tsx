import {
  Bike,
  Flame,
  HeartPulse,
  PersonStanding,
  Scissors,
  Sparkles,
  Stethoscope,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import type { ScenarioInfo } from "@/types/emergency";

const ICONS: Record<string, LucideIcon> = {
  road_accident: Bike,
  cardiac: HeartPulse,
  minor_cut: Scissors,
  fall: PersonStanding,
  burn: Flame,
};

interface Props {
  scenarios: ScenarioInfo[];
  selectedId: string | null;
  onSelect: (scenario: ScenarioInfo) => void;
  onClear: () => void;
}

export function ScenarioPicker({ scenarios, selectedId, onSelect, onClear }: Props) {
  const { t } = useI18n();
  if (scenarios.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">{t.emergency.scenarioLabel}</span>
        </div>
        {selectedId && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            {t.emergency.scenarioClear}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {scenarios.map((s) => {
          const Icon = ICONS[s.id] ?? Stethoscope;
          const active = selectedId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={active}
              title={s.description}
              onClick={() => onSelect(s)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-soft"
                  : "border-border bg-background hover:border-primary/40 hover:bg-accent",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">{t.emergency.scenarioHint}</p>
    </div>
  );
}
