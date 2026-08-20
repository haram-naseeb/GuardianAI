import { AlertOctagon, ListChecks } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import type { ImmediateAction } from "@/types/emergency";

export function ImmediateActions({ actions }: { actions: ImmediateAction[] }) {
  const { t } = useI18n();
  if (actions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ListChecks className="h-4 w-4 text-primary" />
          {t.results.actionsTitle}
        </CardTitle>
        <CardDescription>{t.results.actionsSubtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-2.5">
          {actions.map((a) => (
            <li
              key={a.step}
              className={cn(
                "flex gap-3 rounded-lg border p-3",
                a.critical ? "border-critical/30 bg-critical-soft" : "bg-muted/30",
              )}
            >
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold",
                  a.critical
                    ? "bg-critical text-critical-foreground"
                    : "bg-primary/10 text-primary",
                )}
              >
                {a.step}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground/90">{a.text}</p>
                {a.critical && (
                  <Badge variant="critical" className="mt-1.5">
                    <AlertOctagon className="h-3 w-3" />
                    {t.results.actionCritical}
                  </Badge>
                )}
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
