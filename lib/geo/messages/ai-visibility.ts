import type { WebsiteData } from "../types";

/** Build the user message for the geo-ai-visibility agent. */
export function buildAIVisibilityMessage(data: WebsiteData): string {
  const topBlocks = data.contentBlocks
    .slice(0, 10)
    .map((b) => `### ${b.heading ?? "(no heading)"}\n${b.content.slice(0, 500)}`)
    .join("\n\n");

  const crawlerRows = Object.entries(data.robotsTxt.aiCrawlerStatus)
    .map(([name, status]) => `- ${name}: ${status}`)
    .join("\n");

  return `Please analyze the following website data and produce a full AI Visibility Analysis report section as described in your instructions.

## Target URL
${data.url}

## Page Summary
- Title: ${data.title}
- Word count: ${data.wordCount}
- H1 tags: ${data.h1Tags.join(", ") || "none"}
- Has SSR content: ${data.hasSSRContent}

## Content Blocks (top 10 for citability scoring)
${topBlocks || "No content blocks extracted."}

## Full Text Content (first 8000 chars)
${data.textContent.slice(0, 8000)}

## AI Crawler Status (from robots.txt)
robots.txt exists: ${data.robotsTxt.exists}
Has sitemap reference: ${data.robotsTxt.hasSitemap}
${crawlerRows}

## llms.txt Status
exists: ${data.llmsTxt.exists}
llms-full.txt exists: ${data.llmsTxt.fullExists}
${data.llmsTxt.exists ? `Content (first 500 chars):\n${data.llmsTxt.content.slice(0, 500)}` : ""}

## Structured Data (JSON-LD)
${JSON.stringify(data.structuredData, null, 2).slice(0, 2000)}

Analyze this data and produce the full ## AI Visibility Analysis report section with scores for Citability, Brand Mentions, Crawler Access, and llms.txt, plus the composite AI Visibility Score.`;
}
