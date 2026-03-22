"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ValuePillarCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

/** Single mission / value pillar — icon, heading, body; center-aligned card. */
export function ValuePillarCard({
  icon: Icon,
  title,
  description,
  className,
}: ValuePillarCardProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 min-w-0 flex-col items-center rounded-2xl border border-cyan-500/10 bg-white/[0.03] px-5 py-6 text-center shadow-none backdrop-blur-sm transition-colors hover:border-cyan-400/30",
        className
      )}
    >
      <div
        className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-[0_0_24px_-4px_var(--signal-glow)]"
        aria-hidden
      >
        <Icon className="h-7 w-7" strokeWidth={1.75} />
      </div>
      <h3 className="font-display text-base font-semibold text-white sm:text-lg">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-[0.9375rem]">{description}</p>
    </div>
  );
}
