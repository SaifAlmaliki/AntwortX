"use client";

import type { LucideIcon } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
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
        "card-surface group relative flex min-h-0 min-w-0 flex-col items-center px-5 py-6 text-center",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <Spotlight size={220} fill="signal" />
      </div>
      <div
        className="relative z-10 mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-[0_0_24px_-4px_var(--signal-glow)]"
        aria-hidden
      >
        <Icon className="h-7 w-7" strokeWidth={1.75} />
      </div>
      <h3 className="relative z-10 font-display text-base font-semibold text-foreground sm:text-lg">{title}</h3>
      <p className="relative z-10 mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
        {description}
      </p>
    </div>
  );
}
