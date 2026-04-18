import { prisma } from "@/lib/db";
import { fetchWebsite } from "@/lib/geo/fetch-website";
import { extractPositioningFromPage } from "@/lib/geo/extract-positioning";
import type { PositioningProfile } from "@/lib/geo/positioning-types";
import {
  mergePositioningPartial,
  minimalPositioningFromCategory,
  parsePositioningJson,
  parsePromptSetJson,
  type PromptSetStored,
} from "@/lib/geo/positioning-types";
import {
  generatePromptsFromPositioning,
  generateFallbackPrompts,
} from "@/lib/geo-engines/prompt-generator";

const MIN_CACHED_PROMPTS = 8;

/** Fields required to resolve or generate prompts for a GEO check. */
export type MonitoringPromptFields = {
  id: string;
  brandName: string;
  websiteUrl: string;
  category: string;
  positioning: unknown;
  promptSet: unknown;
};

async function persistPromptSet(
  monitoringId: string,
  prompts: string[],
  source: PromptSetStored["source"]
): Promise<void> {
  const payload: PromptSetStored = {
    prompts,
    generatedAt: new Date().toISOString(),
    source,
  };
  await prisma.gEOMonitoring.update({
    where: { id: monitoringId },
    data: { promptSet: JSON.parse(JSON.stringify(payload)) as object },
  });
}

/**
 * Extract positioning from the site (optional), persist profile + generated prompt set.
 * @param reExtractWebsite when true (default), fetch URL and run LLM extraction; when false, start from DB `positioning` or category fallback.
 */
export async function refreshPositioningAndPrompts(
  monitoringId: string,
  options: {
    websiteUrl?: string;
    /** Default true — set false for "regenerate prompts only" from saved positioning. */
    reExtractWebsite?: boolean;
    positioningOverride?: Partial<PositioningProfile> | null;
    /** When set, skip fetch/extract and use this profile as the source of truth (e.g. manual save from UI). */
    explicitProfile?: PositioningProfile | null;
  } = {}
): Promise<void> {
  const row = await prisma.gEOMonitoring.findUnique({ where: { id: monitoringId } });
  if (!row) return;

  const url = options.websiteUrl ?? row.websiteUrl;
  const reExtract = options.reExtractWebsite !== false;

  let profile: PositioningProfile;

  if (options.explicitProfile) {
    profile = options.explicitProfile;
  } else {
    profile =
      parsePositioningJson(row.positioning) ??
      minimalPositioningFromCategory(row.category, row.brandName);

    if (reExtract) {
      try {
        const site = await fetchWebsite(url);
        const extracted = await extractPositioningFromPage({
          title: site.title,
          metaDescription: site.metaDescription ?? "",
          h1Tags: site.h1Tags,
          textContent: site.textContent,
        });
        if (extracted) {
          profile = options.positioningOverride
            ? mergePositioningPartial(extracted, options.positioningOverride)
            : extracted;
        } else if (options.positioningOverride) {
          profile = mergePositioningPartial(profile, options.positioningOverride);
        }
      } catch (e) {
        console.error("refreshPositioningAndPrompts fetch/extract:", e);
        if (options.positioningOverride) {
          profile = mergePositioningPartial(profile, options.positioningOverride);
        }
      }
    } else if (options.positioningOverride) {
      profile = mergePositioningPartial(profile, options.positioningOverride);
    }
  }

  await prisma.gEOMonitoring.update({
    where: { id: monitoringId },
    data: {
      positioning: JSON.parse(JSON.stringify(profile)) as object,
    },
  });

  const { prompts, source } = await generatePromptsFromPositioning(
    profile,
    row.brandName,
    10
  );
  await persistPromptSet(monitoringId, prompts, source);
}

/** Resolve prompts for a check: use cache if sufficient; else generate and cache. */
export async function getPromptsForMonitoringRun(
  monitoring: MonitoringPromptFields
): Promise<string[]> {
  const cached = parsePromptSetJson(monitoring.promptSet);
  if (cached && cached.prompts.length >= MIN_CACHED_PROMPTS) {
    return cached.prompts.slice(0, 15);
  }

  const profile =
    parsePositioningJson(monitoring.positioning) ??
    minimalPositioningFromCategory(monitoring.category, monitoring.brandName);

  let prompts: string[];
  let source: PromptSetStored["source"];

  try {
    const result = await generatePromptsFromPositioning(
      profile,
      monitoring.brandName,
      10
    );
    prompts = result.prompts;
    source = result.source;
  } catch {
    prompts = generateFallbackPrompts(profile, monitoring.brandName, 10);
    source = "fallback";
  }

  await persistPromptSet(monitoring.id, prompts, source);
  return prompts;
}
