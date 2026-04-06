import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ActivityFeedProps {
  leads: {
    id: string;
    email: string;
    company: string | null;
    websiteUrl: string;
    status: string;
    grade: string | null;
    compositeScore: number | null;
    createdAt: Date;
  }[];
}

const statusColors: Record<string, string> = {
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function ActivityFeed({ leads }: ActivityFeedProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-base text-zinc-100">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leads.map((lead) => (
            <Link
              key={lead.id}
              href={`/admin/leads/${lead.id}`}
              className="flex items-center justify-between rounded-lg border border-zinc-800 p-3 transition-colors hover:bg-zinc-800/50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-zinc-100">
                    {lead.company || lead.email}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", statusColors[lead.status] || "bg-zinc-800 text-zinc-400")}
                  >
                    {lead.status}
                  </Badge>
                  {lead.grade && (
                    <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                      {lead.grade}
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-zinc-500">{lead.websiteUrl}</p>
              </div>
              <div className="ml-4 shrink-0 text-right">
                {lead.compositeScore !== null && (
                  <p className="text-sm font-semibold text-zinc-100">{lead.compositeScore}/100</p>
                )}
                <p className="text-xs text-zinc-500">
                  {new Date(lead.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </Link>
          ))}
          {leads.length === 0 && (
            <div className="py-8 text-center text-sm text-zinc-500">No recent activity</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
