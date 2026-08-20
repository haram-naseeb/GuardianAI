import { Plus } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

interface HeaderProps {
  onHome: () => void;
  onNew: () => void;
  showNew?: boolean;
}

export function Header({ onHome, onNew, showNew = false }: HeaderProps) {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b glass">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Logo onClick={onHome} />

        <div className="flex items-center gap-1.5 sm:gap-2">
          {showNew && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNew}
              className="hidden sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              {t.common.newEmergency}
            </Button>
          )}
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
