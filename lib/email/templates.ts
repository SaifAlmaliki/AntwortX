import type { CompositeScore } from "../geo/types";

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
          <td style="padding:10px 12px;color:#a3a3a3;font-size:14px;border-bottom:1px solid #1f1f1f;">${label}</td>
          <td style="padding:10px 12px;text-align:center;font-weight:700;color:#ffffff;font-size:14px;border-bottom:1px solid #1f1f1f;">${score}/100</td>
          <td style="padding:10px 12px;text-align:center;color:#606060;font-size:13px;border-bottom:1px solid #1f1f1f;">${weight}</td>
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
        <tr><td style="padding:40px;text-align:center;">
          <div style="display:inline-block;width:120px;height:120px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
            <span style="font-size:36px;font-weight:800;color:#000;">${composite.overall}</span>
          </div>
          <p style="margin:0 0 4px;font-size:13px;color:#a3a3a3;text-transform:uppercase;letter-spacing:1px;">GEO Visibility Score</p>
          <p style="margin:0 0 8px;font-size:28px;font-weight:700;color:${color};">${composite.grade}</p>
          <p style="margin:0;color:#a3a3a3;font-size:14px;">${domain}</p>
        </td></tr>
        <tr><td style="padding:0 40px 32px;">
          <h2 style="margin:0 0 16px;font-size:16px;font-weight:600;color:#ffffff;">Score Breakdown</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1f1f1f;border-radius:8px;overflow:hidden;">
            <tr style="background:#1a1a1a;">
              <th style="padding:10px 12px;text-align:left;color:#606060;font-size:12px;font-weight:600;text-transform:uppercase;">Dimension</th>
              <th style="padding:10px 12px;text-align:center;color:#606060;font-size:12px;font-weight:600;text-transform:uppercase;">Score</th>
              <th style="padding:10px 12px;text-align:center;color:#606060;font-size:12px;font-weight:600;text-transform:uppercase;">Weight</th>
            </tr>
            ${breakdownRows}
            <tr style="background:#1a1a1a;">
              <td style="padding:12px;font-weight:700;color:#ffffff;font-size:14px;"><strong>Overall GEO Score</strong></td>
              <td style="padding:12px;text-align:center;font-weight:800;font-size:18px;color:${color};">${composite.overall}/100</td>
              <td style="padding:12px;text-align:center;color:#606060;font-size:13px;">—</td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 40px 32px;">
          <p style="margin:0 0 16px;color:#a3a3a3;font-size:14px;line-height:1.6;">
            Your full GEO Visibility Report is attached to this email as a PDF. It includes detailed findings across all analysis dimensions, platform-specific recommendations, and a prioritized 30-day action plan.
          </p>
          <table cellpadding="0" cellspacing="0"><tr><td style="border-radius:8px;background:#06b6d4;">
            <a href="https://zempar.com/contact" style="display:block;padding:14px 28px;color:#000;font-weight:700;font-size:14px;text-decoration:none;">Discuss Your Results with Zempar →</a>
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
