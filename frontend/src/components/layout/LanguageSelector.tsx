import { cn } from "@/lib/utils";
import { useI18n, type Lang } from "@/i18n";

const OPTIONS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ur", label: "اردو" },
];

export function LanguageSelector() {
  const { lang, setLang, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className="inline-flex items-center rounded-lg border bg-muted/50 p-0.5"
    >
      {OPTIONS.map((o) => {
        const active = lang === o.code;
        return (
          <button
            key={o.code}
            type="button"
            aria-pressed={active}
            onClick={() => setLang(o.code)}
            className={cn(
              "min-w-[2.25rem] rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
