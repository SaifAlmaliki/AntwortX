import type { WebsiteData } from "../types";

/** Build the user message for the geo-technical agent. */
export function buildTechnicalMessage(data: WebsiteData): string {
  const crawlerRows = Object.entries(data.robotsTxt.aiCrawlerStatus)
    .map(([name, status]) => `- ${name}: ${status}`)
    .join("\n");

  const redirectRows = data.redirectChain
    .map((r) => `${r.status} → ${r.url}`)
    .join("\n");

  return `Please analyze the following website data and produce a full GEO Technical SEO Audit report section as described in your instructions.

## Target URL
${data.url}

## HTTP Response
- Status code: ${data.statusCode}
- HTTPS: ${data.url.startsWith("https")}
- Redirect chain: ${data.redirectChain.length === 0 ? "no redirects" : redirectRows}

## Server-Side Rendering
- Has SSR content (text in raw HTML): ${data.hasSSRContent}
- Word count in raw HTML: ${data.wordCount}

## Meta & Indexability
- Title: ${data.title} (${data.title.length} chars)
- Meta description: ${data.metaDescription} (${data.metaDescription.length} chars)
- Canonical: ${data.canonical ?? "not set"}
- Viewport: ${data.metaTags["viewport"] ?? "not set"}
- Robots meta: ${data.metaTags["robots"] ?? "not set"}

## Security Headers
- HSTS: ${data.securityHeaders.hsts ?? "absent"}
- CSP: ${data.securityHeaders.csp ? "present" : "absent"}
- X-Frame-Options: ${data.securityHeaders.xFrameOptions ?? "absent"}
- X-Content-Type-Options: ${data.securityHeaders.xContentTypeOptions ?? "absent"}
- Referrer-Policy: ${data.securityHeaders.referrerPolicy ?? "absent"}
- Permissions-Policy: ${data.securityHeaders.permissionsPolicy ?? "absent"}

## robots.txt
exists: ${data.robotsTxt.exists}
has sitemap reference: ${data.robotsTxt.hasSitemap}
AI crawler access:
${crawlerRows}
${data.robotsTxt.exists ? `\nFull robots.txt (first 1000 chars):\n${data.robotsTxt.content.slice(0, 1000)}` : ""}

## llms.txt
exists: ${data.llmsTxt.exists}
llms-full.txt: ${data.llmsTxt.fullExists}

## Images
- Total: ${data.images.length}
- With alt text: ${data.images.filter((i) => i.alt).length}
- Lazy loaded: ${data.images.filter((i) => i.loading === "lazy").length}

## Structured Data
- JSON-LD blocks found: ${data.structuredData.length}

Analyze this data and produce the full ## Technical GEO Audit report section with scores across all 8 categories (Crawlability, Indexability, Security, URL Structure, Mobile, Core Web Vitals, SSR, Page Speed) plus prioritized action items.`;
}
