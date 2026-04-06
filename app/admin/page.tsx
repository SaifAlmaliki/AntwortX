import { prisma } from "@/lib/db";
import { KPICards } from "@/components/admin/kpi-cards";
import { ScoreChart } from "@/components/admin/score-chart";
import { GradeBreakdown } from "@/components/admin/grade-breakdown";
import { ActivityFeed } from "@/components/admin/activity-feed";

export default async function AdminOverviewPage() {
  const [totalLeads, statusCounts, gradeCounts, recentLeads, avgScoreData] = await Promise.all([
    prisma.gEOAuditLead.count(),
    prisma.gEOAuditLead.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.gEOAuditLead.groupBy({
      by: ["grade"],
      _count: true,
      where: { grade: { not: null } },
    }),
    prisma.gEOAuditLead.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        email: true,
        company: true,
        websiteUrl: true,
        status: true,
        grade: true,
        compositeScore: true,
        createdAt: true,
      },
    }),
    prisma.gEOAuditLead.findMany({
      where: {
        compositeScore: { not: null },
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: "asc" },
      select: {
        compositeScore: true,
        createdAt: true,
      },
    }),
  ]);

  const statusMap = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count])
  );

  const gradeMap = Object.fromEntries(
    gradeCounts.map((g) => [g.grade, g._count])
  );

  const completedLeads = (statusMap["completed"] as number) || 0;
  const failedLeads = (statusMap["failed"] as number) || 0;
  const pendingLeads = (statusMap["pending"] as number) || 0;
  const processingLeads = (statusMap["processing"] as number) || 0;

  const avgScore =
    avgScoreData.length > 0
      ? Math.round(
          avgScoreData.reduce((sum, l) => sum + (l.compositeScore || 0), 0) /
            avgScoreData.length
        )
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Monitor your GEO audit pipeline and performance
        </p>
      </div>

      <KPICards
        totalLeads={totalLeads}
        completed={completedLeads}
        pending={pendingLeads}
        failed={failedLeads}
        processing={processingLeads}
        avgScore={avgScore}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <ScoreChart data={avgScoreData} />
        <GradeBreakdown gradeMap={gradeMap} />
      </div>

      <ActivityFeed leads={recentLeads} />
    </div>
  );
}
