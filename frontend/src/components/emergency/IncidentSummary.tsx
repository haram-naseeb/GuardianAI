import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EmergencyAnalysisResponse } from "@/types/emergency";

/** The q1 "What happened" summary — plain narrative + observed conditions. */
export function IncidentSummary({ data }: { data: EmergencyAnalysisResponse }) {
  return (
    <Card>
      <CardContent className="space-y-3 py-5">
        <p className="text-sm leading-relaxed text-foreground/90">{data.summary}</p>
        {data.observed_conditions.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.observed_conditions.map((c, i) => (
              <Badge key={i} variant="secondary">
                {c}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
