import { AlertOctagon, AlertTriangle, Info, ShieldCheck, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import type { DangerSign, Severity } from "@/types/emergency";

const SEV: Record<Severity, { icon: LucideIcon; color: string; tint: string }> = {
  CRITICAL: { icon: AlertOctagon, color: "text-critical", tint: "border-critical/30 bg-critical-soft" },
  WARNING: { icon: AlertTriangle, color: "text-high", tint: "border-high/30 bg-high-soft" },
  INFO: { icon: Info, color: "text-muted-foreground", tint: "border-border bg-muted/40" },
};

export function DangerSigns({ signs }: { signs: DangerSign[] }) {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-critical" />
          {t.results.dangerTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {signs.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-low" />
            {t.results.dangerNone}
          </p>
        ) : (
          <ul className="space-y-2.5">
            {signs.map((s, i) => {
              const sev = SEV[s.severity];
              const Icon = sev.icon;
              return (
                <li key={i} className={cn("flex gap-3 rounded-md border p-3", sev.tint)}>
                  <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", sev.color)} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{s.label}</p>
                    {s.detail && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{s.detail}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
