import { ShieldPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

interface LogoProps {
  onClick?: () => void;
  showTagline?: boolean;
  className?: string;
}

export function Logo({ onClick, showTagline = false, className }: LogoProps) {
  const { t } = useI18n();
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2.5 text-start",
        onClick && "rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...(onClick ? { type: "button" as const, "aria-label": t.nav.home } : {})}
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft transition-transform group-hover:scale-105">
        <ShieldPlus className="h-5 w-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-extrabold tracking-tight">
          {t.common.appName}
        </span>
        {showTagline && (
          <span className="mt-0.5 text-[11px] text-muted-foreground">
            {t.common.tagline}
          </span>
        )}
      </span>
    </Wrapper>
  );
}
