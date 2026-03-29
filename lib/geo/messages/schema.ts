import type { WebsiteData } from "../types";

/** Build the user message for the geo-schema agent. */
export function buildSchemaMessage(data: WebsiteData): string {
  return `Please analyze the following website data and produce a full Schema & Structured Data Analysis report section as described in your instructions.

## Target URL
${data.url}

## Server-Side Rendering
- Has SSR content: ${data.hasSSRContent}
Note: JSON-LD injected only via client-side JavaScript will be invisible to AI crawlers.

## Page Title
${data.title}

## Detected JSON-LD Structured Data (${data.structuredData.length} blocks found)
${JSON.stringify(data.structuredData, null, 2)}

Analyze this data and produce the full ## Schema & Structured Data Analysis report section, including:
1. Detection table of all schemas found
2. Validation results for each schema block
3. GEO-critical schema assessment (Organization, sameAs, Person, Article, speakable, WebSite/SearchAction)
4. Missing schema recommendations with ready-to-use JSON-LD templates
5. JavaScript injection risk assessment
6. Schema score (0-100) with breakdown
7. Prioritized action items`;
}
