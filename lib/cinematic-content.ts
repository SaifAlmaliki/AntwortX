import type arLocale from "@/locales/ar.json";
import { EXPLODED_PART_LAYOUT, SCROLL_BEAT_LAYOUT } from "@/lib/cinematic-layout";

type CinematicLocale = (typeof arLocale)["cinematic"];

export function getCinematicContent(cinematic: CinematicLocale) {
  const beatCopy = cinematic.scrollBeats as Record<
    string,
    {
      eyebrow: string;
      headline: string;
      sub: string;
      bullets?: string[];
      primaryCta?: { label: string; href: string };
      secondaryCta?: { label: string; href: string };
    }
  >;

  const scrollBeats = SCROLL_BEAT_LAYOUT.map((layout) => ({
    ...layout,
    ...beatCopy[layout.id],
  }));

  const partLabels = cinematic.explodedParts as Record<string, string>;
  const explodedParts = EXPLODED_PART_LAYOUT.map((layout) => ({
    ...layout,
    label: partLabels[layout.id] ?? layout.id,
  }));

  return {
    brand: cinematic.brand,
    nav: cinematic.nav,
    scrollCue: cinematic.scrollCue,
    markets: cinematic.markets,
    features: cinematic.features,
    metrics: cinematic.metrics,
    appShowcase: cinematic.appShowcase,
    rideCta: cinematic.rideCta,
    faq: cinematic.faq,
    finalCta: cinematic.finalCta,
    scrollBeats,
    explodedParts,
  };
}

export type CinematicContent = ReturnType<typeof getCinematicContent>;
