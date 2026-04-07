import React, { Fragment } from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, COLORS, gradeColor } from "../styles";
import type { AgentResults, CompositeScore } from "../../geo/types";
import { scoreToGrade } from "../../geo/grade";
import { extractScoreJustification } from "../../geo/extract-score-justification";

interface Props {
  composite: CompositeScore;
  agents: AgentResults;
}

const BRAND_NOTE =
  "Brand authority uses the same AI visibility assessment in this report version.";

function block(
  label: string,
  score: number,
  grade: string,
  rationale: string,
): React.ReactNode {
  const g = gradeColor(scoreToGrade(score));
  return (
    <View
      style={{
        marginBottom: 10,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <Text style={{ fontSize: 10, fontWeight: "bold", color: COLORS.heading, flex: 1, paddingRight: 8 }}>{label}</Text>
        <Text style={{ fontSize: 10, fontWeight: "bold", color: g }}>{score}/100 · {grade}</Text>
      </View>
      <Text style={{ fontSize: 8, color: COLORS.heading, lineHeight: 1.4 }}>{rationale}</Text>
    </View>
  );
}

export function DimensionJustifications({ composite, agents }: Props) {
  const visRationale = extractScoreJustification(agents.visibility?.rawMarkdown);
  const brandRationale = `${visRationale} ${BRAND_NOTE}`.trim();

  const rows: { label: string; score: number; grade: string; rationale: string }[] = [
    {
      label: "AI Visibility & Citability",
      score: composite.breakdown.citability,
      grade: agents.visibility.grade,
      rationale: visRationale,
    },
    {
      label: "Brand Authority",
      score: composite.breakdown.brand,
      grade: agents.visibility.grade,
      rationale: brandRationale,
    },
    {
      label: "Content Quality (E-E-A-T)",
      score: composite.breakdown.eeat,
      grade: agents.content.grade,
      rationale: extractScoreJustification(agents.content?.rawMarkdown),
    },
    {
      label: "Technical GEO",
      score: composite.breakdown.technical,
      grade: agents.technical.grade,
      rationale: extractScoreJustification(agents.technical?.rawMarkdown),
    },
    {
      label: "RAG Readiness",
      score: composite.breakdown.rag ?? 0,
      grade: agents.rag.grade,
      rationale: extractScoreJustification(agents.rag?.rawMarkdown),
    },
    {
      label: "Schema & Structured Data",
      score: composite.breakdown.schema,
      grade: agents.schema.grade,
      rationale: extractScoreJustification(agents.schema?.rawMarkdown),
    },
    {
      label: "Platform Optimization",
      score: composite.breakdown.platform,
      grade: agents.platform.grade,
      rationale: extractScoreJustification(agents.platform?.rawMarkdown),
    },
  ];

  const footer = (
    <View
      style={{
        position: "absolute",
        bottom: 32,
        left: 48,
        right: 48,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontSize: 9, color: COLORS.dim }}>Prepared by Zempar · zempar.com</Text>
      <Text style={{ fontSize: 9, color: COLORS.dim }}>Why these scores</Text>
    </View>
  );

  const first = rows.slice(0, 4);
  const rest = rows.slice(4);

  return (
    <Fragment>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading1}>Why these scores</Text>
        <Text style={{ fontSize: 9, color: COLORS.dim, marginBottom: 14, lineHeight: 1.35 }}>
          Short rationale for each dimension, derived from the same AI analysis used to compute your scores. Full
          technical detail is available in a briefing.
        </Text>
        {first.map((r) => (
          <View key={r.label}>{block(r.label, r.score, r.grade, r.rationale)}</View>
        ))}
        {footer}
      </Page>
      <Page size="A4" style={styles.page}>
        {rest.map((r) => (
          <View key={r.label}>{block(r.label, r.score, r.grade, r.rationale)}</View>
        ))}
        {footer}
      </Page>
    </Fragment>
  );
}
