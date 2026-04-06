import { getEngine } from "@/lib/geo-engines";
import { generateGEOPrompts } from "./geo-prompts";
import type { EngineResponse } from "@/lib/geo-engines/types";

export interface LLMQueryResult {
  engine: string;
  prompt: string;
  mentioned: boolean;
  cited: boolean;
  sentiment: "positive" | "neutral" | "negative";
  context?: string;
  response: string;
  citationUrl?: string;
  mentions: number;
  error?: string;
}

export interface LLMPresenceSummary {
  engine: string;
  mentioned: boolean;
  cited: boolean;
  sentiment: "positive" | "neutral" | "negative";
  totalPrompts: number;
  mentionCount: number;
  mentionRate: number;
  results: LLMQueryResult[];
}

export interface TestLLMPresenceParams {
  brandName: string;
  category: string;
  city: string | null;
  websiteUrl: string;
  promptCount?: number;
  engines?: string[];
}

export async function testLLMPresence(
  params: TestLLMPresenceParams
): Promise<LLMPresenceSummary[]> {
  const {
    brandName,
    category,
    city,
    websiteUrl,
    promptCount = 5,
    engines = ["openai", "perplexity", "gemini", "claude"],
  } = params;

  const prompts = generateGEOPrompts(category, city, promptCount);
  const summaries: LLMPresenceSummary[] = [];

  for (const engineName of engines) {
    try {
      const engine = getEngine(engineName);
      const results: LLMQueryResult[] = [];

      for (const prompt of prompts) {
        try {
          const response: EngineResponse = await engine.query(
            prompt,
            brandName,
            websiteUrl
          );

          results.push({
            engine: engineName,
            prompt,
            mentioned: response.mentioned,
            cited: response.cited,
            sentiment: response.sentiment || "neutral",
            context: response.context,
            response: response.response,
            citationUrl: response.citationUrl,
            mentions: response.mentions,
          });
        } catch (err) {
          results.push({
            engine: engineName,
            prompt,
            mentioned: false,
            cited: false,
            sentiment: "neutral",
            response: "",
            mentions: 0,
            error: err instanceof Error ? err.message : "Query failed",
          });
        }
      }

      const mentionCount = results.filter((r) => r.mentioned).length;
      const citedCount = results.filter((r) => r.cited).length;
      const positiveCount = results.filter(
        (r) => r.sentiment === "positive" && r.mentioned
      ).length;
      const negativeCount = results.filter(
        (r) => r.sentiment === "negative" && r.mentioned
      ).length;

      let overallSentiment: "positive" | "neutral" | "negative" = "neutral";
      if (mentionCount > 0) {
        if (positiveCount > negativeCount) {
          overallSentiment = "positive";
        } else if (negativeCount > positiveCount) {
          overallSentiment = "negative";
        }
      }

      summaries.push({
        engine: engineName,
        mentioned: mentionCount > 0,
        cited: citedCount > 0,
        sentiment: overallSentiment,
        totalPrompts: prompts.length,
        mentionCount,
        mentionRate: prompts.length > 0 ? (mentionCount / prompts.length) * 100 : 0,
        results,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Engine unavailable";
      summaries.push({
        engine: engineName,
        mentioned: false,
        cited: false,
        sentiment: "neutral",
        totalPrompts: prompts.length,
        mentionCount: 0,
        mentionRate: 0,
        results: prompts.map((prompt: string) => ({
          engine: engineName,
          prompt,
          mentioned: false,
          cited: false,
          sentiment: "neutral" as const,
          response: "",
          mentions: 0,
          error: errorMessage,
        })),
      });
    }
  }

  return summaries;
}

export function computeLLMVisibilityScore(
  summaries: LLMPresenceSummary[]
): { score: number; grade: string } {
  if (summaries.length === 0) {
    return { score: 0, grade: "Critical" };
  }

  let totalScore = 0;
  const weights = {
    mentioned: 0.4,
    cited: 0.35,
    sentiment: 0.25,
  };

  for (const summary of summaries) {
    let engineScore = 0;

    if (summary.mentioned) {
      engineScore += weights.mentioned * 100;

      if (summary.mentioned && summary.cited) {
        engineScore += weights.cited * 100;
      } else {
        engineScore += weights.cited * 50;
      }

      if (summary.sentiment === "positive") {
        engineScore += weights.sentiment * 100;
      } else if (summary.sentiment === "neutral") {
        engineScore += weights.sentiment * 50;
      }
    }

    const mentionRateBonus = summary.mentionRate * 0.1;
    engineScore = Math.min(100, engineScore + mentionRateBonus);

    totalScore += engineScore;
  }

  const avgScore = totalScore / summaries.length;

  const grade =
    avgScore >= 80
      ? "Excellent"
      : avgScore >= 60
        ? "Good"
        : avgScore >= 40
          ? "Fair"
          : avgScore >= 20
            ? "Poor"
            : "Critical";

  return { score: Math.round(avgScore * 10) / 10, grade };
}

export function getLLMVisibilityRecommendations(
  summaries: LLMPresenceSummary[]
): string[] {
  const recommendations: string[] = [];

  const mentionedEngines = summaries.filter((s) => s.mentioned);
  const citedEngines = summaries.filter((s) => s.cited);

  if (mentionedEngines.length === 0) {
    recommendations.push(
      "No LLM engines mentioned your brand. Focus on building authoritative content and citations."
    );
  } else if (mentionedEngines.length < summaries.length) {
    const missingEngines = summaries
      .filter((s) => !s.mentioned)
      .map((s) => s.engine);
    recommendations.push(
      `Some engines mentioned you (${mentionedEngines.map((e) => e.engine).join(", ")}), but others did not (${missingEngines.join(", ")}). Focus on platform-specific optimization.`
    );
  }

  if (citedEngines.length === 0 && mentionedEngines.length > 0) {
    recommendations.push(
      "Your brand was mentioned but not cited with a source URL. Add structured data and improve content citability."
    );
  }

  const negativeSummaries = summaries.filter(
    (s) => s.sentiment === "negative" && s.mentioned
  );
  if (negativeSummaries.length > 0) {
    recommendations.push(
      "Some mentions had negative sentiment. Monitor brand reputation and address potential issues."
    );
  }

  const positiveSummaries = summaries.filter(
    (s) => s.sentiment === "positive" && s.mentioned
  );
  if (positiveSummaries.length === summaries.filter((s) => s.mentioned).length) {
    recommendations.push(
      "All mentions were positive. Maintain this momentum with consistent quality content."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Great visibility across LLM engines! Continue building authoritative content and citations."
    );
  }

  return recommendations;
}