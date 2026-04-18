import Anthropic from "@anthropic-ai/sdk";
import type { PositioningProfile, PositioningIcpSize } from "./positioning-types";

export async function extractPositioningFromPage(websiteData: {
  title: string;
  metaDescription: string;
  h1Tags: string[];
  textContent: string;
}): Promise<PositioningProfile | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const content = websiteData.textContent.slice(0, 8000);
  const title = websiteData.title;
  const meta = websiteData.metaDescription;
  const h1 = websiteData.h1Tags.slice(0, 5).join(", ");

  const prompt = `Analyze this website and extract a NICHE positioning profile for GEO / LLM visibility testing.

The business may be in ANY sector (legal, education, healthcare, hospitality, retail, nonprofit, creative services, B2B software, trades, industrial, etc.). We need signals that reflect how real buyers would search — not one-size-fits-all corporate buzzwords.

Title: ${title}
Meta description: ${meta}
Headings: ${h1}
Content preview: ${content}

Return ONLY a JSON object with this exact shape (no markdown, no explanation):
{
  "category": "2-8 word phrase: what they actually sell/do in specific terms (use the site's own language; avoid vague umbrella labels unless the site truly uses nothing else)",
  "services": ["specific offerings or deliverables, up to 6"],
  "industryVerticals": ["markets or sectors they serve, up to 6 — e.g. K-12, family law, dental, SaaS for HR"],
  "geographies": ["regions/countries/cities named on the site, up to 6"],
  "capabilities": ["concrete skills, practice areas, product themes, or methods named on the site, up to 8 — e.g. bilingual curriculum, litigation, CRM implementation, preventive care"],
  "icpSize": "SMB" | "Mid-market" | "Enterprise" | "Mixed",
  "buyerRoles": ["job titles or buyer personas implied on the site, up to 6 — e.g. principal, GC, practice manager, IT director, parent"],
  "differentiators": ["what makes them distinctive vs generic alternatives, up to 6 — e.g. local firm, fixed-fee, accredited, sector specialist"],
  "targetAudience": "one sentence: who buys from them"
}

Rules:
- Prefer SPECIFIC industries, regions, offerings, and roles found in the text over generic consulting or tech jargon unless the site is genuinely that kind of business.
- Do not invent manufacturing, IIoT, MES, or global-strategy-firm positioning if the site does not support it.
- If the site is broad, infer the strongest vertical/geo/audience signals from case studies, footers, or repeated phrases.
- icpSize must be exactly one of: SMB, Mid-market, Enterprise, Mixed — infer from language (enterprise, Fortune 500, SME, mid-market, families, local businesses, etc.).
- Arrays can be empty only if truly absent; otherwise populate from evidence.
- All values must be derived ONLY from the website content provided.`;

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 900,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0]?.type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;

    if (typeof parsed.category !== "string" || !parsed.category.trim()) {
      return null;
    }

    const icpRaw = parsed.icpSize;
    const icpSize: PositioningIcpSize =
      icpRaw === "SMB" || icpRaw === "Mid-market" || icpRaw === "Enterprise" || icpRaw === "Mixed"
        ? icpRaw
        : "Mixed";

    const takeStrings = (key: string, max: number): string[] => {
      const v = parsed[key];
      if (!Array.isArray(v)) return [];
      return v
        .filter((s): s is string => typeof s === "string")
        .map((s) => s.trim())
        .filter((s) => s.length > 1)
        .slice(0, max);
    };

    return {
      category: parsed.category.trim().slice(0, 200),
      services: takeStrings("services", 6),
      industryVerticals: takeStrings("industryVerticals", 6),
      geographies: takeStrings("geographies", 6),
      capabilities: takeStrings("capabilities", 8),
      icpSize,
      buyerRoles: takeStrings("buyerRoles", 6),
      differentiators: takeStrings("differentiators", 6),
      targetAudience:
        typeof parsed.targetAudience === "string"
          ? parsed.targetAudience.trim().slice(0, 300)
          : "",
    };
  } catch {
    return null;
  }
}
