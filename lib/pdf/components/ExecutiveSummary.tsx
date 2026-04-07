import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, COLORS, gradeColor } from "../styles";
import type { CompositeScore, AgentResults } from "../../geo/types";
import { extractTopPains } from "../../geo/extract-actions";

interface Props {
  url: string;
  composite: CompositeScore;
  agents: AgentResults;
  llmMentionedCount?: number;
  llmTotalEngines?: number;
}

const AGENT_LABELS: Record<string, string> = {
  visibility: "AI Visibility",
  content: "Content Quality",
  technical: "Technical GEO",
  rag: "RAG Readiness",
  schema: "Schema",
  platform: "Platform",
};

export function ExecutiveSummary({ url, composite, agents, llmMentionedCount, llmTotalEngines }: Props) {
  let domain = url;
  try { domain = new URL(url).hostname; } catch { /* use raw */ }

  const color = gradeColor(composite.grade);
  const pains = extractTopPains(agents, 5, AGENT_LABELS);

  const isCritical = composite.overall < 40;
  const isPoor = composite.overall >= 40 && composite.overall < 60;

  return (
    <Page size="A4" style={styles.page}>
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.accent }}>
          Zempar
        </Text>
      </View>

      <View style={{ alignItems: "center", marginBottom: 28 }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: color,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 34, fontWeight: "bold", color: "#000" }}>
            {composite.overall}
          </Text>
        </View>
        <Text style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
          GEO Visibility Score
        </Text>
        <Text style={{ fontSize: 18, fontWeight: "bold", color }}>
          {composite.grade}
        </Text>
      </View>

      <View style={styles.divider} />

      <Text style={[styles.heading2, { marginTop: 16 }]}>
        What We Found
      </Text>

      {isCritical && (
        <View style={{ backgroundColor: "#fef2f2", borderRadius: 6, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: "#fecaca" }}>
          <Text style={{ fontSize: 11, fontWeight: "bold", color: "#dc2626", marginBottom: 4 }}>
            Critical: Your site is largely invisible to AI search engines.
          </Text>
          <Text style={{ fontSize: 10, color: "#991b1b", lineHeight: 1.5 }}>
            AI crawlers like GPTBot and ClaudeBot cannot access or understand your content.
            When customers ask AI assistants about {domain ? domain : "your industry"}, your business does not appear.
          </Text>
        </View>
      )}

      {isPoor && (
        <View style={{ backgroundColor: "#fffbeb", borderRadius: 6, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: "#fde68a" }}>
          <Text style={{ fontSize: 11, fontWeight: "bold", color: "#d97706", marginBottom: 4 }}>
            Significant gaps in AI visibility.
          </Text>
          <Text style={{ fontSize: 10, color: "#92400e", lineHeight: 1.5 }}>
            Your site has some presence in AI search, but critical gaps prevent consistent citations
            and recommendations across major AI platforms.
          </Text>
        </View>
      )}

      <View style={{ gap: 8, marginBottom: 24 }}>
        {pains.map((pain, i) => (
          <View key={i} style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
            <Text style={{ fontSize: 10, color: COLORS.accent, marginTop: 1, flexShrink: 0 }}>
              {i + 1}.
            </Text>
            <Text style={[styles.body, { flex: 1, marginBottom: 0 }]}>{pain}</Text>
          </View>
        ))}
        {pains.length === 0 && (
          <Text style={[styles.body, { color: COLORS.dim }]}>
            Detailed findings are available in the full technical report.
          </Text>
        )}
      </View>

      <View style={styles.divider} />

      <Text style={[styles.heading2, { marginTop: 16 }]}>
        What You&apos;re Missing
      </Text>

      <View style={{ backgroundColor: COLORS.surface, borderRadius: 8, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border }}>
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 9, color: COLORS.dim, marginBottom: 4 }}>AI Engines Tested</Text>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: COLORS.heading }}>
              {llmTotalEngines || 4}
            </Text>
            <Text style={{ fontSize: 8, color: COLORS.dim }}>ChatGPT · Perplexity · Gemini · Claude</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 9, color: COLORS.dim, marginBottom: 4 }}>Engines That Mention You</Text>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: (llmMentionedCount || 0) > 0 ? COLORS.success : COLORS.error }}>
              {llmMentionedCount || 0}/{llmTotalEngines || 4}
            </Text>
            <Text style={{ fontSize: 8, color: COLORS.dim }}>
              {(llmMentionedCount || 0) === 0 ? "Zero brand mentions across all AI engines" : "Partial visibility — room to grow"}
            </Text>
          </View>
        </View>

        {(llmMentionedCount || 0) === 0 && (
          <View style={{ borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10 }}>
            <Text style={{ fontSize: 10, color: COLORS.heading, fontWeight: "bold", marginBottom: 4 }}>
              The Opportunity Cost
            </Text>
            <Text style={{ fontSize: 9, color: COLORS.muted, lineHeight: 1.5 }}>
              Every day your brand is absent from AI responses, potential customers are being directed to
              competitors. AI-powered search now handles a growing share of B2B research — being invisible
              means losing qualified leads before they ever reach your website.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <Text style={[styles.heading2, { marginTop: 16 }]}>
        What&apos;s Next
      </Text>

      <View
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 8,
          padding: 16,
          borderWidth: 1,
          borderColor: COLORS.accent,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: "bold", color: COLORS.accent, marginBottom: 8 }}>
          Book a 15-Minute GEO Briefing
        </Text>
        <Text style={[styles.body, { marginBottom: 12, maxWidth: 420 }]}>
          We&apos;ve prepared a full technical roadmap with specific, prioritized actions to fix
          every gap identified in this report. Let&apos;s walk through it together.
        </Text>
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Text style={{ fontSize: 10, color: COLORS.accent }}>•</Text>
            <Text style={[styles.body, { marginBottom: 0 }]}>Full technical remediation plan</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Text style={{ fontSize: 10, color: COLORS.accent }}>•</Text>
            <Text style={[styles.body, { marginBottom: 0 }]}>Competitor gap analysis</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Text style={{ fontSize: 10, color: COLORS.accent }}>•</Text>
            <Text style={[styles.body, { marginBottom: 0 }]}>Custom implementation timeline</Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 24 }}>
        <View>
          <Text style={[styles.label, { marginBottom: 4 }]}>Email</Text>
          <Text style={{ fontSize: 11, color: COLORS.accent }}>contact@zempar.com</Text>
        </View>
        <View>
          <Text style={[styles.label, { marginBottom: 4 }]}>Website</Text>
          <Text style={{ fontSize: 11, color: COLORS.accent }}>zempar.com/contact</Text>
        </View>
      </View>

      <View style={{ position: "absolute", bottom: 32, left: 48, right: 48, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 9, color: COLORS.dim }}>Prepared by Zempar · zempar.com</Text>
        <Text style={{ fontSize: 9, color: COLORS.dim }}>Executive Summary</Text>
      </View>
    </Page>
  );
}
