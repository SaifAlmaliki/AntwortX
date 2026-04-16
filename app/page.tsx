import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";
import { SeoGeoComparisonSection } from "@/components/marketing/SeoGeoComparisonSection";
import { VisibilityOfferingsSection } from "@/components/marketing/VisibilityOfferingsSection";
import { HowItWorks } from "@/components/HowItWorks";
import { GeoLeadSection } from "@/components/GeoLeadSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <div>
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <HeroSection />
        <SeoGeoComparisonSection />
        <GeoLeadSection />
        <VisibilityOfferingsSection />
        <HowItWorks />
        <TestimonialsSection />
      </div>

      <FAQSection />

      <Footer />
    </div>
  );
}
