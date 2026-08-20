import { useI18n } from "@/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t py-6">
      <div className="container space-y-2 text-center">
        <p className="mx-auto max-w-2xl text-xs leading-relaxed text-muted-foreground">
          {t.landing.disclaimer}
        </p>
        <p className="text-[11px] text-muted-foreground/70">
          {t.common.appName} · {t.common.poweredBy}
        </p>
      </div>
    </footer>
  );
}
