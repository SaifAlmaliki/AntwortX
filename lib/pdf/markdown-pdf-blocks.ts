/**
 * Split GEO agent markdown into blocks for PDF rendering.
 * Handles GitHub-flavored markdown pipe tables (otherwise they show as raw |---| lines).
 */

export type MarkdownPdfBlock =
  | { type: "line"; line: string }
  | { type: "table"; headers: string[]; rows: string[][] };

/** Split a pipe-delimited markdown table row into cells (outer |…| stripped). */
export function parsePipeTableRow(line: string): string[] {
  const t = line.trim();
  if (!t.startsWith("|")) return [];
  const inner = t.endsWith("|") ? t.slice(1, -1) : t.slice(1);
  return inner.split("|").map((c) => c.trim());
}

function isMarkdownTableSeparator(cells: string[]): boolean {
  if (cells.length === 0) return false;
  return cells.every((c) => /^:?-{2,}:?$/.test(c.trim()));
}

function looksLikeTableRow(line: string): boolean {
  const t = line.trim();
  return t.startsWith("|") && t.lastIndexOf("|") > 0;
}

function parseTableBlock(lines: string[]): { headers: string[]; rows: string[][] } | null {
  if (lines.length === 0) return null;
  const first = parsePipeTableRow(lines[0]);
  if (first.length === 0) return null;

  if (lines.length >= 2) {
    const second = parsePipeTableRow(lines[1]);
    if (second.length > 0 && isMarkdownTableSeparator(second)) {
      const dataLines = lines.slice(2);
      const rows = dataLines.map(parsePipeTableRow).filter((r) => r.length > 0);
      return { headers: first, rows };
    }
  }

  // No separator row: treat all lines as body rows (no dedicated header row)
  const rows = lines.map(parsePipeTableRow).filter((r) => r.length > 0);
  if (rows.length === 0) return null;
  return { headers: rows[0], rows: rows.slice(1) };
}

/**
 * Convert non-empty markdown lines into line + table blocks (in order).
 */
export function markdownLinesToPdfBlocks(lines: string[]): MarkdownPdfBlock[] {
  const blocks: MarkdownPdfBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (looksLikeTableRow(line)) {
      const tableLines: string[] = [];
      while (i < lines.length && looksLikeTableRow(lines[i])) {
        tableLines.push(lines[i]);
        i++;
      }
      const parsed = parseTableBlock(tableLines);
      if (parsed && (parsed.headers.length > 0 || parsed.rows.length > 0)) {
        const colCount = Math.max(
          parsed.headers.length,
          ...parsed.rows.map((r) => r.length),
          1
        );
        const norm = (cells: string[]) =>
          Array.from({ length: colCount }, (_, j) => cells[j] ?? "");
        blocks.push({
          type: "table",
          headers: norm(parsed.headers),
          rows: parsed.rows.map(norm),
        });
      } else {
        for (const tl of tableLines) {
          blocks.push({ type: "line", line: tl });
        }
      }
      continue;
    }

    blocks.push({ type: "line", line });
    i++;
  }

  return blocks;
}

/** Strip common inline markdown markers for PDF text. */
export function stripInlineMarkdownForPdf(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`+/g, "")
    .trim();
}
