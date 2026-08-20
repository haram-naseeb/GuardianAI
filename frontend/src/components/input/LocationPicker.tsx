import { useEffect } from "react";
import { Loader2, LocateFixed, MapPin, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useI18n } from "@/i18n";
import type { LocationInput } from "@/types/emergency";

interface Props {
  value: LocationInput;
  onChange: (value: LocationInput) => void;
}

export function LocationPicker({ value, onChange }: Props) {
  const { t } = useI18n();
  const geo = useGeolocation();

  useEffect(() => {
    if (geo.status === "granted" && geo.coords) {
      onChange({
        lat: geo.coords.lat,
        lng: geo.coords.lng,
        label: `${geo.coords.lat.toFixed(4)}, ${geo.coords.lng.toFixed(4)}`,
        source: "gps",
      });
    }
    // onChange is intentionally excluded — only react to a new fix.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.status, geo.coords]);

  const locating = geo.status === "locating";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">{t.emergency.locationLabel}</span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={value.label ?? ""}
          onChange={(e) => onChange({ ...value, label: e.target.value, source: "manual" })}
          placeholder={t.emergency.locationPlaceholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={geo.request}
          disabled={locating}
          className="shrink-0"
        >
          {locating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LocateFixed className="h-4 w-4" />
          )}
          {locating ? t.emergency.locationDetecting : t.emergency.locationDetect}
        </Button>
      </div>

      {geo.status === "denied" && (
        <p className="flex items-center gap-1.5 text-xs text-high">
          <TriangleAlert className="h-3.5 w-3.5" />
          {t.emergency.locationDenied}
        </p>
      )}
      <p className="text-xs text-muted-foreground">{t.emergency.locationHint}</p>
    </div>
  );
}
