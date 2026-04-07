import type { WebsiteData } from "../types";

export function buildRAGReadinessMessage(data: WebsiteData): string {
  const contentBlocks = data.contentBlocks
    .slice(0, 15)
    .map((b) => `### ${b.heading ?? "(no heading)"}\nWord count: ${b.wordCount}\n${b.content.slice(0, 600)}`)
    .join("\n\n");

  const headingSummary = data.headingStructure
    .slice(0, 25)
    .map((h) => `H${h.level}: ${h.text}`)
    .join("\n");

  return `Please analyze the following website data and produce a full RAG (Retrieval-Augmented Generation) Readiness Analysis report section as described in your instructions.

## Target URL
${data.url}

## Page Summary
- Title: ${data.title}
- Word count: ${data.wordCount}
- H1 tags: ${data.h1Tags.join(", ") || "none"}
- Has SSR content: ${data.hasSSRContent}

## Heading Structure
${headingSummary || "No headings detected."}

## Content Blocks (for chunkability analysis)
${contentBlocks || "No content blocks extracted."}

## Full Text Content (first 10000 chars)
${data.textContent.slice(0, 10000)}

## Images
- Total: ${data.images.length}
- With alt text: ${data.images.filter((i) => i.alt).length}

## Internal Links (${data.internalLinks.length})
${data.internalLinks.slice(0, 15).join("\n") || "None detected."}

Analyze this data for RAG readiness: chunkability, context window quality, data density, and structural signals. Provide specific scores and prioritized remediation actions.`;
}
