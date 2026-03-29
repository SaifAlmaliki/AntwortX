import * as cheerio from "cheerio";
import type {
  WebsiteData,
  ContentBlock,
  HeadingEntry,
  ImageEntry,
  RobotsTxtData,
  LlmsTxtData,
  SecurityHeaders,
  RedirectEntry,
} from "./types";

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Amazonbot",
  "CCBot",
  "Bytespider",
  "Google-Extended",
  "Applebot-Extended",
  "FacebookBot",
] as const;

const USER_AGENT =
  "Mozilla/5.0 (compatible; ZemparGEO/1.0; +https://zempar.com)";

const FETCH_TIMEOUT = 20_000;

async function safeFetch(url: string): Promise<Response | null> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,*/*" },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(id);
    return res;
  } catch {
    return null;
  }
}

function extractDomain(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}

function parseStructuredData(html: string): unknown[] {
  const results: unknown[] = [];
  const regex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      results.push(JSON.parse(match[1]));
    } catch {
      // skip malformed JSON-LD
    }
  }
  return results;
}

function parseRobotsTxt(
  content: string
): Record<string, "ALLOWED" | "BLOCKED" | "RESTRICTED" | "UNKNOWN"> {
  const status: Record<string, "ALLOWED" | "BLOCKED" | "RESTRICTED" | "UNKNOWN"> = {};
  for (const crawler of AI_CRAWLERS) {
    status[crawler] = "UNKNOWN";
  }

  const lines = content.split("\n").map((l) => l.trim());
  let currentAgents: string[] = [];
  const rules: Record<string, string[]> = {};

  for (const line of lines) {
    if (line.startsWith("#") || !line) continue;
    const [key, ...rest] = line.split(":").map((s) => s.trim());
    const value = rest.join(":").trim();
    if (key?.toLowerCase() === "user-agent") {
      currentAgents = [value];
    } else if (key?.toLowerCase() === "disallow") {
      for (const agent of currentAgents) {
        rules[agent] = [...(rules[agent] || []), value];
      }
    }
  }

  for (const crawler of AI_CRAWLERS) {
    const wildcard = rules["*"] || [];
    const specific = rules[crawler] || [];

    const allRules = specific.length > 0 ? specific : wildcard;
    if (allRules.length === 0) {
      status[crawler] = "ALLOWED";
    } else if (allRules.includes("/")) {
      status[crawler] = "BLOCKED";
    } else if (allRules.some((r) => r.length > 0)) {
      status[crawler] = "RESTRICTED";
    } else {
      status[crawler] = "ALLOWED";
    }
  }

  return status;
}

function extractSecurityHeaders(headers: Headers): SecurityHeaders {
  return {
    hsts: headers.get("strict-transport-security"),
    csp: headers.get("content-security-policy"),
    xFrameOptions: headers.get("x-frame-options"),
    xContentTypeOptions: headers.get("x-content-type-options"),
    referrerPolicy: headers.get("referrer-policy"),
    permissionsPolicy: headers.get("permissions-policy"),
  };
}

function extractContentBlocks($: cheerio.CheerioAPI, mainEl: ReturnType<cheerio.CheerioAPI>): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let currentHeading: string | null = null;
  let currentParts: string[] = [];

  mainEl.find("h2, h3, p, li").each((_, el) => {
    const tag = (el as { tagName?: string }).tagName?.toLowerCase();
    if (tag === "h2" || tag === "h3") {
      if (currentParts.length > 0) {
        const content = currentParts.join(" ").trim();
        blocks.push({
          heading: currentHeading,
          content,
          wordCount: content.split(/\s+/).filter(Boolean).length,
        });
      }
      currentHeading = $(el).text().trim();
      currentParts = [];
    } else {
      const text = $(el).text().trim();
      if (text.length > 20) currentParts.push(text);
    }
  });

  if (currentParts.length > 0) {
    const content = currentParts.join(" ").trim();
    blocks.push({
      heading: currentHeading,
      content,
      wordCount: content.split(/\s+/).filter(Boolean).length,
    });
  }

  return blocks;
}

export async function fetchWebsite(url: string): Promise<WebsiteData> {
  const domain = extractDomain(url);
  const empty = emptyWebsiteData(url, domain);

  // ── Fetch main page ──────────────────────────────────────────────────────
  const res = await safeFetch(url);
  if (!res) {
    return { ...empty, fetchError: "Failed to fetch URL" };
  }

  const statusCode = res.status;
  const securityHeaders = extractSecurityHeaders(res.headers);

  // Track redirect chain via manual fetch with no-follow
  const redirectChain: RedirectEntry[] = [];
  try {
    let current = url;
    for (let i = 0; i < 5; i++) {
      const r = await fetch(current, {
        headers: { "User-Agent": USER_AGENT },
        redirect: "manual",
        signal: AbortSignal.timeout(5000),
      });
      if (r.status >= 300 && r.status < 400) {
        redirectChain.push({ url: current, status: r.status });
        current = r.headers.get("location") || current;
      } else {
        break;
      }
    }
  } catch {
    // non-critical
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // ── Remove noise ─────────────────────────────────────────────────────────
  $("script, style, nav, footer, header, [role='navigation'], [role='banner'], [role='contentinfo'], noscript, iframe").remove();

  // ── Meta tags ────────────────────────────────────────────────────────────
  const title = $("title").first().text().trim();
  const metaTags: Record<string, string> = {};
  $("meta").each((_, el) => {
    const name = $(el).attr("name") || $(el).attr("property") || "";
    const content = $(el).attr("content") || "";
    if (name && content) metaTags[name] = content;
  });
  const metaDescription = metaTags["description"] || metaTags["og:description"] || "";
  const canonical = $('link[rel="canonical"]').attr("href") || null;

  // ── Headings ─────────────────────────────────────────────────────────────
  const headingStructure: HeadingEntry[] = [];
  const h1Tags: string[] = [];
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const level = parseInt(((el as { tagName?: string }).tagName ?? "h1").replace("h", "") || "1", 10);
    const text = $(el).text().trim();
    if (text) {
      headingStructure.push({ level, text });
      if (level === 1) h1Tags.push(text);
    }
  });

  // ── Main content ─────────────────────────────────────────────────────────
  const mainEl = $("main, article, [role='main'], .content, #content, body").first();
  const textContent = (mainEl.text() || $("body").text())
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;

  // ── Images ───────────────────────────────────────────────────────────────
  const images: ImageEntry[] = [];
  $("img").each((_, el) => {
    images.push({
      src: $(el).attr("src") || "",
      alt: $(el).attr("alt") || "",
      loading: $(el).attr("loading") || "auto",
    });
  });

  // ── Links ────────────────────────────────────────────────────────────────
  const internalLinks: string[] = [];
  const externalLinks: string[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (href.startsWith("http")) {
      if (href.includes(new URL(url).hostname)) {
        internalLinks.push(href);
      } else {
        externalLinks.push(href);
      }
    }
  });

  // ── Structured data ───────────────────────────────────────────────────────
  const structuredData = parseStructuredData(html);

  // ── SSR detection ─────────────────────────────────────────────────────────
  // If meaningful text exists in raw HTML body before JS runs
  const hasSSRContent = wordCount > 100;

  // ── Content blocks ────────────────────────────────────────────────────────
  const contentBlocks = extractContentBlocks($, mainEl);

  // ── robots.txt ───────────────────────────────────────────────────────────
  const robotsTxt = await fetchRobotsTxt(domain);

  // ── llms.txt ─────────────────────────────────────────────────────────────
  const llmsTxt = await fetchLlmsTxt(domain);

  return {
    url,
    domain,
    title,
    metaDescription,
    canonical,
    h1Tags,
    headingStructure,
    textContent,
    wordCount,
    structuredData,
    metaTags,
    internalLinks: [...new Set(internalLinks)],
    externalLinks: [...new Set(externalLinks)],
    images,
    securityHeaders,
    statusCode,
    redirectChain,
    hasSSRContent,
    robotsTxt,
    llmsTxt,
    contentBlocks,
    fetchError: null,
  };
}

export async function fetchRobotsTxt(origin: string): Promise<RobotsTxtData> {
  const url = `${origin}/robots.txt`;
  const res = await safeFetch(url);
  if (!res || res.status !== 200) {
    return {
      exists: false,
      content: "",
      aiCrawlerStatus: Object.fromEntries(AI_CRAWLERS.map((c) => [c, "UNKNOWN"])) as Record<string, "ALLOWED" | "BLOCKED" | "RESTRICTED" | "UNKNOWN">,
      hasSitemap: false,
    };
  }
  const content = await res.text();
  return {
    exists: true,
    content,
    aiCrawlerStatus: parseRobotsTxt(content),
    hasSitemap: /sitemap:/i.test(content),
  };
}

export async function fetchLlmsTxt(origin: string): Promise<LlmsTxtData> {
  const [res, resFull] = await Promise.all([
    safeFetch(`${origin}/llms.txt`),
    safeFetch(`${origin}/llms-full.txt`),
  ]);
  const exists = res?.status === 200;
  const content = exists ? await res!.text() : "";
  const fullExists = resFull?.status === 200;
  return { exists, content, fullExists };
}

function emptyWebsiteData(url: string, domain: string): WebsiteData {
  return {
    url,
    domain,
    title: "",
    metaDescription: "",
    canonical: null,
    h1Tags: [],
    headingStructure: [],
    textContent: "",
    wordCount: 0,
    structuredData: [],
    metaTags: {},
    internalLinks: [],
    externalLinks: [],
    images: [],
    securityHeaders: { hsts: null, csp: null, xFrameOptions: null, xContentTypeOptions: null, referrerPolicy: null, permissionsPolicy: null },
    statusCode: 0,
    redirectChain: [],
    hasSSRContent: false,
    robotsTxt: { exists: false, content: "", aiCrawlerStatus: {}, hasSitemap: false },
    llmsTxt: { exists: false, content: "", fullExists: false },
    contentBlocks: [],
    fetchError: null,
  };
}
