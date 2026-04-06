export function generateGEOPrompts(
  category: string,
  city: string | null,
  count: number = 5
): string[] {
  const location = city ? ` in ${city}` : "";

  const templates = [
    `What are the best ${category}${location}?`,
    `Top-rated ${category}${location}`,
    `${category} recommendations${location}`,
    `Which ${category} should I choose${location.replace(" in", " near")}?`,
    `Best ${category} with great reviews${location}`,
    `Most popular ${category}${location}`,
    `Trusted ${category}${location}`,
    `Where to find good ${category}${location}`,
    `${category} with best ratings${location}`,
    `Local ${category} suggestions${location}`,
    `What ${category} do locals recommend${location}?`,
    `Best value ${category}${location}`,
    `${location ? `${category} near me` : `Best ${category} nearby`}`,
    `Professional ${category}${location}`,
    `Top 5 ${category}${location}`,
  ];

  if (count <= 0) {
    return templates.slice(0, 5);
  }

  return templates.slice(0, Math.min(count, templates.length));
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
      if (lowerDomain.includes(key)) {
        return value;
      }
    }

    return "businesses";
  } catch {
    return "businesses";
  }
}

export function extractBrandName(
  websiteData: { title?: string; h1Tags?: string[]; domain?: string } | null
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
      const hostname = websiteData.domain.replace(/^https?:\/\//, "").replace(
        "www.",
        ""
      );
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