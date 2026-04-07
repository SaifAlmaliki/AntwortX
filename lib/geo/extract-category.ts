import Anthropic from "@anthropic-ai/sdk";

export interface ExtractedCategory {
  category: string;
  services: string[];
  targetAudience: string;
}

export async function extractCategoryFromPage(
  websiteData: {
    title: string;
    metaDescription: string;
    h1Tags: string[];
    textContent: string;
  }
): Promise<ExtractedCategory | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const content = websiteData.textContent.slice(0, 5000);
  const title = websiteData.title;
  const meta = websiteData.metaDescription;
  const h1 = websiteData.h1Tags.slice(0, 3).join(", ");

  const prompt = `Analyze this website and extract its business category, primary services, and target audience.

Title: ${title}
Meta description: ${meta}
Headings: ${h1}
Content preview: ${content}

Return ONLY a JSON object with this exact shape (no markdown, no explanation):
{
  "category": "A concise 2-5 word description of what this business does, e.g., 'AI-powered hiring platform'",
  "services": ["service 1", "service 2", "service 3", "service 4"],
  "targetAudience": "Who this business serves, e.g., 'enterprise HR teams' or 'mid-market tech companies'"
}

Rules:
- category must be a natural language phrase, not a single word
- services must be specific capabilities, not generic terms like "consulting" or "software"
- targetAudience must identify the buyer persona or industry segment
- All values must be derived ONLY from the website content provided`;

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0]?.type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);

    if (typeof parsed.category !== "string" || !Array.isArray(parsed.services)) {
      return null;
    }

    return {
      category: parsed.category.trim().slice(0, 100),
      services: parsed.services
        .filter((s: unknown) => typeof s === "string")
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 2)
        .slice(0, 6),
      targetAudience: typeof parsed.targetAudience === "string"
        ? parsed.targetAudience.trim().slice(0, 100)
        : "",
    };
  } catch {
    return null;
  }
}
