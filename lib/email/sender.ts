import nodemailer from "nodemailer";
import type { CompositeScore } from "../geo/types";
import { buildConfirmationHtml, buildReportEmailHtml } from "./templates";

const DEFAULT_NOTIFY = "contact@zempar.com";

function createTransporter() {
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendConfirmation(params: {
  email: string;
  website: string;
  from: string;
  notifyTo: string;
}): Promise<void> {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: params.from,
    to: params.email,
    replyTo: params.notifyTo,
    subject: `Your GEO report is being generated for ${(() => { try { return new URL(params.website).hostname; } catch { return params.website; } })()}`,
    html: buildConfirmationHtml(params.website),
  });
}

export async function sendReportEmail(params: {
  email: string;
  url: string;
  company: string;
  composite: CompositeScore;
  pdfBuffer: Buffer;
}): Promise<void> {
  const { email, url, composite, pdfBuffer } = params;

  let domain = url;
  try { domain = new URL(url).hostname; } catch { /* use raw */ }

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
}
