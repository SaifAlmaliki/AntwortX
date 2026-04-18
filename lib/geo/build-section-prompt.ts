import { extractPriorityActions, type ExtractedAction } from "@/lib/geo/extract-actions";

/** Display labels for GEO audit sections (single source for UI + prompt builder). */
export const SECTION_AGENT_LABELS: Record<string, string> = {
  visibility: "AI Visibility & Citability",
  content: "Content Quality (E-E-A-T)",
  technical: "Technical GEO",
  rag: "RAG Readiness",
  schema: "Schema & Structured Data",
  platform: "Platform Optimization",
};

const RAW_MARKDOWN_MAX = 8000;

export interface SectionPromptLeadContext {
  websiteUrl: string;
  company?: string | null;
  category?: string | null;
  city?: string | null;
}

export interface SectionPromptAgentInput {
  score: number;
  grade: string;
  rawMarkdown?: string;
}

function formatPainPoints(actions: ExtractedAction[]): string {
  if (actions.length === 0) {
    return "(No Priority Actions list was parsed from this agent output — rely on the diagnosis block above.)";
  }
  return actions
    .map((a) => `- [${a.priority}] ${a.text}`)
    .join("\n");
}

function trimMarkdown(markdown: string, max: number): string {
  if (markdown.length <= max) return markdown;
  return `${markdown.slice(0, max - 1).trimEnd()}…\n\n[Truncated — original length ${markdown.length} chars]`;
}

/**
 * Builds a self-contained LLM prompt for remediating one GEO audit section.
 */
export function buildSectionPrompt(
  sectionKey: string,
  agent: SectionPromptAgentInput,
  lead: SectionPromptLeadContext,
): string {
  const label = SECTION_AGENT_LABELS[sectionKey] ?? sectionKey;
  const raw = agent.rawMarkdown?.trim() ?? "";
  const diagnosis = raw ? trimMarkdown(raw, RAW_MARKDOWN_MAX) : "(No raw diagnosis text stored for this section.)";
  const actions = extractPriorityActions(raw);
  const painPoints = formatPainPoints(actions);

  const company = lead.company?.trim() || "(not provided)";
  const category = lead.category?.trim() || "(not provided)";
  const location = lead.city?.trim() || "(not provided)";

  return `You are a GEO (Generative Engine Optimization) remediation specialist.

SITE: ${lead.websiteUrl}
COMPANY: ${company}
CATEGORY: ${category}
LOCATION: ${location}

AUDIT SECTION: ${label}
CONTEXT (reference only — focus on what to fix, not chasing a number): ${agent.score}/100 (${agent.grade})

=== CURRENT DIAGNOSIS (verbatim from audit) ===
${diagnosis}

=== PARSED PAIN POINTS ===
${painPoints}

=== YOUR TASK ===
Produce a concrete, prioritized remediation plan for THIS SECTION ONLY ("${label}").
For each pain point above (or each major issue in the diagnosis if parsing was empty):
  1. Root cause — why this specific issue drags the section down.
  2. Concrete fix — exact file / page / schema / content change. Include example copy, JSON-LD snippets, headers, or URLs where relevant.
  3. Expected impact — which sub-signal of "${label}" it improves and how to verify.
  4. Owner — content, eng, or SEO.
  5. Effort — S / M / L.

Rules:
- Do NOT recommend anything outside the scope of "${label}".
- Do NOT give generic SEO advice; every action must tie to a pain point or issue in the diagnosis above.
- Group output as: Quick wins (< 1 day), Structural fixes (1–2 weeks), Strategic (> 2 weeks).
- End with a verification checklist (how to confirm each fix landed).`;
}
