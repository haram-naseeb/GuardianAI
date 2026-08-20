import { MessageSquareText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n";

interface Props {
  value: string;
  onChange: (value: string) => void;
  max: number;
}

export function EmergencyTextInput({ value, onChange, max }: Props) {
  const { t } = useI18n();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <MessageSquareText className="h-4 w-4 text-primary" />
        <label htmlFor="emergency-desc" className="text-sm font-semibold">
          {t.emergency.describeLabel}
        </label>
      </div>
      <Textarea
        id="emergency-desc"
        value={value}
        maxLength={max}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.emergency.describePlaceholder}
        className="min-h-[140px]"
      />
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>{t.emergency.describeHint}</span>
        <span className="shrink-0 tabular-nums">{t.emergency.charCount(value.length, max)}</span>
      </div>
    </div>
  );
}
