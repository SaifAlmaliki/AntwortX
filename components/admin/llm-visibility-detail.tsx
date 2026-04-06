"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { categorizeLlmErrorMessage, llmQueryDiagnostic, summarizeLlmEngineRun } from "@/lib/geo/llm-result-diagnostics";
import { ChevronDown, ChevronRight } from "lucide-react";

const ENGINE_LABELS: Record<string, string> = {
  openai: "ChatGPT",
  perplexity: "Perplexity",
  gemini: "Google Gemini",
  claude: "Claude",
};

export interface StoredLLMQueryResult {
  engine: string;
  prompt: string;
  mentioned: boolean;
  cited: boolean;
  sentiment: string;
  mentions?: number;
  citationUrl?: string;
  error?: string;
  response?: string;
  context?: string;
}

export interface StoredLLMSummary {
  engine: string;
  mentioned: boolean;
  cited: boolean;
  sentiment: string;
  totalPrompts: number;
  mentionCount: number;
  mentionRate: number;
  results?: StoredLLMQueryResult[];
}

function headlineBadgeClass(headline: string): string {
  if (headline === "Brand detected") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  }
  if (headline === "No brand mention" || headline === "No response text stored") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-200";
  }
  if (headline === "Partial failures") {
    return "border-orange-500/30 bg-orange-500/10 text-orange-200";
  }
  if (headline === "No data") {
    return "border-zinc-600 bg-zinc-800/80 text-zinc-400";
  }
  return "border-red-500/30 bg-red-500/10 text-red-300";
}

interface LLMVisibilityDetailProps {
  summaries: StoredLLMSummary[];
  /** Smaller layout for expanded table rows */
  compact?: boolean;
}

export function LLMVisibilityDetail({ summaries, compact }: LLMVisibilityDetailProps) {
  if (summaries.length === 0) {
    return null;
  }

  return (
    <div className={cn("grid gap-3", compact ? "sm:grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-4")}>
      {summaries.map((summary) => (
        <EngineCard key={summary.engine} summary={summary} compact={compact} />
      ))}
    </div>
  );
}

function EngineCard({ summary, compact }: { summary: StoredLLMSummary; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const results = summary.results ?? [];
  const run = summarizeLlmEngineRun(results);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-4 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className={cn("font-medium text-zinc-100", compact ? "text-xs" : "text-sm")}>
          {ENGINE_LABELS[summary.engine] || summary.engine}
        </p>
        <Badge
          variant="outline"
          className={cn("w-fit text-[10px] font-normal", headlineBadgeClass(run.headline))}
        >
          {run.headline}
        </Badge>
        <p className="text-[11px] leading-snug text-zinc-500">{run.detail}</p>
      </div>

      <div className="flex flex-col gap-2 text-xs">
        <div className="flex justify-between gap-2">
          <span className="text-zinc-500">Mentioned</span>
          <span className={summary.mentioned ? "font-medium text-emerald-400" : "text-red-400"}>
            {summary.mentioned ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-zinc-500">Cited</span>
          <span className={summary.cited ? "font-medium text-emerald-400" : "text-zinc-500"}>
            {summary.cited ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-zinc-500">Sentiment</span>
          <span className="capitalize text-zinc-300">{summary.sentiment}</span>
        </div>
        <Separator className="bg-zinc-800" />
        <div className="flex justify-between gap-2">
          <span className="text-zinc-500">Mention rate</span>
          <span className="font-medium text-zinc-200">{summary.mentionRate.toFixed(0)}%</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-zinc-500">Mentions</span>
          <span className="text-zinc-200">
            {summary.mentionCount}/{summary.totalPrompts}
          </span>
        </div>
      </div>

      {results.length > 0 && (
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-full justify-between px-2 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            >
              <span>Prompts &amp; model replies ({results.length})</span>
              {open ? (
                <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-3 pt-2">
            {results.map((row, idx) => (
              <PromptBlock key={idx} index={idx + 1} row={row} compact={compact} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {results.length === 0 && (
        <p className="text-[11px] text-zinc-500">
          No per-prompt rows stored. Re-run the audit after upgrading to log prompts and replies.
        </p>
      )}
    </div>
  );
}

function PromptBlock({
  index,
  row,
  compact,
}: {
  index: number;
  row: StoredLLMQueryResult;
  compact?: boolean;
}) {
  const diag = llmQueryDiagnostic(row.error);
  const hasResponse = (row.response ?? "").trim().length > 0;
  const cat = categorizeLlmErrorMessage(row.error);

  return (
    <div className="rounded-md border border-zinc-800/80 bg-zinc-950/40 p-3 flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
          Prompt {index}
        </span>
        {row.error ? (
          <Badge variant="outline" className="border-red-500/40 bg-red-500/10 text-[10px] text-red-300">
            {diag.label || "Error"}
          </Badge>
        ) : (
          <Badge variant="outline" className="border-zinc-600 bg-zinc-800/80 text-[10px] text-zinc-400">
            Completed
          </Badge>
        )}
        <Badge
          variant="outline"
          className={cn(
            "text-[10px]",
            row.mentioned
              ? "border-emerald-500/30 text-emerald-400"
              : "border-zinc-600 text-zinc-500"
          )}
        >
          {row.mentioned ? "Brand in text" : "No brand match"}
        </Badge>
        {row.cited && (
          <Badge variant="outline" className="border-sky-500/30 text-[10px] text-sky-300">
            Cited URL
          </Badge>
        )}
      </div>

      <div>
        <p className="text-[10px] font-medium text-zinc-500">Query</p>
        <p className={cn("mt-1 whitespace-pre-wrap text-zinc-300", compact ? "text-[11px]" : "text-xs")}>
          {row.prompt}
        </p>
      </div>

      {row.error && (
        <div>
          <p className="text-[10px] font-medium text-zinc-500">Error</p>
          <p className="mt-1 font-mono text-[11px] text-red-300">{row.error}</p>
          {cat === "rate_limit" && (
            <p className="mt-1 text-[11px] text-zinc-500">
              Provider rate or quota limit — wait and retry, or check plan limits.
            </p>
          )}
          {cat === "missing_config" && (
            <p className="mt-1 text-[11px] text-zinc-500">
              Set the API key env var for this provider (see env vars in <code className="text-zinc-400">lib/geo-engines/</code>
              ).
            </p>
          )}
        </div>
      )}

      <div>
        <p className="text-[10px] font-medium text-zinc-500">Model reply (stored excerpt)</p>
        {hasResponse ? (
          <pre
            className={cn(
              "mt-1 max-h-48 overflow-auto whitespace-pre-wrap break-words rounded border border-zinc-800 bg-zinc-950 p-2 font-mono text-[11px] text-zinc-300",
              compact && "max-h-32"
            )}
          >
            {row.response}
          </pre>
        ) : (
          <p className="mt-1 text-[11px] italic text-zinc-500">
            {row.error
              ? "No reply stored because the request failed."
              : "No reply text stored for this lead (older audits or empty response)."}
          </p>
        )}
      </div>

      {row.context && (
        <div>
          <p className="text-[10px] font-medium text-zinc-500">Matched context</p>
          <p className="mt-1 text-[11px] text-zinc-400">{row.context}</p>
        </div>
      )}
    </div>
  );
}
