import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/i18n";
import type { SafetyValidation } from "@/types/emergency";

export function SafetyNote({ safety }: { safety: SafetyValidation }) {
  const { t } = useI18n();

  return (
    <Card className="bg-muted/20">
      <CardContent className="py-4">
        <div className="flex items-center gap-2 text-sm">
          {safety.passed ? (
            <ShieldCheck className="h-4 w-4 text-low" />
          ) : (
            <ShieldAlert className="h-4 w-4 text-high" />
          )}
          <span className="font-medium">
            {safety.passed ? t.results.safetyPassed : t.results.safetyReview}
          </span>
        </div>
        {safety.notes.length > 0 && (
          <ul className="mt-2 space-y-1">
            {safety.notes.map((n, i) => (
              <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
