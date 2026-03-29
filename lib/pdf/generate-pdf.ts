import React from "react";
import { renderToBuffer, Document } from "@react-pdf/renderer";
import { CoverPage } from "./components/CoverPage";
import { AgentSection } from "./components/AgentSection";
import { ActionPlan } from "./components/ActionPlan";
import type { CompositeScore, AgentResults } from "../geo/types";

interface GeneratePDFParams {
  url: string;
  company: string;
  composite: CompositeScore;
  agents: AgentResults;
}

export async function generatePDF(params: GeneratePDFParams): Promise<Buffer> {
  const { url, company, composite, agents } = params;
  const date = new Date().toISOString().slice(0, 10);

  const doc = React.createElement(
    Document,
    {
      title: `GEO Visibility Report — ${url}`,
      author: "Zempar",
      subject: "Generative Engine Optimization Report",
    },
    React.createElement(CoverPage, { url, company, composite, date }),
    React.createElement(AgentSection, { agent: agents.visibility }),
    React.createElement(AgentSection, { agent: agents.content }),
    React.createElement(AgentSection, { agent: agents.technical }),
    React.createElement(AgentSection, { agent: agents.platform }),
    React.createElement(AgentSection, { agent: agents.schema }),
    React.createElement(ActionPlan, { agents })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(doc as any);
  return Buffer.from(buffer);
}
