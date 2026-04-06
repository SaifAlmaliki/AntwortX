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

  const pipelineId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  console.log(`\n[geo-lead:${pipelineId}] ========================================`);
  console.log(`[geo-lead:${pipelineId}] New audit request`);
  console.log(`[geo-lead:${pipelineId}] Website: ${website}`);
  console.log(`[geo-lead:${pipelineId}] Email:   ${email}`);
  console.log(`[geo-lead:${pipelineId}] Company: ${company || "(not provided)"}`);
  console.log(`[geo-lead:${pipelineId}] ========================================\n`);

  after(async () => {
    const ts = () => new Date().toISOString().slice(11, 19);

    try {
      // 1. Fetch website
      console.log(`[${ts()}] [geo-lead:${pipelineId}] [1/8] Fetching website: ${website}`);
      const t0 = Date.now();
      const websiteData = await fetchWebsite(website);
      console.log(`[${ts()}] [geo-lead:${pipelineId}]       Website fetched in ${Date.now() - t0}ms — ${websiteData.wordCount} words`);

      // 2. Run all 5 agents in parallel
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      console.log(`[${ts()}] [geo-lead:${pipelineId}] [2/8] Running 5 AI agents in parallel...`);
      const tAgents = Date.now();

      const agentNames = [
        "geo-ai-visibility",
        "geo-content",
        "geo-technical",
        "geo-platform-analysis",
        "geo-schema",
      ] as const;

      const agentLabels: Record<string, string> = {
        "geo-ai-visibility": "AI Visibility & Citability",
        "geo-content": "Content Quality (E-E-A-T)",
        "geo-technical": "Technical GEO",
        "geo-platform-analysis": "Platform Optimization",
        "geo-schema": "Schema & Structured Data",
      };

      const agentStarts: Record<string, number> = {};
      agentNames.forEach((n) => { agentStarts[n] = Date.now(); });

      const [visibility, content, technical, platform, schema] =
        await Promise.all([
          runAgentWithLog(client, "geo-ai-visibility", buildAIVisibilityMessage(websiteData), pipelineId, agentStarts, agentLabels),
          runAgentWithLog(client, "geo-content", buildContentMessage(websiteData), pipelineId, agentStarts, agentLabels),
          runAgentWithLog(client, "geo-technical", buildTechnicalMessage(websiteData), pipelineId, agentStarts, agentLabels),
          runAgentWithLog(client, "geo-platform-analysis", buildPlatformMessage(websiteData), pipelineId, agentStarts, agentLabels),
          runAgentWithLog(client, "geo-schema", buildSchemaMessage(websiteData), pipelineId, agentStarts, agentLabels),
        ]);

      console.log(`[${ts()}] [geo-lead:${pipelineId}]       All 5 agents completed in ${Date.now() - tAgents}ms`);

      const agents: AgentResults = {
        visibility,
        content,
        technical,
        platform,
        schema,
      };

      // 3. Compute composite score
      console.log(`[${ts()}] [geo-lead:${pipelineId}] [3/8] Computing composite score...`);
      const composite = computeCompositeScore(agents);
      console.log(`[${ts()}] [geo-lead:${pipelineId}]       Score: ${composite.overall}/100 (${composite.grade})`);
      console.log(`[${ts()}] [geo-lead:${pipelineId}]       Breakdown:`);
      console.log(`[${ts()}] [geo-lead:${pipelineId}]         AI Visibility:      ${composite.breakdown.citability}/100`);
      console.log(`[${ts()}] [geo-lead:${pipelineId}]         Content E-E-A-T:    ${composite.breakdown.eeat}/100`);
      console.log(`[${ts()}] [geo-lead:${pipelineId}]         Technical GEO:      ${composite.breakdown.technical}/100`);
      console.log(`[${ts()}] [geo-lead:${pipelineId}]         Schema:             ${composite.breakdown.schema}/100`);
      console.log(`[${ts()}] [geo-lead:${pipelineId}]         Platform:           ${composite.breakdown.platform}/100`);

      // 4. Generate PDF
      console.log(`[${ts()}] [geo-lead:${pipelineId}] [4/8] Generating PDF report...`);
      const tPdf = Date.now();
      const pdfBuffer = await generatePDF({
        url: website,
        company,
        composite,
        agents,
      });
      console.log(`[${ts()}] [geo-lead:${pipelineId}]       PDF generated in ${Date.now() - tPdf}ms (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);

      // 5. Send emails
      console.log(`[${ts()}] [geo-lead:${pipelineId}] [5/8] Sending report email to ${email}...`);
      const tEmail = Date.now();
      const leadReceivedPdf = await sendReportEmail({
        email,
        url: website,
        company,
        composite,
        pdfBuffer,
      });
      console.log(`[${ts()}] [geo-lead:${pipelineId}]       Report email ${leadReceivedPdf ? "sent" : "skipped"} in ${Date.now() - tEmail}ms`);

      // 6. Internal notification
      console.log(`[${ts()}] [geo-lead:${pipelineId}] [6/8] Sending internal notification...`);
      await sendInternalGeoReportDelivered({
        leadEmail: email,
        url: website,
        company,
        composite,
        leadReceivedPdf,
      });
      console.log(`[${ts()}] [geo-lead:${pipelineId}]       Internal notification sent`);

      console.log(`[${ts()}] [geo-lead:${pipelineId}] ========================================`);
      console.log(`[${ts()}] [geo-lead:${pipelineId}] Pipeline complete in ${Date.now() - t0}ms`);
      console.log(`[${ts()}] [geo-lead:${pipelineId}] ========================================\n`);
    } catch (e) {
      console.error(`[geo-lead:${pipelineId}] Pipeline failed:`, e);
    }
  });

  return NextResponse.json({ ok: true, queued: true }, { status: 202 });
}

async function runAgentWithLog(
  client: Anthropic,
  agentName: string,
  userMessage: string,
  pipelineId: string,
  starts: Record<string, number>,
  labels: Record<string, string>,
) {
  const { runAgent } = await import("@/lib/geo/run-agent");
  const result = await runAgent(client, agentName, userMessage);
  const elapsed = Date.now() - (starts[agentName] || Date.now());
  const ts = () => new Date().toISOString().slice(11, 19);
  console.log(`[${ts()}] [geo-lead:${pipelineId}]       ✓ ${labels[agentName] || agentName}: ${result.score}/100 (${result.grade}) — ${elapsed}ms`);
  return result;
}
