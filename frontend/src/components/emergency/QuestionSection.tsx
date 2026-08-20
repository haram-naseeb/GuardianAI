import type { LucideIcon } from "lucide-react";

interface Props {
  n: number;
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}

/** A numbered "question" section — the results page answers five of these. */
export function QuestionSection({ n, icon: Icon, title, children }: Props) {
  return (
    <section className="scroll-mt-24">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {n}
        </span>
        <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
        <h2 className="text-lg font-bold tracking-tight sm:text-xl">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
