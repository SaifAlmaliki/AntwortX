import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, COLORS, gradeColor } from "../styles";
import type { LLMPresenceSummary } from "../../geo/llm-presence";

interface LLMVisibilitySectionProps {
  llmResults: LLMPresenceSummary[];
  brandName: string;
  category: string;
}

const ENGINE_LABELS: Record<string, string> = {
  openai: "ChatGPT",
  perplexity: "Perplexity",
  gemini: "Google Gemini",
  claude: "Claude",
};

const ENGINE_COLORS: Record<string, string> = {
  openai: "#10a37f",
  perplexity: "#20b45c",
  gemini: "#4285f4",
  claude: "#d97757",
};

export function LLMVisibilitySection({
  llmResults,
  brandName,
  category,
}: LLMVisibilitySectionProps) {
  const mentionedCount = llmResults.filter((r) => r.mentioned).length;
  const citedCount = llmResults.filter((r) => r.cited).length;
  
  const avgMentionRate =
    llmResults.reduce((sum, r) => sum + r.mentionRate, 0) / llmResults.length;

  const overallScore = Math.round(avgMentionRate);
  const grade =
    overallScore >= 80
      ? "Excellent"
      : overallScore >= 60
        ? "Good"
        : overallScore >= 40
          ? "Fair"
          : overallScore >= 20
            ? "Poor"
            : "Critical";

  const color = gradeColor(grade);

  return (
    <Page size="A4" style={styles.page}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading1}>LLM Visibility Score</Text>
          <Text style={{ fontSize: 10, color: COLORS.dim, marginTop: 4 }}>
            We tested whether AI assistants recommend &quot;{brandName}&quot; for &quot;{category}&quot;
          </Text>
        </View>
        <View style={{ backgroundColor: color, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000" }}>{overallScore}/100</Text>
        </View>
        <View style={{ borderRadius: 6, borderWidth: 1, borderColor: color, paddingHorizontal: 10, paddingVertical: 6 }}>
          <Text style={{ fontSize: 11, color, fontWeight: "bold" }}>{grade}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={{ gap: 3 }}>
        <Text style={styles.heading2}>
          Will AI recommend your business?
        </Text>
        <Text style={[styles.body, { marginBottom: 12 }]}>
          We asked multiple AI engines the same questions your customers ask. Here&apos;s what we found.
        </Text>

        <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
          <View style={{ flex: 1, backgroundColor: COLORS.card, borderRadius: 8, padding: 12 }}>
            <Text style={{ fontSize: 10, color: COLORS.dim, marginBottom: 4 }}>Engines Mentioned</Text>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: mentionedCount > 0 ? COLORS.success : COLORS.error }}>
              {mentionedCount}/{llmResults.length}
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: COLORS.card, borderRadius: 8, padding: 12 }}>
            <Text style={{ fontSize: 10, color: COLORS.dim, marginBottom: 4 }}>Engines Cited</Text>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: citedCount > 0 ? COLORS.success : COLORS.error }}>
              {citedCount}/{llmResults.length}
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: COLORS.card, borderRadius: 8, padding: 12 }}>
            <Text style={{ fontSize: 10, color: COLORS.dim, marginBottom: 4 }}>Avg Mention Rate</Text>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: COLORS.accent }}>
              {avgMentionRate.toFixed(0)}%
            </Text>
          </View>
        </View>

        <Text style={styles.heading2}>
          Results by Engine
        </Text>

        {llmResults.map((result) => {
          const engineLabel = ENGINE_LABELS[result.engine] || result.engine;
          const engineColor = ENGINE_COLORS[result.engine] || COLORS.accent;

          return (
            <View key={result.engine} style={{ marginBottom: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: COLORS.card,
                  borderRadius: 8,
                  padding: 12,
                  gap: 12,
                }}
              >
                <View style={{ width: 8, height: 40, backgroundColor: engineColor, borderRadius: 4 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: "bold", color: COLORS.white }}>
                    {engineLabel}
                  </Text>
                  <Text style={{ fontSize: 9, color: COLORS.dim }}>
                    {result.totalPrompts} prompts tested
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ fontSize: 8, color: COLORS.dim }}>Mentioned</Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "bold",
                          color: result.mentioned ? COLORS.success : COLORS.error,
                        }}
                      >
                        {result.mentioned ? "Yes" : "No"}
                      </Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ fontSize: 8, color: COLORS.dim }}>Cited</Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "bold",
                          color: result.cited ? COLORS.success : COLORS.dim,
                        }}
                      >
                        {result.cited ? "Yes" : "No"}
                      </Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ fontSize: 8, color: COLORS.dim }}>Sentiment</Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "bold",
                          color:
                            result.sentiment === "positive"
                              ? COLORS.success
                              : result.sentiment === "negative"
                                ? COLORS.error
                                : COLORS.dim,
                        }}
                      >
                        {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 9, color: COLORS.dim, marginTop: 4 }}>
                    {result.mentionCount}/{result.totalPrompts} prompts mentioned ({result.mentionRate.toFixed(0)}%)
                  </Text>
                </View>
              </View>

              {result.results.slice(0, 2).map((r, i) => (
                <View
                  key={`${result.engine}-prompt-${i}`}
                  style={{
                    marginLeft: 20,
                    marginTop: 4,
                    backgroundColor: COLORS.background,
                    borderRadius: 4,
                    padding: 8,
                  }}
                >
                  <Text style={{ fontSize: 8, color: COLORS.dim, marginBottom: 2 }}>
                    Prompt: {r.prompt}
                  </Text>
                  {r.mentioned && r.context && (
                    <Text style={{ fontSize: 8, color: COLORS.white }}>
                      ...{r.context}...
                    </Text>
                  )}
                </View>
              ))}
            </View>
          );
        })}

        <View style={styles.divider} />

        <Text style={styles.heading2}>Recommendations</Text>

        <View style={{ gap: 6 }}>
          {mentionedCount === 0 && (
            <View style={{ flexDirection: "row", gap: 6 }}>
              <Text style={{ fontSize: 10, color: COLORS.accent }}>•</Text>
              <Text style={styles.body}>
                No engines mentioned your brand. Focus on building authoritative content, getting listed in relevant directories, and improving your online presence.
              </Text>
            </View>
          )}
          {mentionedCount > 0 && mentionedCount < llmResults.length && (
            <View style={{ flexDirection: "row", gap: 6 }}>
              <Text style={{ fontSize: 10, color: COLORS.accent }}>•</Text>
              <Text style={styles.body}>
                Some engines mentioned you. Expand your presence across platforms that AI models rely on for training data.
              </Text>
            </View>
          )}
          {citedCount === 0 && mentionedCount > 0 && (
            <View style={{ flexDirection: "row", gap: 6 }}>
              <Text style={{ fontSize: 10, color: COLORS.accent }}>•</Text>
              <Text style={styles.body}>
                You were mentioned but not cited. Add structured data (Schema.org), create citable content, and improve your website&apos;s authority signals.
              </Text>
            </View>
          )}
          {citedCount > 0 && (
            <View style={{ flexDirection: "row", gap: 6 }}>
              <Text style={{ fontSize: 10, color: COLORS.accent }}>•</Text>
              <Text style={styles.body}>
                Great! You&apos;re being cited by AI engines. Maintain your content quality and continue building authority.
              </Text>
            </View>
          )}
          {avgMentionRate < 50 && mentionedCount > 0 && (
            <View style={{ flexDirection: "row", gap: 6 }}>
              <Text style={{ fontSize: 10, color: COLORS.accent }}>•</Text>
              <Text style={styles.body}>
                Your mention rate is below 50%. Consider optimizing for specific keywords and improving your brand&apos;s visibility on authoritative websites.
              </Text>
            </View>
          )}
        </View>
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 24,
          left: 48,
          right: 48,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 9, color: COLORS.dim }}>Zempar GEO Report</Text>
        <Text style={{ fontSize: 9, color: COLORS.dim }}>LLM Visibility</Text>
      </View>
    </Page>
  );
}