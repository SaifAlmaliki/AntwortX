import type { WebsiteData } from "../types";

/** Build the user message for the geo-platform-analysis agent. */
export function buildPlatformMessage(data: WebsiteData): string {
  const headings = data.headingStructure
    .slice(0, 30)
    .map((h) => `${"#".repeat(h.level)} ${h.text}`)
    .join("\n");

  const crawlerStatus = Object.entries(data.robotsTxt.aiCrawlerStatus)
    .map(([name, status]) => `- ${name}: ${status}`)
    .join("\n");

  const sampleExternal = data.externalLinks.slice(0, 15).join("\n") || "none";

  return `Please analyze the following website data and produce a full Platform Readiness Analysis report section as described in your instructions.

## Target URL
${data.url}

## Page Identity
- Title: ${data.title}
- Meta description: ${data.metaDescription}
- H1: ${data.h1Tags.join(", ") || "none"}
- Word count: ${data.wordCount}

## Heading Structure (for Google AIO question-pattern analysis)
${headings || "No headings found."}

## Structured Data (for entity recognition signals)
${JSON.stringify(data.structuredData, null, 2).slice(0, 3000)}

## Meta Tags (for platform-specific signals)
${JSON.stringify(data.metaTags, null, 2).slice(0, 1000)}

## AI Crawler Access (for ChatGPT, Perplexity, Bing signals)
${crawlerStatus}

## External Links (for authority source citations and ecosystem signals)
${sampleExternal}

## llms.txt
exists: ${data.llmsTxt.exists}
llms-full.txt: ${data.llmsTxt.fullExists}

## SSR & Technical Basics
- Has SSR content: ${data.hasSSRContent}
- HTTPS: ${data.url.startsWith("https")}
- Mobile viewport: ${data.metaTags["viewport"] ?? "not set"}

Analyze this data and produce the full ## Platform Readiness Analysis report section with scores for all 5 platforms (Google AIO, ChatGPT, Perplexity, Gemini, Bing Copilot), cross-platform synergies, and prioritized action items per platform.`;
}
