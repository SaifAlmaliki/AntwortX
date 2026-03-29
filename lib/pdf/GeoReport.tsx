import React from "react";
import { Document } from "@react-pdf/renderer";
import { CoverPage } from "./components/CoverPage";
import { AgentSection } from "./components/AgentSection";
import { ActionPlan } from "./components/ActionPlan";
import type { CompositeScore, AgentResults } from "../geo/types";

interface Props {
  url: string;
  company: string;
  composite: CompositeScore;
  agents: AgentResults;
  date: string;
}

export function GeoReport({ url, company, composite, agents, date }: Props) {
  return (
    <Document
      title={`GEO Visibility Report — ${url}`}
      author="Zempar"
      subject="Generative Engine Optimization Report"
      creator="Zempar GEO Analysis"
    >
      <CoverPage url={url} company={company} composite={composite} date={date} />
      <AgentSection agent={agents.visibility} />
      <AgentSection agent={agents.content} />
      <AgentSection agent={agents.technical} />
      <AgentSection agent={agents.platform} />
      <AgentSection agent={agents.schema} />
      <ActionPlan agents={agents} />
    </Document>
  );
}
