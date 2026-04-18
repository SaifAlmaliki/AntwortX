import { extractPositioningFromPage } from "./extract-positioning";

export interface ExtractedCategory {
  category: string;
  services: string[];
  targetAudience: string;
}

/** Uses the same LLM pass as full positioning extraction (geo-lead + monitoring). */
export async function extractCategoryFromPage(websiteData: {
  title: string;
  metaDescription: string;
  h1Tags: string[];
  textContent: string;
}): Promise<ExtractedCategory | null> {
  const profile = await extractPositioningFromPage(websiteData);
  if (!profile) return null;
  return {
    category: profile.category.slice(0, 100),
    services: profile.services.slice(0, 6),
    targetAudience: profile.targetAudience.slice(0, 100),
  };
}
