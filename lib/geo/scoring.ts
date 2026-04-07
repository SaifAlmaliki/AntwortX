import type { AgentResults, CompositeScore } from "./types";
import { scoreToGrade } from "./grade";

/**
 * Compute the composite GEO score from the 6 agent results.
 *
 * Updated weights (Phase 1 — RAG Readiness added):
 *   AI Citability     25%  → visibility agent
 *   Brand Authority   10%  → visibility agent (brand sub-score approximated)
 *   Content E-E-A-T   20%  → content agent
 *   Technical GEO     15%  → technical agent
 *   RAG Readiness     10%  → rag agent
 *   Schema            10%  → schema agent
 *   Platform          10%  → platform agent
 */
export function computeCompositeScore(agents: AgentResults): CompositeScore {
  const { visibility, content, technical, platform, schema, rag } = agents;

  const overall = Math.round(
    visibility.score * 0.35 +
      content.score * 0.20 +
      technical.score * 0.15 +
      rag.score * 0.10 +
      schema.score * 0.10 +
      platform.score * 0.10
  );

  return {
    overall,
    grade: scoreToGrade(overall),
    breakdown: {
      citability: visibility.score,
      brand: visibility.score,
      eeat: content.score,
      technical: technical.score,
      rag: rag.score,
      schema: schema.score,
      platform: platform.score,
    },
  };
}
