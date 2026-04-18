"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Globe, BarChart3, ClipboardList } from "lucide-react";
import { useState } from "react";
import { LLMVisibilityDetail, type StoredLLMSummary } from "@/components/admin/llm-visibility-detail";
import { RemediationPlan } from "@/components/admin/remediation-plan";

interface AgentResult {
  score: number;
  grade: string;
  rawMarkdown?: string;
}

interface AgentResults {
  visibility?: AgentResult;
  content?: AgentResult;
  technical?: AgentResult;
  rag?: AgentResult;
  platform?: AgentResult;
  schema?: AgentResult;
  [key: string]: AgentResult | undefined;
}

interface LeadRowDetailProps {
  lead: Record<string, unknown>;
}

const gradeColors: Record<string, string> = {
  Excellent: "bg-green-500/10 text-green-400 border-green-500/20",
  Good: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Fair: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Poor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Critical: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function LeadRowDetail({ lead }: LeadRowDetailProps) {
  const [open, setOpen] = useState(false);

  const agentResults = lead.agentResults as AgentResults | null;
  const llmResults = (lead.llmResults as StoredLLMSummary[] | null) || [];
  const compositeScore = (lead.compositeScore as number | null) ?? 0;
  const grade = (lead.grade as string | null) ?? "N/A";

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 rounded-md transition-colors">
          {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          <span>View detailed results</span>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="px-3 pb-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-zinc-400" />
            <h4 className="text-sm font-medium text-zinc-200">Composite Score</h4>
            <Badge variant="outline" className={cn("text-xs", gradeColors[grade])}>
              {compositeScore}/100 — {grade}
            </Badge>
          </div>

          {agentResults && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-6">
              {(() => {
                const vis = agentResults.visibility;
                const rows: { key: string; label: string; sub?: string; agent: AgentResult }[] = [];
                if (vis) {
                  rows.push({ key: "visibility", label: "AI Visibility", agent: vis });
                  rows.push({
                    key: "brand",
                    label: "Brand Authority",
                    sub: "Same as AI Visibility in scoring model.",
                    agent: vis,
                  });
                }
                const order = ["content", "technical", "rag", "schema", "platform"] as const;
                const labels: Record<string, string> = {
                  content: "Content E-E-A-T",
                  technical: "Technical GEO",
                  rag: "RAG Readiness",
                  platform: "Platform",
                  schema: "Schema",
                };
                for (const k of order) {
                  const a = agentResults[k];
                  if (a) rows.push({ key: k, label: labels[k], agent: a });
                }
                return rows.map(({ key, label, sub, agent: a }) => (
                  <div key={key} className="rounded-md bg-zinc-800/50 p-2 border border-zinc-800">
                    <p className="text-xs text-zinc-500">{label}</p>
                    <p className="text-sm font-semibold text-zinc-100">{a.score}/100</p>
                    <Badge variant="outline" className={cn("text-xs mt-1", gradeColors[a.grade])}>
                      {a.grade}
                    </Badge>
                    {sub ? <p className="text-[10px] text-zinc-600 mt-1 leading-tight">{sub}</p> : null}
                  </div>
                ));
              })()}
            </div>
          )}
        </div>

        <Separator className="bg-zinc-800" />

        {llmResults.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-4 w-4 text-zinc-400" />
              <h4 className="text-sm font-medium text-zinc-200">LLM Visibility</h4>
            </div>

            <div className="ml-6">
              <LLMVisibilityDetail summaries={llmResults} compact />
            </div>
          </div>
        )}

        {agentResults && Object.keys(agentResults).length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="h-4 w-4 text-zinc-400" />
              <h4 className="text-sm font-medium text-zinc-200">Remediation Plan</h4>
            </div>
            <div className="ml-6">
              <RemediationPlan
                agentResults={agentResults as AgentResults}
                lead={{
                  websiteUrl: typeof lead.websiteUrl === "string" ? lead.websiteUrl : "",
                  company: typeof lead.company === "string" ? lead.company : null,
                  category: typeof lead.category === "string" ? lead.category : null,
                  city: typeof lead.city === "string" ? lead.city : null,
                }}
              />
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
