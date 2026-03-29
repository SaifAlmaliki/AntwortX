/**
 * GEO lead capture (free report request).
 *
 * Optional SMTP (when all set, sends internal notify + optional auto-reply):
 * - SMTP_HOST, SMTP_USER, SMTP_PASS
 * - SMTP_PORT (default 587; use 465 with TLS if your provider requires it)
 * - GEO_LEAD_NOTIFY_TO — internal inbox (default: contact@zempar.com)
 * - GEO_LEAD_FROM — From header (default: SMTP_USER); use a domain-aligned address for best deliverability
 * - GEO_LEAD_AUTOREPLY — set to "0" or "false" to skip confirmation email to submitter
 *
 * Internal notify email sets Reply-To to the lead's address so you can press Reply in your inbox.
 * If SMTP is not configured, POST returns JSON with `mailto` so the client can open the user's mail app.
 */

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { inngest } from "@/lib/inngest/client";
import { buildConfirmationHtml } from "@/lib/email/templates";

export const runtime = "nodejs";

const MAX_BODY = 16384;
const DEFAULT_NOTIFY = "contact@zempar.com";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function normalizeWebsite(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const t = input.trim();
  if (!t) return null;
  let url = t;
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.href;
  } catch {
    return null;
  }
}

function isValidEmail(input: unknown): input is string {
  if (typeof input !== "string") return false;
  const e = input.trim();
  return e.length > 0 && e.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function buildMailto(website: string, email: string, company: string) {
  const to = process.env.GEO_LEAD_NOTIFY_TO || DEFAULT_NOTIFY;
  const subject = "Free GEO visibility report request";
  const body = `Website: ${website}\nWork email: ${email}\nCompany: ${company || "(not provided)"}\n\n---\nSubmitted from zempar.com GEO lead form`;
  return { to, subject, body };
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

  const mailto = buildMailto(website, email, company);

  if (!isSmtpConfigured()) {
    return NextResponse.json({ ok: false, mailto });
  }

  try {
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const notifyTo = process.env.GEO_LEAD_NOTIFY_TO || DEFAULT_NOTIFY;
    const from = process.env.GEO_LEAD_FROM || process.env.SMTP_USER!;

    const internalHtml = `<p><strong>GEO lead — free report request</strong></p><ul><li>Website: ${escapeHtml(website)}</li><li>Email: ${escapeHtml(email)}</li><li>Company: ${escapeHtml(company || "(not provided)")}</li><li>Time: ${escapeHtml(new Date().toISOString())}</li></ul>`;

    await transporter.sendMail({
      from,
      to: notifyTo,
      replyTo: email,
      subject: `[Zempar] GEO report request — ${email}`,
      text: `Website: ${website}\nEmail: ${email}\nCompany: ${company || "(not provided)"}\nTime: ${new Date().toISOString()}`,
      html: internalHtml,
    });

    // Send immediate confirmation email and trigger async GEO analysis
    await transporter.sendMail({
      from,
      to: email,
      replyTo: notifyTo,
      subject: `Your GEO report is being generated for ${(() => { try { return new URL(website).hostname; } catch { return website; } })()}`,
      html: buildConfirmationHtml(website),
    });

    await inngest.send({
      name: "geo/analysis.requested",
      data: { url: website, email, company },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("geo-lead send error", e);
    return NextResponse.json(
      { error: "send_failed", mailto },
      { status: 500 }
    );
  }
}
