/**
 * GEO lead capture (free report request).
 *
 * Flow: validate → respond immediately → run full GEO analysis, PDF, and
 * emails in the background via Next.js `after()` so the client is not blocked.
 */

import { NextRequest, NextResponse, after } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { fetchWebsite } from "@/lib/geo/fetch-website";
import { runAgent } from "@/lib/geo/run-agent";
import { computeCompositeScore } from "@/lib/geo/scoring";
import { generatePDF } from "@/lib/pdf/generate-pdf";
import { sendReportEmail, sendInternalGeoReportDelivered } from "@/lib/email/sender";
import { normalizeWebsiteUrl } from "@/lib/website-url";
import type { AgentResults } from "@/lib/geo/types";
import {
  buildAIVisibilityMessage,
} from "@/lib/geo/messages/ai-visibility";
import {
  buildContentMessage,
} from "@/lib/geo/messages/content";
import {
  buildTechnicalMessage,
} from "@/lib/geo/messages/technical";
import {
  buildPlatformMessage,
} from "@/lib/geo/messages/platform";
import {
  buildSchemaMessage,
} from "@/lib/geo/messages/schema";

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

  after(async () => {
    try {
      const websiteData = await fetchWebsite(website);

      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const [visibility, content, technical, platform, schema] =
        await Promise.all([
          runAgent(client, "geo-ai-visibility", buildAIVisibilityMessage(websiteData)),
          runAgent(client, "geo-content", buildContentMessage(websiteData)),
          runAgent(client, "geo-technical", buildTechnicalMessage(websiteData)),
          runAgent(client, "geo-platform-analysis", buildPlatformMessage(websiteData)),
          runAgent(client, "geo-schema", buildSchemaMessage(websiteData)),
        ]);

      const agents: AgentResults = {
        visibility,
        content,
        technical,
        platform,
        schema,
      };

      const composite = computeCompositeScore(agents);

      const pdfBuffer = await generatePDF({
        url: website,
        company,
        composite,
        agents,
      });

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
    } catch (e) {
      console.error("geo-lead analysis error", e);
    }
  });

  return NextResponse.json({ ok: true, queued: true }, { status: 202 });
}
