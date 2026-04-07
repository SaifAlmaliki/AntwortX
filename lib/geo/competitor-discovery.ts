import { getEngine } from "@/lib/geo-engines";
import type { EngineResponse } from "@/lib/geo-engines/types";
import type { CompetitorInfo } from "./types";

export { CompetitorInfo };

export interface CompetitorDiscoveryResult {
  competitors: CompetitorInfo[];
  category: string;
  discoveredAt: string;
  enginesUsed: string[];
}

function buildDiscoveryPrompts(category: string, location: string | null): string[] {
  const loc = location ? ` in ${location}` : "";
  return [
    `What are the top 5 companies that provide ${category} services${loc}? List each company name and their website domain.`,
    `Which are the leading ${category} providers${loc} that appear most frequently in AI search results and industry reports? Include company names and domains.`,
    `Name the most well-known ${category} companies${loc}. For each, provide the company name and website URL.`,
  ];
}

function extractCompetitorsFromResponse(
  response: string,
  sourceEngine: string,
  excludeDomain: string
): CompetitorInfo[] {
  const results: CompetitorInfo[] = [];
  const lines = response.split("\n").filter((l) => l.trim().length > 0);

  for (const line of lines) {
    const urlMatch = line.match(/https?:\/\/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const domain = urlMatch ? urlMatch[1].toLowerCase() : null;

    if (!domain || domain === excludeDomain || domain.includes("localhost")) {
      continue;
    }

    const nameMatch = line.match(/^[\d\-\.\s\*]*(?:\*\*)?([^*:|]+?)(?:\*\*)?(?:\s*[-:|])/);
    const name = nameMatch
      ? nameMatch[1].trim().replace(/\*\*/g, "")
      : domain.split(".")[0].replace(/^www\./, "");

    const description = line.replace(/^[\d\-\.\s\*]+/, "").replace(/\*\*/g, "").trim();

    const confidence: CompetitorInfo["confidence"] =
      urlMatch && nameMatch ? "high" : urlMatch ? "medium" : "low";

    results.push({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      domain,
      description: description.slice(0, 200),
      sourceEngine,
      confidence,
    });
  }

  return results;
}

export async function discoverCompetitors(
  category: string,
  city: string | null,
  excludeDomain: string,
  maxCompetitors: number = 3
): Promise<CompetitorDiscoveryResult> {
  const engineNames = ["perplexity", "gemini"];
  const prompts = buildDiscoveryPrompts(category, city);
  const allCompetitors: CompetitorInfo[] = [];
  const enginesUsed: string[] = [];

  const engineQueries = engineNames.map(async (engineName) => {
    try {
      const engine = getEngine(engineName);
      const promptQueries = prompts.map(async (prompt) => {
        try {
          const response: EngineResponse = await engine.query(
            prompt,
            "competitor discovery",
            excludeDomain
          );
          if (response.response) {
            return extractCompetitorsFromResponse(
              response.response,
              engineName,
              excludeDomain
            );
          }
        } catch {
          // Skip failed prompts
        }
        return [];
      });
      const results = await Promise.all(promptQueries);
      results.flat().forEach((c) => allCompetitors.push(c));
      enginesUsed.push(engineName);
    } catch {
      // Engine unavailable, skip
    }
  });

  await Promise.all(engineQueries);

  const seen = new Set<string>();
  const unique = allCompetitors.filter((c) => {
    if (seen.has(c.domain)) return false;
    seen.add(c.domain);
    return true;
  });

  const sorted = unique.sort((a, b) => {
    const confidenceOrder = { high: 3, medium: 2, low: 1 };
    return confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
  });

  return {
    competitors: sorted.slice(0, maxCompetitors),
    category,
    discoveredAt: new Date().toISOString(),
    enginesUsed,
  };
}
