import { BookOpen, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/i18n";
import type { KnowledgeSource } from "@/types/emergency";

export function SourcesList({ sources }: { sources: KnowledgeSource[] }) {
  const { t } = useI18n();
  if (sources.length === 0) return null;

  // Backend scores are raw, unbounded relevance weights — normalise against the
  // strongest match in this batch so the badge reads as a sensible 0–100% match.
  const maxScore = Math.max(1, ...sources.map((s) => s.score ?? 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="h-4 w-4 text-primary" />
          {t.results.sourcesTitle}
        </CardTitle>
        <CardDescription>{t.results.sourcesSubtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {sources.map((s) => (
            <li key={s.id} className="rounded-md border bg-muted/20 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.source}</p>
                </div>
                {s.score != null && (
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {t.results.sourceScore(Math.round((s.score / maxScore) * 100))}
                  </span>
                )}
              </div>
              {s.snippet && (
                <p className="mt-1.5 text-xs leading-relaxed text-foreground/75">{s.snippet}</p>
              )}
              {s.url && (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  {s.url}
                </a>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
