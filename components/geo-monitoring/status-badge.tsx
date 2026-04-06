import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "pending" | "running" | "completed" | "failed";
  className?: string;
}

const statusConfig = {
  pending: { label: "Pending", classes: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  running: { label: "Running", classes: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  completed: { label: "Completed", classes: "bg-green-500/10 text-green-500 border-green-500/20" },
  failed: { label: "Failed", classes: "bg-red-500/10 text-red-500 border-red-500/20" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", config.classes, className)}>
      <span className="size-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
