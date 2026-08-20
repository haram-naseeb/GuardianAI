import { motion } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  Building2,
  Gauge,
  Info,
  ListChecks,
  MapPin,
  MessageSquareText,
  ScanSearch,
  Search,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeInUp, listItem, staggerContainer } from "@/animations/variants";
import { useI18n } from "@/i18n";

const STEP_ICONS: LucideIcon[] = [MessageSquareText, ScanSearch, ListChecks, Building2];
const Q_ICONS: LucideIcon[] = [Search, Gauge, ListChecks, MapPin, BellRing];

export function LandingPage({ onStart }: { onStart: () => void }) {
  const { t } = useI18n();
  const L = t.landing;

  const steps = [
    { title: L.step1Title, desc: L.step1Desc },
    { title: L.step2Title, desc: L.step2Desc },
    { title: L.step3Title, desc: L.step3Desc },
    { title: L.step4Title, desc: L.step4Desc },
  ];
  const questions = [L.q1, L.q2, L.q3, L.q4, L.q5];
  const trust = [L.trust1, L.trust2, L.trust3];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-70" aria-hidden />
        <div className="container relative py-16 sm:py-24">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {L.badge}
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="mt-5 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
            >
              {L.heroTitlePre}{" "}
              <span className="text-primary">{L.heroTitleAccent}</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg"
            >
              {L.heroSubtitle}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Button size="lg" onClick={onStart} className="w-full sm:w-auto">
                {L.ctaPrimary}
                <ArrowRight className="h-4 w-4 flip-rtl" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })
                }
                className="w-full sm:w-auto"
              >
                {L.ctaSecondary}
              </Button>
            </motion.div>

            <motion.ul
              variants={fadeInUp}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
            >
              {trust.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-low" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t bg-muted/30 py-16 sm:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{L.howTitle}</h2>
            <p className="mt-3 text-muted-foreground">{L.howSubtitle}</p>
          </div>

          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map((s, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <motion.div
                  key={s.title}
                  variants={listItem}
                  className="relative rounded-lg border bg-card p-5 shadow-soft"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-3xl font-extrabold text-muted-foreground/15">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Five questions */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{L.answersTitle}</h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {questions.map((q, i) => {
              const Icon = Q_ICONS[i];
              return (
                <div
                  key={q}
                  className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-soft"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-medium">{q}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="pb-20">
        <div className="container">
          <div className="mx-auto flex max-w-3xl gap-3 rounded-lg border border-primary/20 bg-primary/[0.04] p-5">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold">{L.disclaimerTitle}</p>
              <p className="mt-1 text-sm text-muted-foreground">{L.disclaimer}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
