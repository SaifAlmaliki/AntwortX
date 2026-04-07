/** Strip a trailing "solutions" so templates do not produce "X solutions solutions". */
function stripTrailingSolutions(phrase: string): string {
  return phrase.replace(/\s+solutions\s*$/i, "").trim();
}

function servicePromptTemplates(service: string, location: string): string[] {
  const raw = service.trim();
  if (raw.length < 2) return [];
  const forBest = stripTrailingSolutions(raw);
  const bestCore = forBest.length > 0 ? forBest : raw;
  return [
    `Which companies provide ${raw} for businesses${location}?`,
    `Best ${bestCore} solutions for enterprise teams${location}`,
    `Top providers of ${raw}${location}`,
  ];
}

function categoryPromptTemplates(category: string, location: string): string[] {
  const c = category.trim();
  if (c.length < 2) return [];
  return [
    `What are the best ${c} solutions${location}?`,
    `Which ${c} companies are most trusted${location}?`,
    `Top-rated ${c} for enterprise clients${location}`,
    `How to choose the right ${c} partner${location}`,
    `Leading ${c} providers${location}`,
    `Who are the top ${c} companies${location}?`,
  ];
}

function normalizeCategoryKey(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export interface GenerateGEOPromptsParams {
  userCategory: string;
  extractedCategory?: string | null;
  llmServices: string[];
  city: string | null;
  count?: number;
}

/**
 * Build customer-style search prompts for LLM presence checks.
 * Blends the lead's category with extracted site category/services and interleaves
 * so results are not always dominated by the first extracted service only.
 */
export function generateGEOPrompts({
  userCategory,
  extractedCategory = null,
  llmServices,
  city,
  count = 5,
}: GenerateGEOPromptsParams): string[] {
  const location = city ? ` in ${city}` : "";

  const userPool = categoryPromptTemplates(userCategory, location);
  const servicePool = llmServices.flatMap((s) => servicePromptTemplates(s, location));

  const ec = extractedCategory?.trim() ?? "";
  const useExtracted =
    ec.length > 0 && normalizeCategoryKey(ec) !== normalizeCategoryKey(userCategory);
  const extPool = useExtracted ? categoryPromptTemplates(ec, location) : [];

  if (count <= 0) {
    return [];
  }

  const seen = new Set<string>();
  const out: string[] = [];

  const pushUnique = (prompt: string) => {
    if (seen.has(prompt)) return false;
    seen.add(prompt);
    out.push(prompt);
    return true;
  };

  const hasMultipleSources = servicePool.length > 0 || extPool.length > 0;

  if (hasMultipleSources && count >= 2 && userPool.length > 0) {
    let userTaken = 0;
    for (const p of userPool) {
      if (out.length >= count || userTaken >= 2) break;
      if (pushUnique(p)) userTaken++;
    }
  }

  const pools = [servicePool, extPool, userPool].filter((p) => p.length > 0);
  const cursors = pools.map(() => 0);

  while (out.length < count) {
    let added = false;
    for (let i = 0; i < pools.length; i++) {
      if (out.length >= count) break;
      while (cursors[i] < pools[i].length) {
        const item = pools[i][cursors[i]++];
        if (pushUnique(item)) {
          added = true;
          break;
        }
      }
    }
    if (!added) break;
  }

  return out;
}

export function extractCategoryFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const domain = hostname.replace("www.", "").split(".")[0];

    const categoryHints: Record<string, string> = {
      restaurant: "restaurants",
      ristorante: "restaurants",
      cafe: "cafes",
      coffee: "coffee shops",
      hotel: "hotels",
      hoteles: "hotels",
      pizzeria: "pizza restaurants",
      pizza: "pizza places",
      sushi: "sushi restaurants",
      bar: "bars",
      pub: "pubs",
      spa: "spas",
      gym: "gyms",
      fitness: "fitness centers",
      salons: "hair salons",
      salon: "hair salons",
      dentist: "dentists",
      doctor: "doctors",
      clinic: "medical clinics",
      lawyer: "lawyers",
      attorney: "attorneys",
      agency: "agencies",
      consult: "consultants",
      software: "software companies",
      tech: "technology companies",
      shop: "shops",
      store: "stores",
      market: "markets",
      auto: "auto services",
      car: "car services",
      real: "real estate agencies",
      property: "real estate",
      travel: "travel agencies",
      tour: "tours",
      school: "schools",
      education: "educational institutions",
      university: "universities",
      college: "colleges",
    };

    const lowerDomain = domain.toLowerCase();
    for (const [key, value] of Object.entries(categoryHints)) {
      const boundaryRegex = new RegExp(`\\b${key}\\b`, "i");
      if (boundaryRegex.test(lowerDomain)) {
        return value;
      }
    }

    return "businesses";
  } catch {
    return "businesses";
  }
}

export function extractBrandName(
  websiteData: { title?: string; h1Tags?: string[]; domain?: string } | null,
): string | null {
  if (!websiteData) {
    return null;
  }

  if (websiteData.title) {
    const titleParts = websiteData.title.split(/[-|–—]/);
    if (titleParts.length > 0) {
      const brandFromTitle = titleParts[0].trim();
      if (brandFromTitle.length > 0 && brandFromTitle.length < 100) {
        return brandFromTitle;
      }
    }
  }

  if (
    websiteData.h1Tags &&
    Array.isArray(websiteData.h1Tags) &&
    websiteData.h1Tags.length > 0
  ) {
    const firstH1 = websiteData.h1Tags[0];
    if (firstH1 && firstH1.length > 0 && firstH1.length < 100) {
      return firstH1;
    }
  }

  if (websiteData.domain) {
    try {
      const hostname = websiteData.domain.replace(/^https?:\/\//, "").replace("www.", "");
      const domainPart = hostname.split(".")[0];
      if (domainPart && domainPart.length > 0) {
        return domainPart.charAt(0).toUpperCase() + domainPart.slice(1);
      }
    } catch {
      // Ignore
    }
  }

  return null;
}
