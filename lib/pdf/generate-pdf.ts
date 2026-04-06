import React from "react";
import { renderToBuffer, Document } from "@react-pdf/renderer";
import { CoverPage } from "./components/CoverPage";
import { AgentSection } from "./components/AgentSection";
import { ActionPlan } from "./components/ActionPlan";
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [
    React.createElement(CoverPage, { url, company, composite, date }),
    React.createElement(AgentSection, { agent: agents.visibility }),
    React.createElement(AgentSection, { agent: agents.content }),
    React.createElement(AgentSection, { agent: agents.technical }),
    React.createElement(AgentSection, { agent: agents.platform }),
    React.createElement(AgentSection, { agent: agents.schema }),
  ];

  if (llmResults && llmResults.length > 0 && brandName && category) {
    const llmScore = computeLLMVisibilityScore(llmResults);
    children.push(
      React.createElement(LLMVisibilitySection, {
        llmResults,
        brandName,
        category,
        visibilityScore: llmScore.score,
        visibilityGrade: llmScore.grade,
      })
    );
  }

  children.push(
    React.createElement(ActionPlan, { agents }),
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
