"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  description?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  trend,
  trendValue,
  description,
  className,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      className={cn("card-surface p-5", className)}
    >
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tabular-nums">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {trend && trendValue && (
        <div className="flex items-center gap-1 mt-2">
          {trend === "up" && <ArrowUp className="size-3.5 text-green-500" />}
          {trend === "down" && <ArrowDown className="size-3.5 text-red-500" />}
          {trend === "neutral" && <Minus className="size-3.5 text-muted-foreground" />}
          <span className={cn(
            "text-xs tabular-nums",
            trend === "up" && "text-green-500",
            trend === "down" && "text-red-500",
            trend === "neutral" && "text-muted-foreground"
          )}>
            {trendValue}
          </span>
        </div>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mt-2 text-pretty">{description}</p>
      )}
    </motion.div>
  );
}
