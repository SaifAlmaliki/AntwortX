import type { AgentResults, CompositeScore } from "./types";
import { scoreToGrade } from "./grade";

/**
 * Compute the composite GEO score from the 5 agent results.
 *
 * Weights from skills/geo-audit/SKILL.md:
 *   AI Citability     25%  → visibility agent
 *   Brand Authority   20%  → visibility agent (brand sub-score approximated)
 *   Content E-E-A-T   20%  → content agent
 *   Technical GEO     15%  → technical agent
 *   Schema            10%  → schema agent
 *   Platform          10%  → platform agent
 *
 * Since the visibility agent covers both Citability (25%) and Brand (20%),
 * we weight it at 45% and split the remaining weights across the other agents.
 */
export function computeCompositeScore(agents: AgentResults): CompositeScore {
  const { visibility, content, technical, platform, schema } = agents;

  // visibility covers citability (25%) + brand (20%) = 45% total
  const overall = Math.round(
    visibility.score * 0.45 +
      content.score * 0.20 +
      technical.score * 0.15 +
      schema.score * 0.10 +
      platform.score * 0.10
  );

  return {
    overall,
    grade: scoreToGrade(overall),
    breakdown: {
      citability: visibility.score, // AI visibility covers citability
      brand: visibility.score,      // and brand authority
      eeat: content.score,
      technical: technical.score,
      schema: schema.score,
      platform: platform.score,
    },
  };
}
