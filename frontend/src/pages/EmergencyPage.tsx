import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  ImageIcon,
  MapPin,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmergencyTextInput } from "@/components/input/EmergencyTextInput";
import { VoiceRecorder } from "@/components/input/VoiceRecorder";
import { ImageCapture } from "@/components/input/ImageCapture";
import { ScenarioPicker } from "@/components/input/ScenarioPicker";
import { LocationPicker } from "@/components/input/LocationPicker";
import { PatientHistoryForm } from "@/components/input/PatientHistoryForm";
import { api } from "@/services/api";
import { fadeInUp } from "@/animations/variants";
import { useI18n } from "@/i18n";
import type {
  EmergencyAnalysisRequest,
  ImageMeta,
  LocationInput,
  PatientHistory,
  ScenarioInfo,
} from "@/types/emergency";

const MAX_CHARS = 1500;

interface Props {
  onAnalyze: (request: EmergencyAnalysisRequest) => void;
  onBack: () => void;
}

export function EmergencyPage({ onAnalyze, onBack }: Props) {
  const { t, lang } = useI18n();

  const [description, setDescription] = useState("");
  const [image, setImage] = useState<ImageMeta | null>(null);
  const [location, setLocation] = useState<LocationInput>({});
  const [patient, setPatient] = useState<PatientHistory>({});
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioInfo[]>([]);

  useEffect(() => {
    let active = true;
    api
      .scenarios()
      .then((s) => active && setScenarios(s))
      .catch(() => active && setScenarios([]));
    return () => {
      active = false;
    };
  }, []);

  const patientCount = useMemo(
    () =>
      Object.values(patient).filter(
        (v) => v !== null && v !== undefined && String(v).trim() !== "",
      ).length,
    [patient],
  );

  const hasLocation = Boolean(location.label?.trim() || location.lat != null);
  const canAnalyze = description.trim().length > 0 || !!image || !!scenarioId;

  const selectScenario = (s: ScenarioInfo) => {
    setScenarioId(s.id);
    setDescription(s.description);
    setImage(
      s.has_image
        ? {
            filename: `${s.id}-scene.jpg`,
            content_type: "image/jpeg",
            source: "scenario",
            scenario_hint: s.id,
            data_url: null,
          }
        : null,
    );
  };

  const useTranscript = (text: string) =>
    setDescription((prev) => (prev.trim() ? `${prev.trim()}\n${text}` : text));

  const submit = () => {
    if (!canAnalyze) return;
    onAnalyze({
      description: description.trim(),
      language: lang,
      location: hasLocation ? location : null,
      patient_history: patientCount > 0 ? patient : null,
      image,
      transcription: null,
      clarifications: {},
      scenario: scenarioId,
    });
  };

  return (
    <div className="container py-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 flip-rtl" />
        {t.common.backHome}
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.emergency.title}</h1>
        <p className="mt-1 text-muted-foreground">{t.emergency.subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Inputs */}
        <motion.div variants={fadeInUp} initial="hidden" animate="show" className="space-y-5">
          <Card>
            <CardContent className="space-y-5 py-5">
              <EmergencyTextInput value={description} onChange={setDescription} max={MAX_CHARS} />
              <VoiceRecorder language={lang} onUseTranscript={useTranscript} />
              <ImageCapture value={image} onChange={setImage} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-5">
              <ScenarioPicker
                scenarios={scenarios}
                selectedId={scenarioId}
                onSelect={selectScenario}
                onClear={() => setScenarioId(null)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-5 py-5">
              <LocationPicker value={location} onChange={setLocation} />
              <PatientHistoryForm value={patient} onChange={setPatient} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary + analyze */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card className="border-primary/20">
            <CardContent className="space-y-4 py-5">
              <h2 className="flex items-center gap-2 font-semibold">
                <Sparkles className="h-4 w-4 text-primary" />
                {t.emergency.summaryTitle}
              </h2>

              {!canAnalyze ? (
                <p className="text-sm text-muted-foreground">{t.emergency.summaryEmpty}</p>
              ) : (
                <ul className="space-y-2.5 text-sm">
                  {description.trim() && (
                    <SummaryRow icon={FileText} label={t.emergency.summaryDescription}>
                      <span className="line-clamp-2 text-muted-foreground">
                        {description.trim()}
                      </span>
                    </SummaryRow>
                  )}
                  {scenarioId && (
                    <SummaryRow icon={Sparkles} label={t.emergency.summaryScenario}>
                      <span className="text-muted-foreground">
                        {scenarios.find((s) => s.id === scenarioId)?.label ?? scenarioId}
                      </span>
                    </SummaryRow>
                  )}
                  {image && (
                    <SummaryRow icon={ImageIcon} label={t.emergency.summaryImage}>
                      <CheckCircle2 className="h-4 w-4 text-low" />
                    </SummaryRow>
                  )}
                  {hasLocation && (
                    <SummaryRow icon={MapPin} label={t.emergency.summaryLocation}>
                      <span className="text-muted-foreground">{location.label}</span>
                    </SummaryRow>
                  )}
                  {patientCount > 0 && (
                    <SummaryRow icon={UserRound} label={t.emergency.summaryPatient}>
                      <span className="text-muted-foreground">{patientCount}</span>
                    </SummaryRow>
                  )}
                </ul>
              )}

              <div className="space-y-2 border-t pt-4">
                <Button size="lg" className="w-full" onClick={submit} disabled={!canAnalyze}>
                  {t.common.analyze}
                  <ArrowRight className="h-4 w-4 flip-rtl" />
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  {canAnalyze ? t.emergency.analyzeHint : t.emergency.analyzeEmpty}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof FileText;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start justify-between gap-3">
      <span className="flex shrink-0 items-center gap-2 font-medium">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </span>
      <span className="min-w-0 text-end">{children}</span>
    </li>
  );
}
