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
 * Premium cinematic landing page for Zempar micromobility —
 * scroll-driven 3D scooter showcase with Apple-style navigation.
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
      <ProductShowcase />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RideCtaSection />
      </div>
      <Faq />
      <FinalCta />
    </div>
  );
}
