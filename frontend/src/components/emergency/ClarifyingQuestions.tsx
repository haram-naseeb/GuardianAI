import { useState } from "react";
import { HelpCircle, Loader2, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import type { ClarifyingQuestion } from "@/types/emergency";

interface Props {
  questions: ClarifyingQuestion[];
  loading: boolean;
  onReanalyze: (answers: Record<string, string>) => void;
}

export function ClarifyingQuestions({ questions, loading, onReanalyze }: Props) {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  if (questions.length === 0) return null;

  // Display common answers in the active language, but send the backend's own
  // option value (its triage parser keys off the original wording).
  const localize = (opt: string): string => {
    const k = opt.trim().toLowerCase();
    if (k === "yes") return t.common.yes;
    if (k === "no") return t.common.no;
    if (k === "not sure" || k === "unsure") return t.common.notSure;
    return opt;
  };

  return (
    <Card className="border-primary/30 bg-primary/[0.03]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <HelpCircle className="h-4 w-4 text-primary" />
          {t.results.clarifyTitle}
        </CardTitle>
        <CardDescription>{t.results.clarifySubtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="space-y-2">
            <p className="text-sm font-medium">{q.question}</p>
            {q.why && (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">{t.results.clarifyWhy}:</span> {q.why}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => {
                const active = answers[q.id] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-soft"
                        : "border-border bg-background hover:bg-accent",
                    )}
                  >
                    {localize(opt)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <Button
          onClick={() => onReanalyze(answers)}
          disabled={loading || Object.keys(answers).length === 0}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {t.common.reAnalyze}
        </Button>
      </CardContent>
    </Card>
  );
}
