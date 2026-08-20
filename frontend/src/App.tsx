import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { LandingPage } from "@/pages/LandingPage";
import { EmergencyPage } from "@/pages/EmergencyPage";
import { ResultsPage } from "@/pages/ResultsPage";
import { AnalysisSequence } from "@/components/emergency/AnalysisSequence";
import { useEmergencyAnalysis } from "@/hooks/useEmergencyAnalysis";
import { pageTransition } from "@/animations/variants";
import { useI18n } from "@/i18n";
import type { EmergencyAnalysisRequest } from "@/types/emergency";

type Phase = "landing" | "emergency" | "analyzing" | "results";

export default function App() {
  const { t, lang } = useI18n();
  const [phase, setPhase] = useState<Phase>("landing");
  const [request, setRequest] = useState<EmergencyAnalysisRequest | null>(null);
  const { status, data, error, analyze, reset } = useEmergencyAnalysis();

  const goHome = useCallback(() => {
    reset();
    setRequest(null);
    setPhase("landing");
  }, [reset]);

  const goNew = useCallback(() => {
    reset();
    setRequest(null);
    setPhase("emergency");
  }, [reset]);

  const runAnalysis = useCallback(
    (req: EmergencyAnalysisRequest) => {
      setRequest(req);
      setPhase("analyzing");
      void analyze(req);
    },
    [analyze],
  );

  const reanalyze = useCallback(
    (answers: Record<string, string>) => {
      const base: EmergencyAnalysisRequest =
        request ?? { description: "", language: lang, clarifications: {} };
      const merged: EmergencyAnalysisRequest = {
        ...base,
        language: lang,
        clarifications: { ...(base.clarifications ?? {}), ...answers },
      };
      setRequest(merged);
      setPhase("analyzing");
      void analyze(merged);
    },
    [analyze, request, lang],
  );

  const retry = useCallback(() => {
    if (!request) {
      setPhase("emergency");
      return;
    }
    setPhase("analyzing");
    void analyze(request);
  }, [analyze, request]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header onHome={goHome} onNew={goNew} showNew={phase !== "landing"} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {phase === "landing" && (
            <motion.div key="landing" variants={pageTransition} initial="hidden" animate="show" exit="exit">
              <LandingPage onStart={goNew} />
            </motion.div>
          )}

          {phase === "emergency" && (
            <motion.div key="emergency" variants={pageTransition} initial="hidden" animate="show" exit="exit">
              <EmergencyPage onAnalyze={runAnalysis} onBack={goHome} />
            </motion.div>
          )}

          {phase === "analyzing" && (
            <motion.div key="analyzing" variants={pageTransition} initial="hidden" animate="show" exit="exit">
              {status === "error" ? (
                <ErrorView
                  message={error ?? t.errors.backendDown}
                  onRetry={retry}
                  onBack={goNew}
                />
              ) : (
                <AnalysisSequence
                  hasImage={!!request?.image}
                  ready={status === "success"}
                  onComplete={() => setPhase("results")}
                />
              )}
            </motion.div>
          )}

          {phase === "results" && data && (
            <motion.div key="results" variants={pageTransition} initial="hidden" animate="show" exit="exit">
              <ResultsPage
                data={data}
                request={request}
                loading={status === "loading"}
                onReanalyze={reanalyze}
                onNew={goNew}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

function ErrorView({
  message,
  onRetry,
  onBack,
}: {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-lg border border-critical/30 bg-critical-soft p-6 text-center">
        <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-critical text-critical-foreground">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <h2 className="text-lg font-bold">{t.errors.analyzeFailed}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-5 flex justify-center gap-2">
          <Button onClick={onRetry}>
            <RefreshCw className="h-4 w-4" />
            {t.common.retry}
          </Button>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 flip-rtl" />
            {t.common.back}
          </Button>
        </div>
      </div>
    </div>
  );
}
