import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { markdownLinesToPdfBlocks, stripInlineMarkdownForPdf } from "../markdown-pdf-blocks";
import { MarkdownTable } from "./MarkdownTable";
import { styles, COLORS, gradeColor } from "../styles";
import type { AgentResult } from "../../geo/types";

const AGENT_TITLES: Record<string, string> = {
  "geo-ai-visibility": "AI Visibility & Citability",
  "geo-content": "Content Quality (E-E-A-T)",
  "geo-technical": "Technical GEO",
  "geo-platform-analysis": "Platform Optimization",
  "geo-schema": "Schema & Structured Data",
};

interface Props {
  agent: AgentResult;
}

function renderMarkdownLine(line: string, key: string | number): React.ReactNode {
  const trimmed = line.trim();
  if (/^-{3,}$/.test(trimmed)) {
    return <View key={key} style={{ borderBottomWidth: 1, borderBottomColor: COLORS.border, marginVertical: 6 }} />;
  }

  const isH2 = line.startsWith("## ");
  const isH3 = line.startsWith("### ");
  const isH4 = line.startsWith("#### ");
  const isBullet = line.startsWith("- ") || line.startsWith("* ");
  const isQuote = line.startsWith("> ");
  const isStrong = line.startsWith("**") && line.endsWith("**");

  let text = line
    .replace(/^#{1,4}\s+/, "")
    .replace(/^>\s?/, "");
  text = stripInlineMarkdownForPdf(text);

  if (!text || /^markdown$/i.test(text)) return null;

  if (isH2) {
    return (
      <Text key={key} style={[styles.heading2, { marginTop: 12 }]}>
        {text}
      </Text>
    );
  }
  if (isH3) {
    return (
      <Text key={key} style={{ fontSize: 11, fontWeight: "bold", color: COLORS.white, marginTop: 8, marginBottom: 4 }}>
        {text}
      </Text>
    );
  }
  if (isH4) {
    return (
      <Text key={key} style={{ fontSize: 10, fontWeight: "bold", color: COLORS.white, marginTop: 6, marginBottom: 3 }}>
        {text}
      </Text>
    );
  }
  if (isBullet) {
    return (
      <View key={key} style={{ flexDirection: "row", gap: 6 }}>
        <Text style={{ fontSize: 10, color: COLORS.accent, marginTop: 1 }}>•</Text>
        <Text style={[styles.body, { flex: 1 }]}>{text.replace(/^[-*]\s+/, "")}</Text>
      </View>
    );
  }
  if (isQuote) {
    return (
      <Text key={key} style={[styles.body, { borderLeftWidth: 2, borderLeftColor: COLORS.border, paddingLeft: 8, fontStyle: "italic" }]}>
        {text}
      </Text>
    );
  }
  if (isStrong) {
    return (
      <Text key={key} style={{ fontSize: 10, fontWeight: "bold", color: COLORS.white, marginBottom: 2 }}>
        {text}
      </Text>
    );
  }
  return (
    <Text key={key} style={styles.body}>
      {text}
    </Text>
  );
}

/** Reusable PDF section for any of the 5 GEO agents. */
export function AgentSection({ agent }: Props) {
  const title = AGENT_TITLES[agent.agentName] ?? agent.agentName;
  const color = gradeColor(agent.grade);

  const lines = agent.rawMarkdown
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l.trim().length > 0)
    .slice(0, 120);

  const blocks = markdownLinesToPdfBlocks(lines);

  return (
    <Page size="A4" style={styles.page}>
      {/* Section header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading1}>{title}</Text>
        </View>
        <View style={{ backgroundColor: color, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000" }}>{agent.score}/100</Text>
        </View>
        <View style={{ borderRadius: 6, borderWidth: 1, borderColor: color, paddingHorizontal: 10, paddingVertical: 6 }}>
          <Text style={{ fontSize: 11, color, fontWeight: "bold" }}>{agent.grade}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={{ gap: 3 }}>
        {blocks.map((block, i) => {
          if (block.type === "table") {
            return <MarkdownTable key={`t-${i}`} headers={block.headers} rows={block.rows} />;
          }
          return renderMarkdownLine(block.line, `l-${i}`);
        })}
      </View>

      {/* Page footer */}
      <View style={{ position: "absolute", bottom: 24, left: 48, right: 48, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 9, color: COLORS.dim }}>Zempar GEO Report</Text>
        <Text style={{ fontSize: 9, color: COLORS.dim }}>{title}</Text>
      </View>
    </Page>
  );
}
