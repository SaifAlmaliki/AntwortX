export interface PageSignals {
  title: string;
  metaDescription: string;
  h1Tags: string[];
  contentSnippets: string[];
}

function extractServicesFromPage(signals: PageSignals): string[] {
  const raw = [
    signals.title,
    signals.metaDescription,
    ...signals.h1Tags,
    ...signals.contentSnippets,
  ].join(" ").toLowerCase();

  const servicePatterns = [
    "ai solutions",
    "artificial intelligence",
    "machine learning",
    "deep learning",
    "natural language processing",
    "nlp",
    "computer vision",
    "rag",
    "retrieval-augmented generation",
    "iiot",
    "industrial iot",
    "iot integration",
    "smart factory",
    "predictive maintenance",
    "data analytics",
    "business intelligence",
    "cloud migration",
    "cloud infrastructure",
    "devops",
    "cybersecurity",
    "automation",
    "robotic process automation",
    "rpa",
    "digital transformation",
    "consulting",
    "software development",
    "api integration",
    "data engineering",
    "data pipeline",
    "knowledge management",
    "enterprise search",
    "workflow automation",
    "edge computing",
    "scada",
    "plc programming",
    "sensor integration",
    "remote monitoring",
    "asset tracking",
    "supply chain optimization",
    "erp integration",
    "crm integration",
    "custom software",
    "saas platform",
    "web application",
    "mobile application",
  ];

  const found = servicePatterns.filter((p) => raw.includes(p));

  const unique = [...new Set(found)];

  if (unique.length === 0) {
    return [];
  }

  return unique.slice(0, 8);
}

export function generateGEOPrompts(
  category: string,
  city: string | null,
  count: number = 5,
  pageSignals?: PageSignals
): string[] {
  const location = city ? ` in ${city}` : "";

  let services: string[] = [];
  if (pageSignals) {
    services = extractServicesFromPage(pageSignals);
  }

  const serviceTemplates = services.length > 0
    ? services.flatMap((s) => [
        `Which companies provide ${s}${location}?`,
        `Best solutions for ${s} for enterprises${location}`,
        `How to implement ${s} for business use cases${location}`,
        `Top providers of ${s}${location}`,
      ])
    : [];

  const genericLongTail = [
    `What are the best ${category} services${location}?`,
    `Which ${category} companies are most trusted${location}?`,
    `Top-rated ${category} for enterprise clients${location}`,
    `How to choose the right ${category} partner${location}`,
    `${category} with proven results${location}`,
    `Leading ${category} companies${location}`,
    `Who are the top ${category} providers${location}?`,
    `Best ${category} for large organizations${location}`,
  ];

  const allTemplates = serviceTemplates.length > 0
    ? [...serviceTemplates, ...genericLongTail]
    : genericLongTail;

  if (count <= 0) {
    return [];
  }

  return [...new Set(allTemplates)].slice(0, Math.min(count, allTemplates.length));
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
      const boundaryRegex = new RegExp(`\\b${key}\\b`, 'i');
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