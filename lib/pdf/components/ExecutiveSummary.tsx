import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, COLORS, gradeColor } from "../styles";
import type { CompositeScore, AgentResults } from "../../geo/types";
import { extractTopPains } from "../../geo/extract-actions";
import type { ScanSnapshotInput } from "@/lib/pdf/scan-snapshot";

interface Props {
  url: string;
  composite: CompositeScore;
  agents: AgentResults;
  llmMentionedCount?: number;
  llmTotalEngines?: number;
  scanSnapshot?: ScanSnapshotInput;
}

const AGENT_LABELS: Record<string, string> = {
  visibility: "AI Visibility",
  content: "Content Quality",
  technical: "Technical GEO",
  rag: "RAG Readiness",
  schema: "Schema",
  platform: "Platform",
};

function hostFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function ExecutiveSummary({
  url,
  composite,
  agents,
  llmMentionedCount,
  llmTotalEngines,
  scanSnapshot,
}: Props) {
  const domain = hostFromUrl(url);

  const color = gradeColor(composite.grade);
  const pains = extractTopPains(agents, 5, AGENT_LABELS);

  const isCritical = composite.overall < 40;
  const isPoor = composite.overall >= 40 && composite.overall < 60;

  const enginesTested = llmTotalEngines || 4;
  const mentioned = llmMentionedCount ?? 0;

  return (
    <Page size="A4" style={styles.page}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.accent }}>Zempar</Text>
      </View>

      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: color,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: "bold", color: "#000" }}>{composite.overall}</Text>
        </View>
        <Text
          style={{
            fontSize: 9,
            color: COLORS.muted,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          GEO Visibility Score
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold", color }}>{composite.grade}</Text>
      </View>

      <View style={styles.divider} />

      {scanSnapshot ? (
        <>
          <Text style={[styles.heading2, { marginTop: 12, marginBottom: 8 }]}>Audit scope</Text>
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 8,
              padding: 12,
              marginBottom: 14,
              borderWidth: 1,
              borderColor: COLORS.border,
              gap: 5,
            }}
          >
            <Text style={{ fontSize: 8, color: COLORS.heading }}>
              • Target: {hostFromUrl(scanSnapshot.url)} · {scanSnapshot.date}
            </Text>
            {typeof scanSnapshot.wordCount === "number" ? (
              <Text style={{ fontSize: 8, color: COLORS.heading }}>
                • Crawled text: ~{scanSnapshot.wordCount.toLocaleString()} words
              </Text>
            ) : null}
            <Text style={{ fontSize: 8, color: COLORS.heading }}>
              • GEO dimensions scored: 7 (AI visibility, brand, content E-E-A-T, technical, RAG, schema, platform —
              weighted to overall)
            </Text>
            <Text style={{ fontSize: 8, color: COLORS.heading }}>
              • LLM probe: {scanSnapshot.llmEngineCount} engines × {scanSnapshot.llmPromptsPerEngine} buyer-style
              prompts ({scanSnapshot.llmEngineCount * scanSnapshot.llmPromptsPerEngine} checks)
            </Text>
            <Text style={{ fontSize: 8, color: COLORS.heading }}>
              • Your category: {scanSnapshot.userCategory}
            </Text>
            {scanSnapshot.extractedCategory ? (
              <Text style={{ fontSize: 8, color: COLORS.heading }}>
                • Inferred from site: {scanSnapshot.extractedCategory}
              </Text>
            ) : null}
            {scanSnapshot.extractedServices && scanSnapshot.extractedServices.length > 0 ? (
              <Text style={{ fontSize: 8, color: COLORS.heading }}>
                • Services used in prompts: {scanSnapshot.extractedServices.slice(0, 6).join(" · ")}
              </Text>
            ) : null}
            {scanSnapshot.targetAudience ? (
              <Text style={{ fontSize: 8, color: COLORS.heading }}>
                • Audience signal: {scanSnapshot.targetAudience}
              </Text>
            ) : null}
          </View>
        </>
      ) : null}

      <Text style={[styles.heading2, { marginTop: scanSnapshot ? 0 : 12 }]}>What we found</Text>

      {isCritical && (
        <View
          style={{
            backgroundColor: "#fef2f2",
            borderRadius: 6,
            padding: 10,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: "#fecaca",
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: "bold", color: "#dc2626", marginBottom: 3 }}>
            Critical: very low AI search visibility
          </Text>
          <Text style={{ fontSize: 9, color: "#991b1b", lineHeight: 1.45 }}>
            Crawlers and models are unlikely to surface {domain} for relevant buyer questions — you are effectively
            absent from AI-assisted discovery.
          </Text>
        </View>
      )}

      {isPoor && (
        <View
          style={{
            backgroundColor: "#fffbeb",
            borderRadius: 6,
            padding: 10,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: "#fde68a",
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: "bold", color: "#d97706", marginBottom: 3 }}>
            Significant gaps vs. competitors
          </Text>
          <Text style={{ fontSize: 9, color: "#92400e", lineHeight: 1.45 }}>
            Some signals exist, but citations and recommendations will be inconsistent across AI platforms until gaps
            below are closed.
          </Text>
        </View>
      )}

      <View style={{ gap: 6, marginBottom: 14 }}>
        {pains.map((pain, i) => (
          <View key={i} style={{ flexDirection: "row", gap: 6, alignItems: "flex-start" }}>
            <Text style={{ fontSize: 9, color: COLORS.accent, marginTop: 1, flexShrink: 0 }}>{i + 1}.</Text>
            <Text style={{ fontSize: 9, color: COLORS.heading, flex: 1, lineHeight: 1.35 }}>{pain}</Text>
          </View>
        ))}
        {pains.length === 0 && (
          <Text style={{ fontSize: 9, color: COLORS.dim }}>See dimension scores on the cover for full detail.</Text>
        )}
      </View>

      <View style={styles.divider} />

      <Text style={[styles.heading2, { marginTop: 12 }]}>LLM snapshot</Text>

      <View
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <View style={{ flexDirection: "row", gap: 14, marginBottom: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 8, color: COLORS.dim, marginBottom: 2 }}>Engines tested</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.heading }}>{enginesTested}</Text>
            <Text style={{ fontSize: 7, color: COLORS.dim }}>ChatGPT · Perplexity · Gemini · Claude</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 8, color: COLORS.dim, marginBottom: 2 }}>Engines mentioning you</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: mentioned > 0 ? COLORS.success : COLORS.error,
              }}
            >
              {mentioned}/{enginesTested}
            </Text>
            <Text style={{ fontSize: 7, color: COLORS.dim }}>
              {mentioned === 0 ? "No mentions on sampled buyer prompts" : "Partial visibility"}
            </Text>
          </View>
        </View>
        {mentioned === 0 ? (
          <Text style={{ fontSize: 8, color: COLORS.muted, lineHeight: 1.4 }}>
            Impact: buyers asking AI for vendors in your category get competitors, not you — until entity and content
            signals improve.
          </Text>
        ) : null}
      </View>

      <Text style={{ fontSize: 9, color: COLORS.heading, marginBottom: 6 }}>
        Next step: book a 15-minute GEO briefing — full roadmap, competitor lens, and priorities (details on the last
        page): <Text style={{ color: COLORS.accent }}>zempar.com/contact</Text>
      </Text>

      <View style={{ position: "absolute", bottom: 32, left: 48, right: 48, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 9, color: COLORS.dim }}>Prepared by Zempar · zempar.com</Text>
        <Text style={{ fontSize: 9, color: COLORS.dim }}>Executive summary</Text>
      </View>
    </Page>
  );
}
