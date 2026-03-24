import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const AI_CRAWLER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "Google-Extended",
  "anthropic-ai",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Bytespider",
] as const;

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  const sitemapUrl = `${base}/sitemap.xml`;

  const aiRules = AI_CRAWLER_AGENTS.map((userAgent) => ({
    userAgent,
    allow: "/",
  }));

  const hostname = new URL(base).host;

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...aiRules,
    ],
    host: hostname,
    sitemap: sitemapUrl,
  };
}
