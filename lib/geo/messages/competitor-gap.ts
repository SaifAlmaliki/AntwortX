import type { WebsiteData } from "../types";
import type { CompetitorInfo } from "../competitor-discovery";

export interface CompetitorGapMessageInput {
  websiteData: WebsiteData;
  competitors: CompetitorInfo[];
}

export function buildCompetitorGapMessage(input: CompetitorGapMessageInput): string {
  const { websiteData, competitors } = input;

  const competitorRows = competitors
    .map((c, i) => `${i + 1}. ${c.name} (${c.domain}) — ${c.description} [Source: ${c.sourceEngine}, Confidence: ${c.confidence}]`)
    .join("\n");

  const headingSummary = websiteData.headingStructure
    .slice(0, 20)
    .map((h) => `${"  ".repeat(h.level - 1)}H${h.level}: ${h.text}`)
    .join("\n");

  const schemaSummary = JSON.stringify(websiteData.structuredData, null, 2).slice(0, 3000);

  return `Please analyze the following website data and its top competitors to produce a full Competitive Knowledge Gap Analysis report section as described in your instructions.

## Target URL
${websiteData.url}

## Target Site Summary
- Title: ${websiteData.title}
- Meta description: ${websiteData.metaDescription}
- Word count: ${websiteData.wordCount}
- Content blocks: ${websiteData.contentBlocks.length}
- Has SSR content: ${websiteData.hasSSRContent}
- External links: ${websiteData.externalLinks.length}
- Internal links: ${websiteData.internalLinks.length}

## Target Site Heading Structure
${headingSummary || "No headings detected."}

## Target Site Structured Data
${schemaSummary || "No structured data detected."}

## Competitors to Compare Against
${competitorRows || "No competitors discovered."}

Analyze the target site against each competitor across schema completeness, sameAs coverage, content depth, topical coverage, brand authority, and citability. Identify specific gaps and provide a prioritized remediation plan.`;
}
