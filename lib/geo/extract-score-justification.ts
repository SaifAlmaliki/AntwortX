const DEFAULT_MAX = 480;

const STOP_MARKERS = /(?:^|\n)#{2,3}\s*(?:Priority Actions|Important Notes)\b/im;

/** Main analysis sections in GEO agent outputs (after ## Output Format). */
const ANALYSIS_SECTION = /(?:^|\n)##\s+(?!Output Format\b)([^\n]+)/gim;

function removeCodeFences(text: string): string {
  return text.replace(/```[\w]*\n?[\s\S]*?```/g, "\n\n");
}

/** Drop markdown tables, ASCII score grids, and other non-prose lines. */
function filterNoiseLines(text: string): string {
  const lines = text.split(/\r?\n/);
  const out: string[] = [];

  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      out.push("");
      continue;
    }
    if (/^```/.test(t)) continue;
    if (/^---+$/m.test(t)) continue;
    if (/^={3,}$/m.test(t)) continue;
    // Markdown / pseudo table rows
    if (/^\|.+\|/.test(t)) continue;
    if (/^\s*\|?\s*:?[-–]{2,}\s*\|/.test(t)) continue;
    // Header rows for score tables
    if (/^(Category|Component|Dimension|Type)\s+Score(\s+Weight)?/i.test(t)) continue;
    if (/\bWeight(ed)?\s+Status\b/i.test(t)) continue;
    if (/^COMPOSITE\b/i.test(t)) continue;
    if (/^Weighted Total\b/i.test(t)) continue;
    // Dense score rows (multiple x/100)
    const slashHundreds = t.match(/\/100/g) || [];
    if (slashHundreds.length >= 3) continue;
    if (/^\d+\/\d+\s+\d+\/\d+\s+\d+%/.test(t)) continue;
    if (/^\d+\/\d+\s+\d+%\s+\d/.test(t)) continue;
    // Mostly separators
    if (/^[\s|\-–_:]+$/.test(t)) continue;
    out.push(line);
  }
  return out.join("\n");
}

function cleanInlineMarkdown(p: string): string {
  let t = p.replace(/^#{1,6}\s+/gm, "");
  t = t.replace(/\*\*([^*]+)\*\*/g, "$1");
  t = t.replace(/\*([^*]+)\*/g, "$1");
  t = t.replace(/^[\s>*]+\s*/gm, "");
  t = t.replace(/\|/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

/** True if paragraph still looks like a pasted score matrix. */
function isScoreMatrixParagraph(p: string): boolean {
  const n = (p.match(/\d+\/\d+/g) || []).length;
  if (n >= 3 && p.length < 600) return true;
  if (/\b\d+%\s+\d+%\s+\d+%/.test(p)) return true;
  return false;
}

function chunkToParagraphs(chunk: string): string[] {
  const filtered = filterNoiseLines(removeCodeFences(chunk));
  const blocks = filtered.split(/\n\n+/);
  const paras: string[] = [];

  for (const block of blocks) {
    const lines = block.split(/\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;
    const merged = cleanInlineMarkdown(lines.join(" "));
    if (merged.length < 35) continue;
    if (isScoreMatrixParagraph(merged)) continue;
    paras.push(merged);
  }

  return paras;
}

function trimParagraphsToMax(paragraphs: string[], maxLength: number): string[] {
  const out: string[] = [];
  let total = 0;
  for (const p of paragraphs) {
    if (total + p.length + 2 > maxLength && out.length > 0) break;
    out.push(p);
    total += p.length + 2;
    if (total >= maxLength * 0.95) break;
  }
  if (out.length === 0 && paragraphs[0]) {
    const p = paragraphs[0];
    return [p.length <= maxLength ? p : `${p.slice(0, maxLength - 1).trim()}…`];
  }
  return out;
}

/**
 * Paragraphs suitable for PDF (one Text node per paragraph — avoids overlap/clutter).
 */
export function extractScoreJustificationParagraphs(
  markdown: string | undefined | null,
  maxTotalChars: number = DEFAULT_MAX,
): string[] {
  if (!markdown || typeof markdown !== "string" || !markdown.trim()) {
    return ["No structured rationale block was found in the model output."];
  }

  let body = markdown;
  const outputFormatMatch = body.match(/^##\s+Output Format\b/im);
  if (outputFormatMatch && outputFormatMatch.index !== undefined) {
    body = body.slice(outputFormatMatch.index + outputFormatMatch[0].length);
  }

  let bestChunk = "";
  let m: RegExpExecArray | null;
  const re = new RegExp(ANALYSIS_SECTION.source, ANALYSIS_SECTION.flags);
  while ((m = re.exec(body)) !== null) {
    const title = m[1]?.trim() ?? "";
    if (/^output format$/i.test(title)) continue;
    const start = m.index + m[0].length;
    const rest = body.slice(start);
    const stop = rest.search(STOP_MARKERS);
    const chunk = stop >= 0 ? rest.slice(0, stop) : rest;
    if (chunk.length > bestChunk.length) {
      bestChunk = chunk;
    }
  }

  if (!bestChunk) {
    const earlyStop = markdown.search(STOP_MARKERS);
    const fallbackSlice = earlyStop >= 0 ? markdown.slice(0, earlyStop) : markdown;
    bestChunk = fallbackSlice;
  }

  let paragraphs = chunkToParagraphs(bestChunk);
  if (paragraphs.length === 0) {
    const fallback = cleanInlineMarkdown(filterNoiseLines(removeCodeFences(bestChunk)));
    if (fallback.length >= 35 && !isScoreMatrixParagraph(fallback)) {
      paragraphs = [fallback];
    }
  }
  if (paragraphs.length === 0) {
    return ["No structured rationale block was found in the model output."];
  }

  return trimParagraphsToMax(paragraphs, maxTotalChars);
}

/**
 * Single string for admin and backward compatibility (paragraphs joined).
 */
export function extractScoreJustification(
  markdown: string | undefined | null,
  maxLength: number = DEFAULT_MAX,
): string {
  return extractScoreJustificationParagraphs(markdown, maxLength).join("\n\n");
}
