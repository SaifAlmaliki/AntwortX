import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle, Clock, AlertTriangle, Loader2, Target } from "lucide-react";

interface KPICardsProps {
  totalLeads: number;
  completed: number;
  pending: number;
  failed: number;
  processing: number;
  avgScore: number;
}

const kpiConfig = [
  {
    label: "Total Leads",
    value: (p: KPICardsProps) => p.totalLeads,
    icon: Users,
    color: "text-zinc-100",
    bgColor: "bg-zinc-800",
  },
  {
    label: "Completed",
    value: (p: KPICardsProps) => p.completed,
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    label: "Processing",
    value: (p: KPICardsProps) => p.processing,
    icon: Loader2,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Pending",
    value: (p: KPICardsProps) => p.pending,
    icon: Clock,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    label: "Failed",
    value: (p: KPICardsProps) => p.failed,
    icon: AlertTriangle,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  {
    label: "Avg Score",
    value: (p: KPICardsProps) => `${p.avgScore}/100`,
    icon: Target,
    color: "text-zinc-100",
    bgColor: "bg-zinc-800",
  },
];

export function KPICards({ totalLeads, completed, pending, failed, processing, avgScore }: KPICardsProps) {
  const props = { totalLeads, completed, pending, failed, processing, avgScore };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpiConfig.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.label} className="border-zinc-800 bg-zinc-900">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-500">{kpi.label}</p>
                  <p className={`mt-1 text-2xl font-bold ${kpi.color}`}>
                    {kpi.value(props)}
                  </p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.bgColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
