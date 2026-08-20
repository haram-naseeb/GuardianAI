import { Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/i18n";

export function WhyPriority({ reasons }: { reasons: string[] }) {
  const { t } = useI18n();
  if (reasons.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Gauge className="h-4 w-4 text-primary" />
          {t.results.whyTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {reasons.map((r, i) => (
            <li key={i} className="flex gap-2.5 text-sm">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              <span className="text-foreground/90">{r}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
