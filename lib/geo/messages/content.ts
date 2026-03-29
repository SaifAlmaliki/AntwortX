import type { WebsiteData } from "../types";

/** Build the user message for the geo-content agent. */
export function buildContentMessage(data: WebsiteData): string {
  const headings = data.headingStructure
    .slice(0, 30)
    .map((h) => `${"#".repeat(h.level)} ${h.text}`)
    .join("\n");

  const authorSchema = data.structuredData
    .filter((s: unknown) => {
      const obj = s as Record<string, unknown>;
      return obj?.["@type"] === "Person" || obj?.["@type"] === "Article";
    })
    .slice(0, 2);

  return `Please analyze the following website data and produce a full Content Quality Analysis report section as described in your instructions.

## Target URL
${data.url}

## Page Metadata
- Title: ${data.title}
- Meta description: ${data.metaDescription}
- Canonical: ${data.canonical ?? "not set"}
- Word count: ${data.wordCount}
- Images: ${data.images.length} total, ${data.images.filter((i) => i.alt).length} with alt text
- Internal links: ${data.internalLinks.length}
- External links: ${data.externalLinks.length}

## Heading Structure
${headings || "No headings found."}

## Full Text Content (first 10000 chars)
${data.textContent.slice(0, 10000)}

## Author / Article Schema (if any)
${JSON.stringify(authorSchema, null, 2)}

## Security & Trust Signals
- HTTPS: ${data.url.startsWith("https")}
- HSTS header: ${data.securityHeaders.hsts ?? "absent"}

## Sample External Links (first 10)
${data.externalLinks.slice(0, 10).join("\n") || "none"}

Analyze this data and produce the full ## Content Quality Analysis report section with E-E-A-T scores, content metrics, AI content assessment, topical authority, and freshness analysis.`;
}
