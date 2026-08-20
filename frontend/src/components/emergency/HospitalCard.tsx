import {
  Ambulance,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Phone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import type { HospitalRecommendation } from "@/types/emergency";

interface Props {
  hospital: HospitalRecommendation | null;
  alternatives: HospitalRecommendation[];
}

export function HospitalCard({ hospital, alternatives }: Props) {
  const { t } = useI18n();

  if (!hospital) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          {t.results.hospitalNone}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4 text-primary" />
            {t.results.hospitalTitle}
          </CardTitle>
          {hospital.open_now && (
            <Badge variant="low">
              <CheckCircle2 className="h-3 w-3" />
              {t.results.hospitalOpen}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-base font-semibold">{hospital.name}</p>
          {hospital.address && (
            <p className="mt-0.5 text-sm text-muted-foreground">{hospital.address}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {hospital.distance_km != null && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 font-medium">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {t.results.hospitalDistance(hospital.distance_km)}
            </span>
          )}
          {hospital.eta_minutes != null && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 font-medium">
              <Clock className="h-3.5 w-3.5 text-primary" />
              {t.results.hospitalEta(hospital.eta_minutes)}
            </span>
          )}
          {hospital.transport && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 font-medium">
              <Ambulance className="h-3.5 w-3.5 text-primary" />
              {hospital.transport}
            </span>
          )}
        </div>

        {hospital.capabilities.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              {t.results.hospitalCapabilities}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {hospital.capabilities.map((c) => (
                <Badge key={c} variant="secondary">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {hospital.phone && (
            <a href={`tel:${hospital.phone}`} className={cn(buttonVariants({ variant: "primary", size: "sm" }))}>
              <Phone className="h-4 w-4" />
              {t.results.hospitalCall} {hospital.phone}
            </a>
          )}
          {hospital.map_url && (
            <a
              href={hospital.map_url}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <Navigation className="h-4 w-4" />
              {t.results.hospitalDirections}
            </a>
          )}
        </div>

        {alternatives.length > 0 && (
          <div className="border-t pt-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {t.results.hospitalAlternatives}
            </p>
            <ul className="space-y-1.5">
              {alternatives.map((h) => (
                <li
                  key={h.id}
                  className="flex items-center justify-between gap-3 rounded-md px-1 py-1 text-sm"
                >
                  <span className="min-w-0 truncate">{h.name}</span>
                  <span className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                    {h.distance_km != null && (
                      <span className="tabular-nums">
                        {t.results.hospitalDistance(h.distance_km)}
                      </span>
                    )}
                    {h.map_url && (
                      <a
                        href={h.map_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                      >
                        <Navigation className="h-3 w-3" />
                        {t.results.hospitalDirections}
                      </a>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
