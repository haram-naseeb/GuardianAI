import { Clock, FlaskConical, MapPin, Radio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n";
import type { HospitalPreAlert as PreAlert } from "@/types/emergency";

export function HospitalPreAlert({ alert }: { alert: PreAlert | null }) {
  const { t } = useI18n();
  if (!alert) return null;

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Radio className="h-4 w-4 text-primary" />
          {t.results.preAlertTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-md border border-dashed border-primary/40 bg-primary/[0.04] p-3">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
            <FlaskConical className="h-3.5 w-3.5" />
            {t.results.preAlertSimulated}
          </div>
          {alert.hospital_name && <p className="text-sm font-semibold">{alert.hospital_name}</p>}
          <p className="mt-1 text-sm text-foreground/80">{alert.summary}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline">{t.incident[alert.incident_type]}</Badge>
          {alert.eta_minutes != null && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 font-medium">
              <Clock className="h-3.5 w-3.5" />
              {t.results.preAlertEta}: {t.results.hospitalEta(alert.eta_minutes)}
            </span>
          )}
          {alert.location_label && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 font-medium">
              <MapPin className="h-3.5 w-3.5" />
              {alert.location_label}
            </span>
          )}
        </div>

        {alert.danger_signs.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              {t.results.preAlertDanger}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {alert.danger_signs.map((d, i) => (
                <Badge key={i} variant="critical">
                  {d}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
