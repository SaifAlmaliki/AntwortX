import Anthropic from "@anthropic-ai/sdk";
import { loadAgent } from "./loader";
import { scoreToGrade } from "./grade";
import type { AgentResult } from "./types";

/** Extract a numeric score from agent markdown output. */
function parseScore(text: string): number {
  // Look for patterns like "Score: 72/100", "**72**/100", "Score: 72", etc.
  const patterns = [
    /(?:overall|geo|composite|total|final)?\s*score[:\s]+(\d{1,3})(?:\/100)?/i,
    /\*\*(\d{1,3})(?:\/100)?\*\*/,
    /(\d{1,3})\/100/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n >= 0 && n <= 100) return n;
    }
  }
  return 50; // default mid-range if unparseable
}

/**
 * Run a single GEO agent via the Anthropic API.
 * Uses the agent's markdown file (agents/<agentName>.md) as the system prompt.
 * The userMessage contains pre-scraped WebsiteData relevant to this agent.
 */
export async function runAgent(
  client: Anthropic,
  agentName: string,
  userMessage: string
): Promise<AgentResult> {
  const systemPrompt = loadAgent(agentName);

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const rawMarkdown =
    response.content[0].type === "text" ? response.content[0].text : "";
  const score = parseScore(rawMarkdown);
  const grade = scoreToGrade(score);

  return { agentName, score, grade, rawMarkdown };
}
