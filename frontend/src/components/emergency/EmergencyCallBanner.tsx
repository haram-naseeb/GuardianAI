import { PhoneCall } from "lucide-react";
import { useI18n } from "@/i18n";

/** High-visibility banner shown for cases that warrant calling emergency services. */
export function EmergencyCallBanner() {
  const { t } = useI18n();
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-lg border border-critical/40 bg-critical-soft px-4 py-3"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-critical text-critical-foreground animate-pulse-ring">
        <PhoneCall className="h-4 w-4" />
      </span>
      <p className="text-sm font-bold text-critical">{t.results.safetyEmergency}</p>
    </div>
  );
}
