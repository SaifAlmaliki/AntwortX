"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { extractPriorityActions } from "@/lib/geo/extract-actions";
import { extractScoreJustification } from "@/lib/geo/extract-score-justification";

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

interface RemediationPlanProps {
  agentResults: AgentResults;
}

const AGENT_ORDER = ["visibility", "content", "technical", "rag", "schema", "platform"] as const;

const AGENT_LABELS: Record<string, string> = {
  visibility: "AI Visibility & Citability",
  content: "Content Quality (E-E-A-T)",
  technical: "Technical GEO",
  rag: "RAG Readiness",
  schema: "Schema & Structured Data",
  platform: "Platform Optimization",
};

const PRIORITY_COLORS: Record<string, string> = {
  CRITICAL: "bg-red-500/10 text-red-400 border-red-500/20",
  HIGH: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  LOW: "bg-green-500/10 text-green-400 border-green-500/20",
};

const ADMIN_JUSTIFICATION_MAX = 4000;

export function RemediationPlan({ agentResults }: RemediationPlanProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const sections = AGENT_ORDER.filter((key) => agentResults[key]).map((key) => {
    const agent = agentResults[key]!;
    return {
      key,
      agent,
      actions: extractPriorityActions(agent.rawMarkdown ?? ""),
      rationale: extractScoreJustification(agent.rawMarkdown ?? "", ADMIN_JUSTIFICATION_MAX),
    };
  });

  if (sections.length === 0) return null;

  const allActions = sections.flatMap((s) => s.actions.map((a) => ({ agent: s.key, ...a })));

  const criticalCount = allActions.filter((a) => a.priority === "CRITICAL").length;
  const highCount = allActions.filter((a) => a.priority === "HIGH").length;

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-base text-zinc-100 flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-zinc-400" />
          Remediation Plan
          {allActions.length > 0 && (
            <div className="flex gap-2 ml-auto">
              {criticalCount > 0 && (
                <Badge variant="outline" className={cn("text-xs", PRIORITY_COLORS.CRITICAL)}>
                  {criticalCount} Critical
                </Badge>
              )}
              {highCount > 0 && (
                <Badge variant="outline" className={cn("text-xs", PRIORITY_COLORS.HIGH)}>
                  {highCount} High
                </Badge>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sections.map(({ key, agent, actions, rationale }) => {
            const isOpen = openSections[key] ?? false;

            return (
              <Collapsible key={key} open={isOpen} onOpenChange={(v) => setOpenSections((prev) => ({ ...prev, [key]: v }))}>
                <CollapsibleTrigger asChild>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50 border border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors">
                    {isOpen ? <ChevronDown className="h-4 w-4 text-zinc-500" /> : <ChevronRight className="h-4 w-4 text-zinc-500" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200">{AGENT_LABELS[key] || key}</p>
                      <p className="text-xs text-zinc-500">
                        {actions.length > 0
                          ? `${actions.length} structured action items · `
                          : "0 structured actions · "}
                        Score: {agent.score}/100 ({agent.grade})
                      </p>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {actions.length === 0 ? (
                        <Badge variant="outline" className="text-xs text-zinc-500 border-zinc-600">
                          No parsed actions
                        </Badge>
                      ) : (
                        <>
                          {actions.slice(0, 3).map((a, i) => (
                            <Badge key={i} variant="outline" className={cn("text-xs", PRIORITY_COLORS[a.priority])}>
                              {a.priority}
                            </Badge>
                          ))}
                          {actions.length > 3 && (
                            <Badge variant="outline" className="text-xs text-zinc-500 border-zinc-700">
                              +{actions.length - 3}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="ml-6 mt-2 space-y-3 pb-2">
                    <div>
                      <p className="text-xs font-medium text-zinc-400 mb-1">Score rationale</p>
                      <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{rationale}</p>
                    </div>
                    {actions.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-zinc-400">Priority actions</p>
                        {actions.map((action, i) => (
                          <div key={i} className="flex gap-3 items-start">
                            <Badge variant="outline" className={cn("text-xs shrink-0 mt-0.5", PRIORITY_COLORS[action.priority])}>
                              {action.priority}
                            </Badge>
                            <p className="text-sm text-zinc-300">{action.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 italic">
                        No Priority Actions list was parsed from this agent output. Check raw JSON or adjust agent prompt
                        formatting.
                      </p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
