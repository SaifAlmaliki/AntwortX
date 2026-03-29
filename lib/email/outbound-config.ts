/** When true, skip all nodemailer sends (local dev when SMTP is blocked or unavailable). */
export function shouldSkipOutboundEmail(): boolean {
  const v = (process.env.GEO_LEAD_SKIP_EMAIL || "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim()
  );
}
