import React, { Fragment } from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, COLORS, gradeColor } from "../styles";
import type { LLMPresenceSummary } from "../../geo/llm-presence";

interface LLMVisibilitySectionProps {
  llmResults: LLMPresenceSummary[];
  brandName: string;
  /** Primary testing theme (usually extracted category). */
  category: string;
  userCategory: string;
  extractedCategory: string | null;
  extractedServices: string[];
  targetAudience?: string | null;
  wordCount?: number;
  reportDate: string;
  targetUrl: string;
  sharedPrompts: string[];
  visibilityScore: number;
  visibilityGrade: string;
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

function domainFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function LLMVisibilitySection({
  llmResults,
  brandName,
  category,
  userCategory,
  extractedCategory,
  extractedServices,
  targetAudience,
  wordCount,
  reportDate,
  targetUrl,
  sharedPrompts,
  visibilityScore,
  visibilityGrade,
}: LLMVisibilitySectionProps) {
  const mentionedCount = llmResults.filter((r) => r.mentioned).length;
  const citedCount = llmResults.filter((r) => r.cited).length;

  const avgMentionRate =
    llmResults.length > 0
      ? llmResults.reduce((sum, r) => sum + r.mentionRate, 0) / llmResults.length
      : 0;

  const color = gradeColor(visibilityGrade);
  const domain = domainFromUrl(targetUrl);
  const categoriesDiffer =
    extractedCategory &&
    extractedCategory.trim().toLowerCase() !== userCategory.trim().toLowerCase();

  const footer = (
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
  );

  const servicesLine =
    extractedServices.length > 0
      ? extractedServices.slice(0, 5).join(" · ")
      : "—";

  return (
    <Fragment>
      <Page size="A4" style={styles.page}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14, gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heading1}>LLM Visibility</Text>
            <Text style={{ fontSize: 9, color: COLORS.dim, marginTop: 3 }}>
              Brand &quot;{brandName}&quot; · Test theme: &quot;{category}&quot;
              {categoriesDiffer ? ` · Your category: &quot;${userCategory}&quot;` : ""}
            </Text>
          </View>
          <View style={{ backgroundColor: color, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#000" }}>{visibilityScore}/100</Text>
          </View>
          <View style={{ borderRadius: 6, borderWidth: 1, borderColor: color, paddingHorizontal: 8, paddingVertical: 5 }}>
            <Text style={{ fontSize: 10, color, fontWeight: "bold" }}>{visibilityGrade}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={[styles.heading2, { marginBottom: 6 }]}>How we tested</Text>
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 6,
            padding: 10,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: COLORS.border,
            gap: 4,
          }}
        >
          <Text style={{ fontSize: 8, color: COLORS.heading }}>
            • URL: {domain} · Report date: {reportDate}
          </Text>
          {typeof wordCount === "number" ? (
            <Text style={{ fontSize: 8, color: COLORS.heading }}>
              • Page text analyzed: ~{wordCount.toLocaleString()} words (homepage/main fetch)
            </Text>
          ) : null}
          <Text style={{ fontSize: 8, color: COLORS.heading }}>
            • Your industry (form): {userCategory}
          </Text>
          {extractedCategory ? (
            <Text style={{ fontSize: 8, color: COLORS.heading }}>
              • Inferred from site: {extractedCategory}
            </Text>
          ) : null}
          <Text style={{ fontSize: 8, color: COLORS.heading }}>• Services used in prompts: {servicesLine}</Text>
          {targetAudience ? (
            <Text style={{ fontSize: 8, color: COLORS.heading }}>• Audience (from site): {targetAudience}</Text>
          ) : null}
          <Text style={{ fontSize: 8, color: COLORS.heading }}>
            • {llmResults.length} AI engines × {sharedPrompts.length} customer-style prompts each (
            {llmResults.length * sharedPrompts.length} total probes)
          </Text>
        </View>

        <Text style={[styles.heading2, { marginBottom: 6 }]}>Customer-style prompts (same on every engine)</Text>
        <Text style={{ fontSize: 8, color: COLORS.dim, marginBottom: 8 }}>
          These mirror how buyers ask for vendors in your space — not generic boilerplate.
        </Text>
        <View style={{ gap: 5, marginBottom: 14 }}>
          {sharedPrompts.map((prompt, i) => (
            <View
              key={`prompt-${i}`}
              style={{
                backgroundColor: COLORS.card,
                borderRadius: 4,
                padding: 6,
                borderLeftWidth: 3,
                borderLeftColor: COLORS.accent,
              }}
            >
              <Text style={{ fontSize: 8, color: COLORS.dim, marginBottom: 2 }}>{i + 1}.</Text>
              <Text style={{ fontSize: 9, color: COLORS.heading }}>{prompt}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginBottom: 8 }}>
          <View style={{ flex: 1, backgroundColor: COLORS.card, borderRadius: 6, padding: 10 }}>
            <Text style={{ fontSize: 8, color: COLORS.dim, marginBottom: 2 }}>Engines w/ mention</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: mentionedCount > 0 ? COLORS.success : COLORS.error }}>
              {mentionedCount}/{llmResults.length}
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: COLORS.card, borderRadius: 6, padding: 10 }}>
            <Text style={{ fontSize: 8, color: COLORS.dim, marginBottom: 2 }}>Engines w/ citation</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: citedCount > 0 ? COLORS.success : COLORS.error }}>
              {citedCount}/{llmResults.length}
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: COLORS.card, borderRadius: 6, padding: 10 }}>
            <Text style={{ fontSize: 8, color: COLORS.dim, marginBottom: 2 }}>Avg mention rate</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.accent }}>{avgMentionRate.toFixed(0)}%</Text>
          </View>
        </View>

        <Text style={{ fontSize: 8, color: COLORS.dim }}>
          Per-engine results and excerpts when your brand appears continue on the next page.
        </Text>

        {footer}
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={[styles.heading2, { marginBottom: 10 }]}>Results by engine</Text>

        {llmResults.map((result) => {
          const engineLabel = ENGINE_LABELS[result.engine] || result.engine;
          const engineColor = ENGINE_COLORS[result.engine] || COLORS.accent;

          return (
            <View key={result.engine} style={{ marginBottom: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: COLORS.card,
                  borderRadius: 8,
                  padding: 10,
                  gap: 10,
                }}
              >
                <View style={{ width: 6, height: 36, backgroundColor: engineColor, borderRadius: 3 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, fontWeight: "bold", color: COLORS.heading }}>{engineLabel}</Text>
                  <Text style={{ fontSize: 8, color: COLORS.dim }}>
                    {result.mentionCount}/{result.totalPrompts} prompts mentioned ·{" "}
                    {result.mentioned ? "Brand surfaced" : "No brand match"}
                    {result.cited ? " · Cited with source" : ""}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 8, color: COLORS.dim }}>
                    Mentioned:{" "}
                    <Text style={{ fontWeight: "bold", color: result.mentioned ? COLORS.success : COLORS.error }}>
                      {result.mentioned ? "Yes" : "No"}
                    </Text>
                  </Text>
                  <Text style={{ fontSize: 8, color: COLORS.dim }}>
                    Cited:{" "}
                    <Text style={{ fontWeight: "bold", color: result.cited ? COLORS.success : COLORS.dim }}>
                      {result.cited ? "Yes" : "No"}
                    </Text>
                  </Text>
                </View>
              </View>

              {result.results.map((r, i) => (
                <View
                  key={`${result.engine}-row-${i}`}
                  style={{
                    marginLeft: 14,
                    marginTop: 3,
                    padding: 6,
                    backgroundColor: COLORS.background,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ fontSize: 7, color: COLORS.dim, marginBottom: 2 }}>
                    {i + 1}. {r.mentioned ? "Hit" : "—"} · {r.cited ? "Cited" : "Not cited"} · {r.prompt}
                  </Text>
                  {r.mentioned && r.context ? (
                    <Text style={{ fontSize: 7, color: COLORS.heading }}>…{r.context}…</Text>
                  ) : null}
                  {r.error ? (
                    <Text style={{ fontSize: 7, color: COLORS.error }}>Error: {r.error}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          );
        })}

        <View style={styles.divider} />

        <Text style={styles.heading2}>Recommendations</Text>
        <View style={{ gap: 5, marginTop: 6 }}>
          {mentionedCount === 0 && (
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={{ fontSize: 9, color: COLORS.accent }}>•</Text>
              <Text style={{ fontSize: 9, color: COLORS.heading, flex: 1 }}>
                No engine mentioned your brand on these buyer prompts. Prioritize authoritative listings, citable
                pages, and clear entity signals so models can associate your name with your category.
              </Text>
            </View>
          )}
          {mentionedCount > 0 && mentionedCount < llmResults.length && (
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={{ fontSize: 9, color: COLORS.accent }}>•</Text>
              <Text style={{ fontSize: 9, color: COLORS.heading, flex: 1 }}>
                Partial coverage across engines — extend the same proof points everywhere models look (site, schema,
                third-party sources).
              </Text>
            </View>
          )}
          {citedCount === 0 && mentionedCount > 0 && (
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={{ fontSize: 9, color: COLORS.accent }}>•</Text>
              <Text style={{ fontSize: 9, color: COLORS.heading, flex: 1 }}>
                Mentions without URLs: add Schema.org, quotable blocks, and pages worth linking.
              </Text>
            </View>
          )}
          {citedCount > 0 && (
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={{ fontSize: 9, color: COLORS.accent }}>•</Text>
              <Text style={{ fontSize: 9, color: COLORS.heading, flex: 1 }}>
                You are being cited — keep publishing defensible, specific content to defend that position.
              </Text>
            </View>
          )}
        </View>

        {footer}
      </Page>
    </Fragment>
  );
}
