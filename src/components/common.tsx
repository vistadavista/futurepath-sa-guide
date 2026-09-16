import * as React from "react";
import { Info } from "lucide-react";
import { AI_DISCLAIMER } from "@/data/questionnaire";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-2xl text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-xl border border-border bg-muted/60 p-3 text-xs text-muted-foreground",
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-info" />
      <p>
        <span className="font-semibold text-foreground">Responsible AI:</span> {AI_DISCLAIMER}
      </p>
    </div>
  );
}

export function ProgressRing({
  value,
  label,
  hint,
  tone = "primary",
}: {
  value: number;
  label: string;
  hint?: string;
  tone?: "primary" | "accent" | "info";
}) {
  const stroke = {
    primary: "var(--color-primary)",
    accent: "var(--color-accent)",
    info: "var(--color-info)",
  }[tone];
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 80 80" className="size-20 shrink-0 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--color-muted)" strokeWidth="9" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div>
        <p className="font-display text-2xl font-bold">{value}%</p>
        <p className="text-sm font-medium">{label}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-8 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
