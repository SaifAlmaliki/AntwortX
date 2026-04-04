import nodemailer from "nodemailer";
import type { CompositeScore } from "../geo/types";
import { isSmtpConfigured, shouldSkipOutboundEmail } from "./outbound-config";
import { buildReportEmailHtml } from "./templates";

const DEFAULT_NOTIFY = "contact@zempar.com";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function createTransporter() {
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const connectionTimeout = parseInt(
    process.env.SMTP_CONNECTION_TIMEOUT_MS || "15000",
    10
  );
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    connectionTimeout: Number.isFinite(connectionTimeout)
      ? connectionTimeout
      : 15000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/** PDF report to the lead — call only after the report buffer exists. */
export async function sendReportEmail(params: {
  email: string;
  url: string;
  company: string;
  composite: CompositeScore;
  pdfBuffer: Buffer;
}): Promise<boolean> {
  const { email, url, composite, pdfBuffer } = params;

  let domain = url;
  try {
    domain = new URL(url).hostname;
  } catch {
    /* use raw */
  }

  if (shouldSkipOutboundEmail()) {
    console.info("[email] GEO_LEAD_SKIP_EMAIL: skip report email to", email);
    return false;
  }

  if (!isSmtpConfigured()) {
    console.warn("[email] SMTP not configured: skip report email to lead");
    return false;
  }

  const date = new Date().toISOString().slice(0, 10);
  const transporter = createTransporter();
  const from = process.env.GEO_LEAD_FROM || process.env.SMTP_USER!;
  const notifyTo = process.env.GEO_LEAD_NOTIFY_TO || DEFAULT_NOTIFY;

  await transporter.sendMail({
    from,
    to: email,
    replyTo: notifyTo,
    subject: `Your GEO Visibility Report for ${domain} — Score: ${composite.overall}/100 (${composite.grade})`,
    html: buildReportEmailHtml(domain, composite),
    attachments: [
      {
        filename: `GEO-Report-${domain}-${date}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
  return true;
}

/** Internal inbox: pipeline finished; copy reflects whether the lead was actually emailed the PDF. */
export async function sendInternalGeoReportDelivered(params: {
  leadEmail: string;
  url: string;
  company: string;
  composite: CompositeScore;
  leadReceivedPdf: boolean;
}): Promise<void> {
  const { leadEmail, url, company, composite, leadReceivedPdf } = params;

  let domain = url;
  try {
    domain = new URL(url).hostname;
  } catch {
    /* use raw */
  }

  if (shouldSkipOutboundEmail()) {
    console.info("[email] GEO_LEAD_SKIP_EMAIL: skip internal GEO delivery notify");
    return;
  }

  if (!isSmtpConfigured()) {
    console.warn("[email] SMTP not configured: skip internal GEO delivery notify");
    return;
  }

  const notifyTo = process.env.GEO_LEAD_NOTIFY_TO || DEFAULT_NOTIFY;
  const from = process.env.GEO_LEAD_FROM || process.env.SMTP_USER!;
  const transporter = createTransporter();
  const time = new Date().toISOString();

  const deliveryNote = leadReceivedPdf
    ? "PDF with full report was emailed to the lead."
    : "Outbound email was skipped or SMTP is not configured — the lead was not emailed.";

  const internalHtml = `<p><strong>GEO report ready</strong></p>
<ul>
  <li>Website: ${escapeHtml(url)}</li>
  <li>Lead email: ${escapeHtml(leadEmail)}</li>
  <li>Company: ${escapeHtml(company || "(not provided)")}</li>
  <li>Score: ${composite.overall}/100 (${escapeHtml(composite.grade)})</li>
  <li>Time: ${escapeHtml(time)}</li>
</ul>
<p style="color:#666;font-size:13px;">${escapeHtml(deliveryNote)} Reply-To is the lead.</p>`;

  const subjTag = leadReceivedPdf ? "sent" : "completed";

  await transporter.sendMail({
    from,
    to: notifyTo,
    replyTo: leadEmail,
    subject: `[Zempar] GEO report ${subjTag} — ${domain} — ${composite.overall}/100`,
    text: `GEO report ${subjTag}\nWebsite: ${url}\nLead: ${leadEmail}\nCompany: ${company || "(not provided)"}\nScore: ${composite.overall}/100 (${composite.grade})\nTime: ${time}\n${deliveryNote}`,
    html: internalHtml,
  });
}
