import React, { Fragment } from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, COLORS, gradeColor } from "../styles";
import type { AgentResults, CompositeScore } from "../../geo/types";
import { scoreToGrade } from "../../geo/grade";
import { extractScoreJustificationParagraphs } from "../../geo/extract-score-justification";

interface Props {
  composite: CompositeScore;
  agents: AgentResults;
}

const BRAND_NOTE =
  "Brand authority uses the same AI visibility assessment in this report version.";
const BRAND_SEE_ABOVE =
  "For the detailed signals behind this score, refer to AI Visibility & Citability above.";

/** Per-dimension cap keeps pages scannable and avoids React-PDF overlap from huge Text nodes. */
const PDF_JUSTIFICATION_MAX = 400;

function RationaleBody({ paragraphs }: { paragraphs: string[] }) {
  return (
    <View style={{ paddingRight: 4 }}>
      {paragraphs.map((p, i) => (
        <Text
          key={i}
          style={{
            fontSize: 9,
            color: COLORS.muted,
            lineHeight: 1.5,
            marginBottom: i < paragraphs.length - 1 ? 6 : 0,
          }}
          wrap
        >
          {p}
        </Text>
      ))}
    </View>
  );
}

function block(
  label: string,
  score: number,
  grade: string,
  paragraphs: string[],
): React.ReactNode {
  const g = gradeColor(scoreToGrade(score));
  return (
    <View
      style={{
        marginBottom: 12,
        padding: 10,
        backgroundColor: COLORS.card,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontWeight: "bold",
            color: COLORS.heading,
            flex: 1,
            paddingRight: 10,
          }}
          wrap
        >
          {label}
        </Text>
        <Text style={{ fontSize: 10, fontWeight: "bold", color: g }} wrap={false}>
          {score}/100 · {grade}
        </Text>
      </View>
      <RationaleBody paragraphs={paragraphs} />
    </View>
  );
}

export function DimensionJustifications({ composite, agents }: Props) {
  const visParagraphs = extractScoreJustificationParagraphs(
    agents.visibility?.rawMarkdown,
    PDF_JUSTIFICATION_MAX,
  );
  const brandParagraphs = [BRAND_NOTE, BRAND_SEE_ABOVE];

  const rows: { label: string; score: number; grade: string; paragraphs: string[] }[] = [
    {
      label: "AI Visibility & Citability",
      score: composite.breakdown.citability,
      grade: agents.visibility.grade,
      paragraphs: visParagraphs,
    },
    {
      label: "Brand Authority",
      score: composite.breakdown.brand,
      grade: agents.visibility.grade,
      paragraphs: brandParagraphs,
    },
    {
      label: "Content Quality (E-E-A-T)",
      score: composite.breakdown.eeat,
      grade: agents.content.grade,
      paragraphs: extractScoreJustificationParagraphs(agents.content?.rawMarkdown, PDF_JUSTIFICATION_MAX),
    },
    {
      label: "Technical GEO",
      score: composite.breakdown.technical,
      grade: agents.technical.grade,
      paragraphs: extractScoreJustificationParagraphs(agents.technical?.rawMarkdown, PDF_JUSTIFICATION_MAX),
    },
    {
      label: "RAG Readiness",
      score: composite.breakdown.rag ?? 0,
      grade: agents.rag.grade,
      paragraphs: extractScoreJustificationParagraphs(agents.rag?.rawMarkdown, PDF_JUSTIFICATION_MAX),
    },
    {
      label: "Schema & Structured Data",
      score: composite.breakdown.schema,
      grade: agents.schema.grade,
      paragraphs: extractScoreJustificationParagraphs(agents.schema?.rawMarkdown, PDF_JUSTIFICATION_MAX),
    },
    {
      label: "Platform Optimization",
      score: composite.breakdown.platform,
      grade: agents.platform.grade,
      paragraphs: extractScoreJustificationParagraphs(agents.platform?.rawMarkdown, PDF_JUSTIFICATION_MAX),
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
          <View key={r.label}>{block(r.label, r.score, r.grade, r.paragraphs)}</View>
        ))}
        {footer}
      </Page>
      <Page size="A4" style={styles.page}>
        {rest.map((r) => (
          <View key={r.label}>{block(r.label, r.score, r.grade, r.paragraphs)}</View>
        ))}
        {footer}
      </Page>
    </Fragment>
  );
}
