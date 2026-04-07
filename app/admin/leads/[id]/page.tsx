import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Mail, Globe, MapPin, Calendar, BarChart3, Bot } from "lucide-react";
import { LLMVisibilityDetail, type StoredLLMSummary } from "@/components/admin/llm-visibility-detail";
import { RemediationPlan } from "@/components/admin/remediation-plan";

const statusColors: Record<string, string> = {
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

const gradeColors: Record<string, string> = {
  Excellent: "bg-green-500/10 text-green-400 border-green-500/20",
  Good: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Fair: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Poor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Critical: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const lead = await prisma.gEOAuditLead.findUnique({ where: { id } });

  if (!lead) {
    notFound();
  }

  const agentResults = lead.agentResults as Record<string, { score: number; grade: string; rawMarkdown?: string }> | null;
  const llmResults = (lead.llmResults as StoredLLMSummary[] | null) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/leads">
          <Button variant="ghost" size="icon" className="text-zinc-400">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-zinc-100 truncate">
              {lead.company || lead.email}
            </h1>
            <Badge variant="outline" className={cn("text-xs", statusColors[lead.status])}>
              {lead.status}
            </Badge>
            {lead.grade && (
              <Badge variant="outline" className={cn("text-xs", gradeColors[lead.grade])}>
                {lead.grade}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {lead.email}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {lead.websiteUrl}
            </span>
            {lead.city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {lead.city}
              </span>
            )}
            {lead.category && (
              <span className="flex items-center gap-1">
                <Bot className="h-3 w-3" />
                {lead.category}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(lead.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      {lead.compositeScore !== null && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-base text-zinc-100 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-zinc-400" />
              Composite Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-zinc-100">{lead.compositeScore}</div>
              <div className="text-sm text-zinc-500">/ 100</div>
              {lead.grade && (
                <Badge variant="outline" className={cn("text-sm", gradeColors[lead.grade])}>
                  {lead.grade}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {agentResults && Object.keys(agentResults).length > 0 && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-base text-zinc-100 flex items-center gap-2">
              <Bot className="h-4 w-4 text-zinc-400" />
              Agent Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {Object.entries(agentResults).map(([key, agent]) => {
                const labels: Record<string, string> = {
                  visibility: "AI Visibility",
                  content: "Content E-E-A-T",
                  technical: "Technical GEO",
                  rag: "RAG Readiness",
                  platform: "Platform",
                  schema: "Schema",
                };
                return (
                  <div key={key} className="rounded-lg bg-zinc-800/50 p-4 border border-zinc-800">
                    <p className="text-xs text-zinc-500">{labels[key] || key}</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-100">{agent.score}/100</p>
                    <Badge variant="outline" className={cn("text-xs mt-2", gradeColors[agent.grade])}>
                      {agent.grade}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {agentResults && Object.keys(agentResults).length > 0 && (
        <RemediationPlan agentResults={agentResults} />
      )}

      {llmResults.length > 0 && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-base text-zinc-100 flex items-center gap-2">
              <Globe className="h-4 w-4 text-zinc-400" />
              LLM Visibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-500 mb-4">
              Each engine shows whether failures were configuration, rate limits, or successful replies with no
              brand match. Expand <strong className="text-zinc-400">Prompts &amp; model replies</strong> for the
              exact question and stored answer (truncated for size).
            </p>
            <LLMVisibilityDetail summaries={llmResults} />
          </CardContent>
        </Card>
      )}

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-base text-zinc-100">Raw Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-auto max-h-96 text-xs text-zinc-400 bg-zinc-950 p-4 rounded-md border border-zinc-800">
            {JSON.stringify(lead, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
