import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    host: new URL(base).host,
    sitemap: `${base}/sitemap.xml`,
  };
}
