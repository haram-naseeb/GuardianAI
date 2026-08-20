import { Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { useI18n } from "@/i18n";
import type { Likelihood, PossibleCondition } from "@/types/emergency";

const VARIANT: Record<Likelihood, NonNullable<BadgeProps["variant"]>> = {
  SUSPECTED: "high",
  POSSIBLE: "moderate",
  UNLIKELY: "muted",
};

export function PossibleConditions({ conditions }: { conditions: PossibleCondition[] }) {
  const { t } = useI18n();
  if (conditions.length === 0) return null;

  const label: Record<Likelihood, string> = {
    POSSIBLE: t.results.likelihoodPOSSIBLE,
    SUSPECTED: t.results.likelihoodSUSPECTED,
    UNLIKELY: t.results.likelihoodUNLIKELY,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Stethoscope className="h-4 w-4 text-primary" />
          {t.results.conditionsTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          {t.results.conditionsCaution}
        </p>
        <ul className="space-y-2.5">
          {conditions.map((c, i) => (
            <li key={i} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{c.label}</p>
                {c.note && <p className="mt-0.5 text-xs text-muted-foreground">{c.note}</p>}
              </div>
              <Badge variant={VARIANT[c.likelihood]} className="mt-0.5 shrink-0">
                {label[c.likelihood]}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
