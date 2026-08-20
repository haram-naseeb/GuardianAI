import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Lock, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import type { PatientHistory } from "@/types/emergency";

interface Props {
  value: PatientHistory;
  onChange: (value: PatientHistory) => void;
}

export function PatientHistoryForm({ value, onChange }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const set = (patch: Partial<PatientHistory>) => onChange({ ...value, ...patch });

  const field = (
    key: keyof PatientHistory,
    label: string,
    type: "text" | "number" = "text",
  ) => (
    <div className="space-y-1.5">
      <label htmlFor={`ph-${key}`} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Input
        id={`ph-${key}`}
        type={type}
        value={(value[key] as string | number | null) ?? ""}
        onChange={(e) =>
          set({
            [key]:
              type === "number"
                ? e.target.value === ""
                  ? null
                  : Number(e.target.value)
                : e.target.value,
          } as Partial<PatientHistory>)
        }
        className="h-10"
      />
    </div>
  );

  return (
    <div className="rounded-lg border bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-start"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <UserRound className="h-4 w-4 text-primary" />
          {t.emergency.historyToggle}
          <span className="text-xs font-normal text-muted-foreground">
            ({t.common.optional})
          </span>
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-3 px-4 pb-4">
              <div className="grid grid-cols-2 gap-3">
                {field("name", t.emergency.historyName)}
                {field("age", t.emergency.historyAge, "number")}
                {field("blood_group", t.emergency.historyBlood)}
                {field("allergies", t.emergency.historyAllergies)}
              </div>
              {field("conditions", t.emergency.historyConditions)}
              {field("medications", t.emergency.historyMedications)}
              {field("notes", t.emergency.historyNotes)}
              <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Lock className="mt-0.5 h-3 w-3 shrink-0" />
                {t.emergency.historyPrivacy}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
