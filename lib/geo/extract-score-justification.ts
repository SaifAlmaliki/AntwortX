const DEFAULT_MAX = 480;

const STOP_MARKERS = /(?:^|\n)#{2,3}\s*(?:Priority Actions|Important Notes)\b/im;

/** Main analysis sections in GEO agent outputs (after ## Output Format). */
const ANALYSIS_SECTION = /(?:^|\n)##\s+(?!Output Format\b)([^\n]+)/gim;

function stripMarkdownish(text: string): string {
  let t = text.replace(/\r\n/g, "\n");
  t = t.replace(/^#{1,6}\s+.+$/gm, " ");
  t = t.replace(/\*\*([^*]+)\*\*/g, "$1");
  t = t.replace(/\*([^*]+)\*/g, "$1");
  t = t.replace(/^[\s>*-]+/gm, "");
  t = t.replace(/\|/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

/**
 * Extract a short plain-text rationale from agent markdown: narrative after the main
 * "## … Analysis" / "## … Foundations" block and before Priority Actions.
 */
export function extractScoreJustification(
  markdown: string | undefined | null,
  maxLength: number = DEFAULT_MAX,
): string {
  if (!markdown || typeof markdown !== "string" || !markdown.trim()) {
    return "No structured rationale block was found in the model output.";
  }

  let body = markdown;

  const outputFormatMatch = body.match(/^##\s+Output Format\b/im);
  if (outputFormatMatch && outputFormatMatch.index !== undefined) {
    body = body.slice(outputFormatMatch.index + outputFormatMatch[0].length);
  }

  let best = "";
  let m: RegExpExecArray | null;
  const re = new RegExp(ANALYSIS_SECTION.source, ANALYSIS_SECTION.flags);
  while ((m = re.exec(body)) !== null) {
    const title = m[1]?.trim() ?? "";
    if (/^output format$/i.test(title)) continue;
    const start = m.index + m[0].length;
    const rest = body.slice(start);
    const stop = rest.search(STOP_MARKERS);
    const chunk = stop >= 0 ? rest.slice(0, stop) : rest;
    const cleaned = stripMarkdownish(chunk);
    if (cleaned.length > best.length) {
      best = cleaned;
    }
  }

  if (!best) {
    const earlyStop = markdown.search(STOP_MARKERS);
    const fallbackSlice = earlyStop >= 0 ? markdown.slice(0, earlyStop) : markdown;
    best = stripMarkdownish(fallbackSlice);
  }

  if (!best) {
    return "No structured rationale block was found in the model output.";
  }

  if (best.length <= maxLength) {
    return best;
  }
  const cut = best.slice(0, maxLength - 1).trim();
  const lastSpace = cut.lastIndexOf(" ");
  const head = lastSpace > maxLength * 0.5 ? cut.slice(0, lastSpace) : cut;
  return `${head}…`;
}
