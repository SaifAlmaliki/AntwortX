"use client";

import { SmoothScroll } from "./SmoothScroll";
import { HeroFilm } from "./HeroFilm";
import { LogoStrip } from "./LogoStrip";
import { FeatureFilm } from "./FeatureFilm";
import { Metrics } from "./Metrics";
import { ProductShowcase } from "./ProductShowcase";
import { GeoLeadSection } from "@/components/GeoLeadSection";
import { Faq } from "./Faq";
import { FinalCta } from "./FinalCta";

/**
 * Award-winning cinematic landing page for Zempar (Generative Engine
 * Optimization). Full-bleed, scroll-driven; pulls up under the floating
 * header (which paints its own glass background) for an immersive hero.
 */
export function CinematicLanding() {
  return (
    <div className="-mt-20 w-full bg-background" style={{ overflowX: "clip" }}>
      <SmoothScroll />
      <HeroFilm />
      <LogoStrip />
      <FeatureFilm />
      <Metrics />
      <ProductShowcase />
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <GeoLeadSection />
      </div>
      <Faq />
      <FinalCta />
    </div>
  );
}
