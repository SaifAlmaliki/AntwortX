"use client";

import { SmoothScroll } from "./SmoothScroll";
import { ProductNav } from "./ProductNav";
import { HeroFilm } from "./HeroFilm";
import { LogoStrip } from "./LogoStrip";
import { FeatureFilm } from "./FeatureFilm";
import { Metrics } from "./Metrics";
import { ProductShowcase } from "./ProductShowcase";
import { RideCtaSection } from "./RideCtaSection";
import { Faq } from "./Faq";
import { FinalCta } from "./FinalCta";

/**
 * Cinematic landing for Blyzk micromobility —
 * scroll-driven scooter showcase with bilingual navigation.
 */
export function CinematicLanding() {
  return (
    <div className="w-full bg-[#050505] text-white" style={{ overflowX: "clip" }}>
      <SmoothScroll />
      <ProductNav />
      <HeroFilm />
      <LogoStrip />
      <FeatureFilm />
      <Metrics />
      <RideCtaSection />
      <ProductShowcase />
      <Faq />
      <FinalCta />
    </div>
  );
}
