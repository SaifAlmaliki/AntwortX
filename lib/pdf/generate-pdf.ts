import React from "react";
import { renderToBuffer, Document } from "@react-pdf/renderer";
import { CoverPage } from "./components/CoverPage";
import { ExecutiveSummary } from "./components/ExecutiveSummary";
import { ServicesPage } from "./components/ServicesPage";
import { LLMVisibilitySection } from "./components/LLMVisibilitySection";
import { DimensionJustifications } from "./components/DimensionJustifications";
import type { CompositeScore, AgentResults } from "../geo/types";
import { computeLLMVisibilityScore, type LLMPresenceSummary } from "../geo/llm-presence";
import type { ScanSnapshotInput } from "@/lib/pdf/scan-snapshot";

interface GeneratePDFParams {
  url: string;
  company: string;
  composite: CompositeScore;
  agents: AgentResults;
  llmResults?: LLMPresenceSummary[];
  brandName?: string;
  /** Primary label for LLM testing (extracted category or lead category). */
  category?: string;
  userCategory?: string;
  extractedCategory?: string | null;
  extractedServices?: string[];
  targetAudience?: string | null;
  wordCount?: number;
}

export async function generatePDF(params: GeneratePDFParams): Promise<Buffer> {
  const {
    url,
    company,
    composite,
    agents,
    llmResults,
    brandName,
    category,
    userCategory,
    extractedCategory,
    extractedServices,
    targetAudience,
    wordCount,
  } = params;
  const date = new Date().toISOString().slice(0, 10);

  const domain = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  })();

  const llmMentionedCount = llmResults?.filter((r) => r.mentioned).length ?? 0;
  const llmTotalEngines = llmResults?.length ?? 0;
  const promptsPerEngine = llmResults?.[0]?.totalPrompts ?? 0;

  const effectiveCategory = category || "";
  const hasLlmVisibilitySection = Boolean(
    llmResults && llmResults.length > 0 && brandName && effectiveCategory,
  );

  const scanSnapshot: ScanSnapshotInput | undefined = userCategory
    ? {
        date,
        url,
        wordCount,
        userCategory,
        extractedCategory: extractedCategory ?? null,
        extractedServices: extractedServices ?? [],
        targetAudience: targetAudience ?? null,
        llmEngineCount: llmTotalEngines || 4,
        llmPromptsPerEngine: promptsPerEngine || 5,
      }
    : undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [
    React.createElement(CoverPage, { url, company, composite, date }),
    React.createElement(DimensionJustifications, { composite, agents }),
    React.createElement(ExecutiveSummary, {
      url,
      composite,
      agents,
      llmMentionedCount,
      llmTotalEngines,
      scanSnapshot,
      hasLlmVisibilitySection,
    }),
  ];
  if (hasLlmVisibilitySection && llmResults && brandName) {
    const llmScore = computeLLMVisibilityScore(llmResults);
    const sharedPrompts = llmResults[0].results.map((r) => r.prompt);
    children.push(
      React.createElement(LLMVisibilitySection, {
        llmResults,
        brandName: brandName,
        category: effectiveCategory,
        userCategory: userCategory ?? effectiveCategory,
        extractedCategory: extractedCategory ?? null,
        extractedServices: extractedServices ?? [],
        targetAudience: targetAudience ?? null,
        wordCount,
        reportDate: date,
        targetUrl: url,
        sharedPrompts,
        visibilityScore: llmScore.score,
        visibilityGrade: llmScore.grade,
      }),
    );
  }

  children.push(React.createElement(ServicesPage, { domain }));

  const doc = React.createElement(
    Document,
    {
      title: `GEO Visibility Report — ${url}`,
      author: "Zempar",
      subject: "Generative Engine Optimization Report",
    },
    ...children,
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(doc as any);
  return Buffer.from(buffer);
}
