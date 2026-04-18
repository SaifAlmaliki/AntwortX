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

/** Normalize string arrays from JSON; empty input yields []. */
function strArrayFromUnknown(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Merge a typed partial onto a full profile.
 * - `undefined` on a field = leave base unchanged.
 * - Present array (including `[]`) = replace base (explicit clear).
 * - Category: empty string after trim falls back to base.category.
 */
export function mergePositioningPartial(
  base: PositioningProfile,
  patch: Partial<PositioningProfile>
): PositioningProfile {
  return {
    category: (patch.category !== undefined
      ? patch.category.trim() || base.category
      : base.category
    ).slice(0, 200),
    services: patch.services !== undefined ? [...patch.services] : base.services,
    industryVerticals:
      patch.industryVerticals !== undefined ? [...patch.industryVerticals] : base.industryVerticals,
    geographies: patch.geographies !== undefined ? [...patch.geographies] : base.geographies,
    capabilities: patch.capabilities !== undefined ? [...patch.capabilities] : base.capabilities,
    icpSize: patch.icpSize !== undefined ? patch.icpSize : base.icpSize,
    buyerRoles: patch.buyerRoles !== undefined ? [...patch.buyerRoles] : base.buyerRoles,
    differentiators:
      patch.differentiators !== undefined ? [...patch.differentiators] : base.differentiators,
    targetAudience:
      patch.targetAudience !== undefined
        ? patch.targetAudience.slice(0, 300)
        : base.targetAudience,
  };
}

/** Merge a partial positioning payload from the API/UI (unknown JSON) onto an existing profile. */
export function mergeInboundPositioning(
  base: PositioningProfile,
  incoming: unknown
): PositioningProfile {
  if (!incoming || typeof incoming !== "object") return base;
  const o = incoming as Record<string, unknown>;
  const patch: Partial<PositioningProfile> = {};

  if ("category" in o && typeof o.category === "string") {
    patch.category = o.category;
  }
  if ("services" in o && Array.isArray(o.services)) {
    patch.services = strArrayFromUnknown(o.services);
  }
  if ("industryVerticals" in o && Array.isArray(o.industryVerticals)) {
    patch.industryVerticals = strArrayFromUnknown(o.industryVerticals);
  }
  if ("geographies" in o && Array.isArray(o.geographies)) {
    patch.geographies = strArrayFromUnknown(o.geographies);
  }
  if ("capabilities" in o && Array.isArray(o.capabilities)) {
    patch.capabilities = strArrayFromUnknown(o.capabilities);
  }
  if ("icpSize" in o && isPositioningIcpSize(o.icpSize)) {
    patch.icpSize = o.icpSize;
  }
  if ("buyerRoles" in o && Array.isArray(o.buyerRoles)) {
    patch.buyerRoles = strArrayFromUnknown(o.buyerRoles);
  }
  if ("differentiators" in o && Array.isArray(o.differentiators)) {
    patch.differentiators = strArrayFromUnknown(o.differentiators);
  }
  if ("targetAudience" in o && typeof o.targetAudience === "string") {
    patch.targetAudience = o.targetAudience;
  }

  return mergePositioningPartial(base, patch);
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
