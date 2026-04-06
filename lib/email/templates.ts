import type { CompositeScore } from "../geo/types";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function gradeColor(grade: string): string {
  switch (grade) {
    case "Excellent": return "#22c55e";
    case "Good": return "#84cc16";
    case "Fair": return "#f59e0b";
    case "Poor": return "#f97316";
    default: return "#ef4444"; // Critical
  }
}

export function buildConfirmationHtml(website: string): string {
  let domain = website;
  try { domain = new URL(website).hostname; } catch { /* use raw */ }

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#060606;font-family:system-ui,-apple-system,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060606;">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0f0f0f;border:1px solid #1f1f1f;border-radius:12px;overflow:hidden;max-width:600px;">
        <tr><td style="padding:32px 40px;border-bottom:1px solid #1f1f1f;">
          <span style="font-size:22px;font-weight:700;color:#06b6d4;letter-spacing:-0.5px;">Zempar</span>
        </td></tr>
        <tr><td style="padding:40px;">
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#ffffff;">Your GEO Report Is Being Generated</h1>
          <p style="margin:0 0 24px;color:#a3a3a3;line-height:1.6;font-size:15px;">
            We've received your request and are now running a full 5-agent GEO visibility analysis for
            <strong style="color:#ffffff;">${domain}</strong>.
          </p>
          <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:20px;margin-bottom:24px;">
            <p style="margin:0;color:#a3a3a3;font-size:14px;line-height:1.6;">
              Our analysis covers:<br>
              <strong style="color:#ffffff;">AI Visibility &amp; Citability</strong> ·
              <strong style="color:#ffffff;">Content E-E-A-T</strong> ·
              <strong style="color:#ffffff;">Technical GEO</strong> ·
              <strong style="color:#ffffff;">Platform Optimization</strong> ·
              <strong style="color:#ffffff;">Schema &amp; Structured Data</strong>
            </p>
          </div>
          <p style="margin:0 0 8px;color:#a3a3a3;font-size:15px;line-height:1.6;">
            Your PDF report will arrive in this inbox within <strong style="color:#ffffff;">5–10 minutes</strong>.
          </p>
          <p style="margin:0;color:#606060;font-size:13px;">We may also reach out to discuss how we can help improve your AI search visibility.</p>
        </td></tr>
        <tr><td style="padding:24px 40px;border-top:1px solid #1f1f1f;">
          <p style="margin:0;color:#606060;font-size:12px;">© ${new Date().getFullYear()} Zempar. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildReportEmailHtml(
  domain: string,
  composite: CompositeScore
): string {
  const color = gradeColor(composite.grade);
  const safeDomain = escapeHtml(domain);

  const breakdownRows = [
    ["AI Visibility & Citability", composite.breakdown.citability, "25%"],
    ["Content Quality (E-E-A-T)", composite.breakdown.eeat, "20%"],
    ["Technical GEO", composite.breakdown.technical, "15%"],
    ["Schema & Structured Data", composite.breakdown.schema, "10%"],
    ["Platform Optimization", composite.breakdown.platform, "10%"],
  ]
    .map(
      ([label, score, weight]) =>
        `<tr>
          <td style="padding:12px 14px;color:#d4d4d4;font-size:14px;border-bottom:1px solid #262626;">${label}</td>
          <td style="padding:12px 14px;text-align:center;font-weight:700;color:#fafafa;font-size:14px;border-bottom:1px solid #262626;">${score}/100</td>
          <td style="padding:12px 14px;text-align:center;color:#737373;font-size:13px;border-bottom:1px solid #262626;">${weight}</td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#060606;font-family:system-ui,-apple-system,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060606;">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0f0f0f;border:1px solid #1f1f1f;border-radius:12px;overflow:hidden;max-width:600px;">
        <tr><td style="padding:32px 40px;border-bottom:1px solid #1f1f1f;">
          <span style="font-size:22px;font-weight:700;color:#06b6d4;letter-spacing:-0.5px;">Zempar</span>
        </td></tr>
        <tr><td style="padding:40px 40px 28px;text-align:center;">
          <!-- Table + line-height centering: flex is unreliable in email clients and caused score clipping -->
          <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 20px;">
            <tr>
              <td align="center" valign="middle" width="136" height="136" style="width:136px;height:136px;border-radius:68px;background:${color};line-height:136px;mso-line-height-rule:exactly;text-align:center;font-size:34px;font-weight:800;color:#0a0a0a;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                ${composite.overall}
              </td>
            </tr>
          </table>
          <p style="margin:0 0 6px;font-size:12px;color:#737373;text-transform:uppercase;letter-spacing:0.14em;">GEO Visibility Score</p>
          <p style="margin:0 0 14px;font-size:26px;font-weight:700;color:${color};line-height:1.25;">${composite.grade}</p>
          <p style="margin:0 0 18px;font-size:14px;line-height:1.5;">
            <a href="https://${safeDomain}" style="color:#22d3ee;text-decoration:underline;">${safeDomain}</a>
          </p>
          <p style="margin:0 auto;max-width:440px;font-size:15px;color:#a3a3a3;line-height:1.65;">
            Zempar supports you in enhancing your visibility across AI-powered search and answer engines.
          </p>
        </td></tr>
        <tr><td style="padding:0 40px 36px;">
          <h2 style="margin:0 0 14px;font-size:17px;font-weight:600;color:#ffffff;letter-spacing:-0.02em;">Score Breakdown</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #262626;border-radius:10px;overflow:hidden;border-collapse:separate;">
            <tr style="background:#141414;">
              <th style="padding:12px 14px;text-align:left;color:#737373;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Dimension</th>
              <th style="padding:12px 14px;text-align:center;color:#737373;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Score</th>
              <th style="padding:12px 14px;text-align:center;color:#737373;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Weight</th>
            </tr>
            ${breakdownRows}
            <tr style="background:#141414;">
              <td style="padding:14px;font-weight:700;color:#fafafa;font-size:14px;border-top:1px solid #262626;"><strong>Overall GEO Score</strong></td>
              <td style="padding:14px;text-align:center;font-weight:800;font-size:17px;color:${color};border-top:1px solid #262626;">${composite.overall}/100</td>
              <td style="padding:14px;text-align:center;color:#525252;font-size:13px;border-top:1px solid #262626;">—</td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 40px 36px;">
          <p style="margin:0 0 14px;color:#a3a3a3;font-size:14px;line-height:1.65;">
            Your full GEO Visibility Report is attached to this email as a PDF. It includes detailed findings across all analysis dimensions, platform-specific recommendations, and a prioritized 30-day action plan.
          </p>
          <p style="margin:0 0 20px;padding:16px 18px;background:#141414;border:1px solid #262626;border-radius:10px;color:#d4d4d4;font-size:14px;line-height:1.65;">
            <strong style="color:#fafafa;">Reply to this email</strong> and we can work together to improve your visibility — share questions, goals, or timelines and we will help you prioritize next steps.
          </p>
          <table cellpadding="0" cellspacing="0" role="presentation" align="center" style="margin:0 auto;"><tr><td style="border-radius:999px;background:#06b6d4;">
            <a href="https://zempar.com/contact" style="display:inline-block;padding:14px 28px;color:#0a0a0a;font-weight:700;font-size:14px;text-decoration:none;">Discuss your results with Zempar →</a>
          </td></tr></table>
        </td></tr>
        <tr><td style="padding:24px 40px;border-top:1px solid #1f1f1f;">
          <p style="margin:0;color:#606060;font-size:12px;">© ${new Date().getFullYear()} Zempar. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
