import Anthropic from "@anthropic-ai/sdk";
import type { PositioningProfile } from "@/lib/geo/positioning-types";
import { minimalPositioningFromCategory } from "@/lib/geo/positioning-types";

export type PromptGenerationSource = "llm" | "fallback";

export interface PromptGenerationResult {
  prompts: string[];
  source: PromptGenerationSource;
}

const MIN_PROMPTS = 8;
const DEFAULT_COUNT = 10;

function pick<T>(arr: T[], i: number): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[i % arr.length];
}

/** Deterministic prompts when the LLM is unavailable — wording comes only from the profile (any industry). */
export function generateFallbackPrompts(
  profile: PositioningProfile,
  brandName: string,
  count: number = DEFAULT_COUNT
): string[] {
  const vertical =
    profile.industryVerticals[0] || profile.category || "this field";
  const vertical2 = profile.industryVerticals[1] || profile.category;
  const geo = profile.geographies[0] || "";
  const geo2 = profile.geographies[1];
  const cap = profile.capabilities[0] || profile.services[0] || profile.category;
  const cap2 = profile.capabilities[1] || profile.services[1] || "";
  const role = profile.buyerRoles[0] || "";
  const diff = profile.differentiators[0] || "well-regarded";
  const icp = profile.icpSize;
  const audience = profile.targetAudience.trim();
  const geoPhrase = [geo, geo2].filter(Boolean).join(" and ");
  const capPair = [cap, cap2].filter(Boolean).join(" and ");
  const geoTail = geoPhrase || "our area";

  const templates: string[] = [];

  if (geoPhrase && vertical) {
    templates.push(`Who are strong ${profile.category} options in ${geoPhrase}?`);
  }
  if (vertical && geo) {
    templates.push(`Top recommendations for ${vertical} in ${geo} — who should we shortlist?`);
  }
  if (capPair && vertical) {
    templates.push(`Looking for help with ${capPair} for ${vertical} — who stands out?`);
  }
  if (role && vertical) {
    templates.push(`I'm a ${role} — how do I choose ${cap} for ${vertical}?`);
  }
  if (icp && vertical) {
    templates.push(`Best ${icp.toLowerCase()} ${vertical} providers for ${profile.category} — who fits?`);
  }
  if (vertical && profile.services[0]) {
    templates.push(`Who offers ${profile.services[0]} for ${vertical} clients?`);
  }
  if (audience) {
    templates.push(`Recommendations for ${audience} who need ${profile.category}.`);
  }
  templates.push(`${diff} ${profile.category} providers in ${geoTail} — who do you suggest?`);
  templates.push(`Compare ${cap} options for ${vertical2} in ${geo || "our region"}.`);
  templates.push(`Is ${brandName} a good fit for our ${profile.category} needs?`);
  templates.push(
    `Trusted ${profile.category} partners ${geo ? `in ${geo}` : "we should evaluate"} — names?`
  );
  if (profile.services[2]) {
    templates.push(`Who handles ${profile.services[2]} well for organizations like ours?`);
  }

  // De-duplicate while preserving order
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of templates) {
    const t = p.replace(/\s+/g, " ").trim();
    if (t.length < 12 || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
    if (out.length >= count) break;
  }

  let i = 0;
  while (out.length < count) {
    const g = pick(profile.geographies, i) || "our region";
    const ind =
      pick(profile.industryVerticals, i) || profile.category || "our situation";
    const c = pick(profile.capabilities, i) || pick(profile.services, i) || profile.category;
    const candidate = `Who should we consider for ${c} (${ind}, ${g})?`;
    if (!seen.has(candidate)) {
      seen.add(candidate);
      out.push(candidate);
    }
    i++;
    if (i > 40) break;
  }

  return out.slice(0, Math.max(MIN_PROMPTS, count));
}

export async function generatePromptsFromPositioning(
  profile: PositioningProfile,
  brandName: string,
  count: number = DEFAULT_COUNT
): Promise<PromptGenerationResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const n = Math.min(Math.max(count, MIN_PROMPTS), 18);

  if (!apiKey) {
    return {
      prompts: generateFallbackPrompts(profile, brandName, n),
      source: "fallback",
    };
  }

  const profileJson = JSON.stringify(profile, null, 2);

  const userPrompt = `Brand name: ${brandName}

Positioning profile (JSON) — this may describe ANY industry (legal, education, healthcare, retail, nonprofit, local services, B2B software, industrial, etc.):
${profileJson}

Generate exactly ${n} realistic user prompts that people would type into ChatGPT, Perplexity, or Google AI when looking for providers or solutions like this brand.

Mix across these intent patterns — use a pattern only when the profile JSON gives you enough to ground it; skip patterns with no support in the data:
1) Vertical or practice area + geography (use industryVerticals + geographies; e.g. estate planning attorneys in Ohio, bilingual primary schools in Madrid, pediatric clinics accepting new patients in Toronto).
2) Service or capability + audience or vertical (use services, capabilities, targetAudience, industryVerticals).
3) Role- or persona-based question (use buyerRoles + geographies when present).
4) Boutique, local, specialized, or “alternatives to huge vendors” framing (use differentiators + icpSize when present). Do not name global consultancies or tech megabrands unless they clearly fit that industry.
5) Branded evaluation: at most ${Math.max(1, Math.floor(n * 0.15))} prompts may include the exact brand name "${brandName}".

Hard rules:
- Every prompt must be grounded in the JSON above. Do not assume manufacturing, IIoT, MES, industrial tech, “digital transformation” consulting, or any sector not supported by the profile.
- Do not copy the illustrative examples literally; they show shape only. Use the actual words and segments from the profile.
- Avoid empty generic head terms (e.g. “best software” with no audience/geo/practice named) unless the profile truly is that broad.
- No numbering or bullets in the output strings.
- Each prompt is one line, natural language, 12–180 characters ideally.
- Return ONLY a JSON array of ${n} strings, no markdown, no keys, no explanation.`;

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1200,
      temperature: 0.4,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content[0]?.type === "text" ? response.content[0].text : "";
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (!arrayMatch) {
      return {
        prompts: generateFallbackPrompts(profile, brandName, n),
        source: "fallback",
      };
    }

    const parsed = JSON.parse(arrayMatch[0]) as unknown;
    if (!Array.isArray(parsed)) {
      return {
        prompts: generateFallbackPrompts(profile, brandName, n),
        source: "fallback",
      };
    }

    const prompts = parsed
      .filter((p): p is string => typeof p === "string")
      .map((p) => p.trim())
      .filter((p) => p.length > 8);

    if (prompts.length < MIN_PROMPTS) {
      return {
        prompts: generateFallbackPrompts(profile, brandName, n),
        source: "fallback",
      };
    }

    return { prompts: prompts.slice(0, n), source: "llm" };
  } catch {
    return {
      prompts: generateFallbackPrompts(profile, brandName, n),
      source: "fallback",
    };
  }
}

/** @deprecated Use generatePromptsFromPositioning + positioning profile. */
export class PromptGenerator {
  static generatePrompts(category: string, brandName: string, count: number = 10): string[] {
    const profile = minimalPositioningFromCategory(category, brandName);
    return generateFallbackPrompts(profile, brandName, count);
  }
}
