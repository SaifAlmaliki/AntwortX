import React from "react";
import { renderToBuffer, Document } from "@react-pdf/renderer";
import { CoverPage } from "./components/CoverPage";
import { ExecutiveSummary } from "./components/ExecutiveSummary";
import { ServicesPage } from "./components/ServicesPage";
import { LLMVisibilitySection } from "./components/LLMVisibilitySection";
import type { CompositeScore, AgentResults } from "../geo/types";
import { computeLLMVisibilityScore, type LLMPresenceSummary } from "../geo/llm-presence";

interface GeneratePDFParams {
  url: string;
  company: string;
  composite: CompositeScore;
  agents: AgentResults;
  llmResults?: LLMPresenceSummary[];
  brandName?: string;
  category?: string;
}

export async function generatePDF(params: GeneratePDFParams): Promise<Buffer> {
  const { url, company, composite, agents, llmResults, brandName, category } = params;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [
    React.createElement(CoverPage, { url, company, composite, date }),
    React.createElement(ExecutiveSummary, {
      url,
      composite,
      agents,
      llmMentionedCount,
      llmTotalEngines,
    }),
  ];

  const effectiveCategory = category || "";
  if (llmResults && llmResults.length > 0 && brandName && effectiveCategory) {
    const llmScore = computeLLMVisibilityScore(llmResults);
    children.push(
      React.createElement(LLMVisibilitySection, {
        llmResults,
        brandName,
        category: effectiveCategory,
        visibilityScore: llmScore.score,
        visibilityGrade: llmScore.grade,
      })
    );
  }

  children.push(
    React.createElement(ServicesPage, { domain })
  );

  const doc = React.createElement(
    Document,
    {
      title: `GEO Visibility Report — ${url}`,
      author: "Zempar",
      subject: "Generative Engine Optimization Report",
    },
    ...children
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(doc as any);
  return Buffer.from(buffer);
}
