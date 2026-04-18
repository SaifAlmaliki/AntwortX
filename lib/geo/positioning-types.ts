/** ICP size segment for GEO prompt generation */
export type PositioningIcpSize = "SMB" | "Mid-market" | "Enterprise" | "Mixed";

/** Structured brand positioning extracted from the website (or manual override). */
export interface PositioningProfile {
  category: string;
  services: string[];
  industryVerticals: string[];
  geographies: string[];
  capabilities: string[];
  icpSize: PositioningIcpSize;
  buyerRoles: string[];
  differentiators: string[];
  targetAudience: string;
}

/** Cached prompt set stored on `GEOMonitoring.promptSet`. */
export interface PromptSetStored {
  prompts: string[];
  generatedAt: string;
  source: "llm" | "fallback" | "manual";
}

const ICP_VALUES: PositioningIcpSize[] = ["SMB", "Mid-market", "Enterprise", "Mixed"];

export function isPositioningIcpSize(v: unknown): v is PositioningIcpSize {
  return typeof v === "string" && (ICP_VALUES as string[]).includes(v);
}

export function parsePositioningJson(raw: unknown): PositioningProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.category !== "string" || !o.category.trim()) return null;

  const strArr = (k: string, max: number): string[] => {
    const v = o[k];
    if (!Array.isArray(v)) return [];
    return v
      .filter((x): x is string => typeof x === "string")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, max);
  };

  const icp = isPositioningIcpSize(o.icpSize) ? o.icpSize : "Mixed";

  return {
    category: o.category.trim().slice(0, 200),
    services: strArr("services", 8),
    industryVerticals: strArr("industryVerticals", 8),
    geographies: strArr("geographies", 8),
    capabilities: strArr("capabilities", 10),
    icpSize: icp,
    buyerRoles: strArr("buyerRoles", 8),
    differentiators: strArr("differentiators", 8),
    targetAudience:
      typeof o.targetAudience === "string" ? o.targetAudience.trim().slice(0, 300) : "",
  };
}

export function parsePromptSetJson(raw: unknown): PromptSetStored | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (!Array.isArray(o.prompts)) return null;
  const prompts = o.prompts
    .filter((p): p is string => typeof p === "string")
    .map((p) => p.trim())
    .filter(Boolean);
  if (prompts.length === 0) return null;
  const source =
    o.source === "llm" || o.source === "fallback" || o.source === "manual"
      ? o.source
      : "fallback";
  const generatedAt =
    typeof o.generatedAt === "string" ? o.generatedAt : new Date().toISOString();
  return { prompts, generatedAt, source };
}

/** Minimal profile when extraction fails — still better than pure head-term. */
/** Merge a partial positioning payload from the API/UI onto an existing profile. */
export function mergeInboundPositioning(
  base: PositioningProfile,
  incoming: unknown
): PositioningProfile {
  if (!incoming || typeof incoming !== "object") return base;
  const o = incoming as Record<string, unknown>;
  const partial: Partial<PositioningProfile> = {};

  if (typeof o.category === "string" && o.category.trim()) partial.category = o.category.trim();
  if (Array.isArray(o.services)) partial.services = o.services.filter((x): x is string => typeof x === "string").map((s) => s.trim()).filter(Boolean);
  if (Array.isArray(o.industryVerticals)) partial.industryVerticals = o.industryVerticals.filter((x): x is string => typeof x === "string").map((s) => s.trim()).filter(Boolean);
  if (Array.isArray(o.geographies)) partial.geographies = o.geographies.filter((x): x is string => typeof x === "string").map((s) => s.trim()).filter(Boolean);
  if (Array.isArray(o.capabilities)) partial.capabilities = o.capabilities.filter((x): x is string => typeof x === "string").map((s) => s.trim()).filter(Boolean);
  if (isPositioningIcpSize(o.icpSize)) partial.icpSize = o.icpSize;
  if (Array.isArray(o.buyerRoles)) partial.buyerRoles = o.buyerRoles.filter((x): x is string => typeof x === "string").map((s) => s.trim()).filter(Boolean);
  if (Array.isArray(o.differentiators)) partial.differentiators = o.differentiators.filter((x): x is string => typeof x === "string").map((s) => s.trim()).filter(Boolean);
  if (typeof o.targetAudience === "string") partial.targetAudience = o.targetAudience;

  return {
    category: (partial.category ?? base.category).slice(0, 200),
    services: partial.services?.length ? partial.services : base.services,
    industryVerticals: partial.industryVerticals?.length
      ? partial.industryVerticals
      : base.industryVerticals,
    geographies: partial.geographies?.length ? partial.geographies : base.geographies,
    capabilities: partial.capabilities?.length ? partial.capabilities : base.capabilities,
    icpSize: partial.icpSize ?? base.icpSize,
    buyerRoles: partial.buyerRoles?.length ? partial.buyerRoles : base.buyerRoles,
    differentiators: partial.differentiators?.length
      ? partial.differentiators
      : base.differentiators,
    targetAudience: (partial.targetAudience ?? base.targetAudience).slice(0, 300),
  };
}

export function minimalPositioningFromCategory(
  category: string,
  brandName: string
): PositioningProfile {
  return {
    category: category.trim() || "business services",
    services: [],
    industryVerticals: [],
    geographies: [],
    capabilities: [category.trim()].filter(Boolean),
    icpSize: "Mixed",
    buyerRoles: [],
    differentiators: brandName ? ["boutique or specialized provider"] : [],
    targetAudience: "",
  };
}
