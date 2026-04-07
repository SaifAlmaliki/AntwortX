/**
 * Shared utilities for extracting structured data from agent markdown output.
 */

export interface ExtractedAction {
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  text: string;
}

const PRIORITY_WEIGHT: Record<string, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

/**
 * Extract "Priority Actions" sections from agent markdown output.
 * Returns actions sorted by priority (CRITICAL first).
 *
 * @param markdown - Raw markdown from an agent
 * @param limit - Max actions to extract (default: 10)
 */
export function extractPriorityActions(markdown: string, limit = 10): ExtractedAction[] {
  const lines = markdown.split("\n");
  const actions: ExtractedAction[] = [];
  let inActions = false;

  for (const line of lines) {
    if (/priority actions/i.test(line)) {
      inActions = true;
      continue;
    }
    if (inActions && line.startsWith("#")) {
      break;
    }
    if (inActions && (/^\d+\.\s/.test(line) || /^[-*]\s/.test(line))) {
      const clean = line.replace(/^[\d\-*.]+\s*/, "").replace(/\*\*/g, "").trim();
      if (clean.length > 10) {
        const match = clean.match(/^\[(CRITICAL|HIGH|MEDIUM|LOW)\]/i);
        const priority = match
          ? (match[1].toUpperCase() as ExtractedAction["priority"])
          : "LOW";
        const text = clean.replace(/^\[(CRITICAL|HIGH|MEDIUM|LOW)\]\s*/gi, "").trim();
        actions.push({ priority, text });
      }
    }
    if (actions.length >= limit) break;
  }

  return actions;
}

/**
 * Extract top pain points across all agents, sorted by priority weight.
 *
 * @param agents - Record of agent results with rawMarkdown
 * @param limit - Max pain points to return (default: 5)
 * @param agentLabels - Optional map of agent key → display label
 */
export function extractTopPains(
  agents: Record<string, { rawMarkdown?: string }>,
  limit = 5,
  agentLabels?: Record<string, string>
): string[] {
  const pains: { weight: number; text: string }[] = [];

  for (const [key, agent] of Object.entries(agents)) {
    if (!agent?.rawMarkdown) continue;

    const actions = extractPriorityActions(agent.rawMarkdown);
    for (const action of actions) {
      const weight = PRIORITY_WEIGHT[action.priority] || 0;
      const label = agentLabels?.[key] || key;
      pains.push({ weight, text: `${label}: ${action.text}` });
    }
  }

  return pains
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit)
    .map((p) => p.text);
}
