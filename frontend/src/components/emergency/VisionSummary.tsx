import { CheckCircle2, ScanEye, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n";
import type { VisionResult } from "@/types/emergency";

interface Props {
  vision: VisionResult;
  imageUrl?: string | null;
}

export function VisionSummary({ vision, imageUrl }: Props) {
  const { t } = useI18n();
  if (!vision.analyzed) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ScanEye className="h-4 w-4 text-primary" />
          {t.results.visionTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={t.results.visionTitle}
            className="max-h-48 w-full rounded-md border object-cover"
          />
        )}

        {vision.usable ? (
          <Badge variant="low">
            <CheckCircle2 className="h-3 w-3" />
            {t.results.visionUsable}
          </Badge>
        ) : (
          <Badge variant="moderate">
            <TriangleAlert className="h-3 w-3" />
            {t.results.visionUnusable}
          </Badge>
        )}

        {vision.usable && vision.detections.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              {t.results.visionDetections}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {vision.detections.map((d, i) => (
                <Badge key={i} variant="secondary">
                  {d.label} · {Math.round(d.confidence * 100)}%
                </Badge>
              ))}
            </div>
          </div>
        )}

        {vision.notes && <p className="text-xs text-muted-foreground">{vision.notes}</p>}
      </CardContent>
    </Card>
  );
}
