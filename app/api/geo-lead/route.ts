/**
 * GEO lead capture (free report request).
 *
 * Flow: validate → run full GEO analysis → generate PDF → send emails.
 * All processing happens synchronously in this route.
 */

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { fetchWebsite } from "@/lib/geo/fetch-website";
import { runAgent } from "@/lib/geo/run-agent";
import { computeCompositeScore } from "@/lib/geo/scoring";
import { generatePDF } from "@/lib/pdf/generate-pdf";
import { sendReportEmail, sendInternalGeoReportDelivered } from "@/lib/email/sender";
import { normalizeWebsiteUrl } from "@/lib/website-url";
import type { AgentResults } from "@/lib/geo/types";

export const runtime = "nodejs";

const MAX_BODY = 16384;

function normalizeWebsite(input: unknown): string | null {
  if (typeof input !== "string") return null;
  return normalizeWebsiteUrl(input);
}

function isValidEmail(input: unknown): input is string {
  if (typeof input !== "string") return false;
  const e = input.trim();
  return e.length > 0 && e.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export async function POST(req: NextRequest) {
  const ct = req.headers.get("content-type")?.split(";")[0]?.trim();
  if (ct !== "application/json") {
    return NextResponse.json({ error: "unsupported_media" }, { status: 415 });
  }

  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY) {
      return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
    }
    raw = JSON.parse(text) as unknown;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const obj = raw as Record<string, unknown>;

  if (typeof obj.hp === "string" && obj.hp.trim().length > 0) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const website = normalizeWebsite(obj.website);
  const email = typeof obj.email === "string" ? obj.email.trim() : "";
  if (!website || !isValidEmail(email)) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  const company =
    typeof obj.company === "string" ? obj.company.trim().slice(0, 200) : "";

  try {
    // 1. Fetch website
    const websiteData = await fetchWebsite(website);

    // 2. Run all 5 agents
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const [visibility, content, technical, platform, schema] =
      await Promise.all([
        runAgent(client, "geo-ai-visibility", `Analyze this website:\nURL: ${websiteData.url}\nDomain: ${websiteData.domain}\nTitle: ${websiteData.title}\nMeta Description: ${websiteData.metaDescription}\nRobots.txt exists: ${websiteData.robotsTxt.exists}\nllms.txt exists: ${websiteData.llmsTxt.exists}\nSecurity Headers: ${JSON.stringify(websiteData.securityHeaders)}\nStructured Data: ${JSON.stringify(websiteData.structuredData)}`),
        runAgent(client, "geo-content", `Analyze this website:\nURL: ${websiteData.url}\nDomain: ${websiteData.domain}\nTitle: ${websiteData.title}\nWord Count: ${websiteData.wordCount}\nContent Blocks: ${JSON.stringify(websiteData.contentBlocks.slice(0, 5))}\nHeadings: ${JSON.stringify(websiteData.headingStructure)}`),
        runAgent(client, "geo-technical", `Analyze this website:\nURL: ${websiteData.url}\nDomain: ${websiteData.domain}\nStatus Code: ${websiteData.statusCode}\nSecurity Headers: ${JSON.stringify(websiteData.securityHeaders)}\nHas SSR: ${websiteData.hasSSRContent}\nRedirect Chain: ${JSON.stringify(websiteData.redirectChain)}\nRobots.txt: ${JSON.stringify(websiteData.robotsTxt)}`),
        runAgent(client, "geo-platform-analysis", `Analyze this website:\nURL: ${websiteData.url}\nDomain: ${websiteData.domain}\nTitle: ${websiteData.title}\nMeta Description: ${websiteData.metaDescription}\nStructured Data: ${JSON.stringify(websiteData.structuredData)}`),
        runAgent(client, "geo-schema", `Analyze this website:\nURL: ${websiteData.url}\nDomain: ${websiteData.domain}\nStructured Data: ${JSON.stringify(websiteData.structuredData)}\nMeta Tags: ${JSON.stringify(websiteData.metaTags)}`),
      ]);

    const agents: AgentResults = {
      visibility,
      content,
      technical,
      platform,
      schema,
    };

    // 3. Compute composite score
    const composite = computeCompositeScore(agents);

    // 4. Generate PDF
    const pdfBuffer = await generatePDF({
      url: website,
      company,
      composite,
      agents,
    });

    // 5. Send emails
    const leadReceivedPdf = await sendReportEmail({
      email,
      url: website,
      company,
      composite,
      pdfBuffer,
    });

    await sendInternalGeoReportDelivered({
      leadEmail: email,
      url: website,
      company,
      composite,
      leadReceivedPdf,
    });

    return NextResponse.json({ ok: true, score: composite.overall, grade: composite.grade });
  } catch (e) {
    console.error("geo-lead analysis error", e);
    return NextResponse.json(
      { error: "analysis_failed" },
      { status: 500 }
    );
  }
}
