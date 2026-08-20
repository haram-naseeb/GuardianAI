import { useMemo, useState } from "react";
import { Check, Copy, Download, FileText, Share2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buildReportText, reportFilename } from "@/lib/report";
import { useI18n } from "@/i18n";
import type { EmergencyAnalysisResponse } from "@/types/emergency";

export function HandoverReport({ data }: { data: EmergencyAnalysisResponse }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const text = useMemo(() => buildReportText(data, t), [data, t]);

  const canShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const download = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = reportFilename(data.report.reference_id);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title: `${t.common.appName} — ${data.report.reference_id}`, text });
    } catch {
      /* cancelled / unsupported */
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4 text-primary" />
          {t.results.reportTitle}
        </CardTitle>
        <CardDescription>{t.results.reportSubtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">{t.results.reportRef}</p>
            <p className="font-mono font-semibold">{data.report.reference_id}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.results.reportTime}</p>
            <p className="font-medium">{new Date(data.report.time).toLocaleString()}</p>
          </div>
        </div>

        <pre className="no-scrollbar max-h-56 overflow-auto whitespace-pre-wrap rounded-md border bg-muted/30 p-3 font-mono text-[11px] leading-relaxed">
          {text}
        </pre>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={download}>
            <Download className="h-4 w-4" />
            {t.results.reportDownload}
          </Button>
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? <Check className="h-4 w-4 text-low" /> : <Copy className="h-4 w-4" />}
            {copied ? t.common.copied : t.results.reportCopy}
          </Button>
          {canShare && (
            <Button variant="outline" size="sm" onClick={share}>
              <Share2 className="h-4 w-4" />
              {t.results.reportShare}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
