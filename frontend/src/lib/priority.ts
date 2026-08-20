/**
 * Priority → visual identity map (Sections 20, 21, 31). Colour is NEVER the only
 * signal: every priority also carries a distinct icon and a text label, so the
 * severity is legible to colour-blind users and in grayscale.
 *
 * Class strings are written out in full so Tailwind's content scanner keeps them
 * in the build — do not build these names dynamically.
 */
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { Priority } from "@/types/emergency";

export const PRIORITY_ORDER: Priority[] = ["CRITICAL", "HIGH", "MODERATE", "LOW"];

export interface PriorityMeta {
  icon: LucideIcon;
  /** Solid fill (badges, the priority header bar). */
  solid: string;
  /** Soft tinted surface for cards/callouts. */
  soft: string;
  /** Accent text colour. */
  text: string;
  /** Border tint. */
  border: string;
  /** Focus/glow ring tint. */
  ring: string;
  /** Small status dot. */
  dot: string;
  /** Whether this level should visually pulse (critical urgency cue). */
  pulse: boolean;
}

export const priorityMeta: Record<Priority, PriorityMeta> = {
  CRITICAL: {
    icon: AlertOctagon,
    solid: "bg-critical text-critical-foreground",
    soft: "bg-critical-soft text-critical",
    text: "text-critical",
    border: "border-critical/40",
    ring: "ring-critical/40",
    dot: "bg-critical",
    pulse: true,
  },
  HIGH: {
    icon: AlertTriangle,
    solid: "bg-high text-high-foreground",
    soft: "bg-high-soft text-high",
    text: "text-high",
    border: "border-high/40",
    ring: "ring-high/40",
    dot: "bg-high",
    pulse: false,
  },
  MODERATE: {
    icon: Info,
    solid: "bg-moderate text-moderate-foreground",
    soft: "bg-moderate-soft text-moderate",
    text: "text-moderate",
    border: "border-moderate/40",
    ring: "ring-moderate/40",
    dot: "bg-moderate",
    pulse: false,
  },
  LOW: {
    icon: ShieldCheck,
    solid: "bg-low text-low-foreground",
    soft: "bg-low-soft text-low",
    text: "text-low",
    border: "border-low/40",
    ring: "ring-low/40",
    dot: "bg-low",
    pulse: false,
  },
};
