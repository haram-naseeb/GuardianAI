import {
  Building2,
  CheckCircle2,
  Clock,
  MinusCircle,
  Siren,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { useI18n } from "@/i18n";
import type {
  NotificationChannel,
  NotificationState,
  NotificationStatus,
} from "@/types/emergency";

const CHANNEL_ICON: Record<NotificationChannel, LucideIcon> = {
  family: Users,
  hospital: Building2,
  emergency_service: Siren,
};

const STATE_META: Record<
  NotificationState,
  { icon: LucideIcon; variant: NonNullable<BadgeProps["variant"]> }
> = {
  SIMULATED_SENT: { icon: CheckCircle2, variant: "low" },
  PREPARED: { icon: Clock, variant: "moderate" },
  NOT_SENT: { icon: MinusCircle, variant: "muted" },
};

export function NotificationsPanel({ items }: { items: NotificationStatus[] }) {
  const { t } = useI18n();
  if (items.length === 0) return null;

  const channelLabel: Record<NotificationChannel, string> = {
    family: t.results.channelFamily,
    hospital: t.results.channelHospital,
    emergency_service: t.results.channelEmergency,
  };
  const stateLabel: Record<NotificationState, string> = {
    SIMULATED_SENT: t.results.stateSIMULATED_SENT,
    PREPARED: t.results.statePREPARED,
    NOT_SENT: t.results.stateNOT_SENT,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Siren className="h-4 w-4 text-primary" />
          {t.results.notifyTitle}
        </CardTitle>
        <CardDescription>{t.results.notifySubtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((n, i) => {
            const ChannelIcon = CHANNEL_ICON[n.channel];
            const sm = STATE_META[n.state];
            const StateIcon = sm.icon;
            return (
              <li
                key={i}
                className="flex items-center justify-between gap-3 rounded-md border bg-muted/20 p-3"
              >
                <div className="flex min-w-0 items-start gap-2.5">
                  <ChannelIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{channelLabel[n.channel]}</p>
                    <p className="text-xs text-muted-foreground">{n.detail}</p>
                  </div>
                </div>
                <Badge variant={sm.variant} className="shrink-0">
                  <StateIcon className="h-3 w-3" />
                  {stateLabel[n.state]}
                </Badge>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
