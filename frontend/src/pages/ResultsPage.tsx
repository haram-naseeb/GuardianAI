import { motion } from "framer-motion";
import {
  BellRing,
  CheckCircle2,
  Gauge,
  Info,
  ListChecks,
  MapPin,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionSection } from "@/components/emergency/QuestionSection";
import { IncidentSummary } from "@/components/emergency/IncidentSummary";
import { VisionSummary } from "@/components/emergency/VisionSummary";
import { PriorityCard } from "@/components/emergency/PriorityCard";
import { WhyPriority } from "@/components/emergency/WhyPriority";
import { DangerSigns } from "@/components/emergency/DangerSigns";
import { PossibleConditions } from "@/components/emergency/PossibleConditions";
import { ImmediateActions } from "@/components/emergency/ImmediateActions";
import { ClarifyingQuestions } from "@/components/emergency/ClarifyingQuestions";
import { HospitalCard } from "@/components/emergency/HospitalCard";
import { NotificationsPanel } from "@/components/emergency/NotificationsPanel";
import { HospitalPreAlert } from "@/components/emergency/HospitalPreAlert";
import { HandoverReport } from "@/components/emergency/HandoverReport";
import { SourcesList } from "@/components/emergency/SourcesList";
import { SafetyNote } from "@/components/emergency/SafetyNote";
import { EmergencyCallBanner } from "@/components/emergency/EmergencyCallBanner";
import { fadeInUp, staggerContainer } from "@/animations/variants";
import { useI18n } from "@/i18n";
import type { EmergencyAnalysisRequest, EmergencyAnalysisResponse } from "@/types/emergency";

interface Props {
  data: EmergencyAnalysisResponse;
  request: EmergencyAnalysisRequest | null;
  loading: boolean;
  onReanalyze: (answers: Record<string, string>) => void;
  onNew: () => void;
}

export function ResultsPage({ data, request, loading, onReanalyze, onNew }: Props) {
  const { t } = useI18n();
  const imageUrl = request?.image?.data_url ?? null;

  return (
    <div className="container max-w-3xl py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium text-low">
            <CheckCircle2 className="h-4 w-4" />
            {t.analysis.done}
          </p>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            {data.report.reference_id}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onNew}>
          <Plus className="h-4 w-4" />
          {t.common.newEmergency}
        </Button>
      </div>

      {data.safety.contact_emergency_services && (
        <div className="mb-6">
          <EmergencyCallBanner />
        </div>
      )}

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate="show"
        className="space-y-10"
      >
        <motion.div variants={fadeInUp}>
          <QuestionSection n={1} icon={Search} title={t.results.q1What}>
            <IncidentSummary data={data} />
            <VisionSummary vision={data.vision} imageUrl={imageUrl} />
          </QuestionSection>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <QuestionSection n={2} icon={Gauge} title={t.results.q2Serious}>
            <PriorityCard data={data} />
            <WhyPriority reasons={data.why_priority} />
            <DangerSigns signs={data.danger_signs} />
            <PossibleConditions conditions={data.possible_conditions} />
          </QuestionSection>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <QuestionSection n={3} icon={ListChecks} title={t.results.q3Now}>
            <ImmediateActions actions={data.immediate_actions} />
            <ClarifyingQuestions
              questions={data.clarifying_questions}
              loading={loading}
              onReanalyze={onReanalyze}
            />
          </QuestionSection>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <QuestionSection n={4} icon={MapPin} title={t.results.q4Help}>
            <HospitalCard hospital={data.hospital ?? null} alternatives={data.hospital_alternatives} />
          </QuestionSection>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <QuestionSection n={5} icon={BellRing} title={t.results.q5Notified}>
            <NotificationsPanel items={data.notifications} />
            <HospitalPreAlert alert={data.pre_alert ?? null} />
          </QuestionSection>
        </motion.div>

        {/* Handover + trust */}
        <motion.div variants={fadeInUp} className="space-y-4">
          <HandoverReport data={data} />
          <SourcesList sources={data.sources} />
          <SafetyNote safety={data.safety} />
          <div className="flex gap-3 rounded-lg border bg-muted/30 p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">{t.results.disclaimerTitle}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {data.disclaimer}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
