import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";
import { AiVisibilitySection } from "@/components/marketing/AiVisibilitySection";
import { SeoGeoComparisonSection } from "@/components/marketing/SeoGeoComparisonSection";
import { VisibilityOfferingsSection } from "@/components/marketing/VisibilityOfferingsSection";
import { SeoGeoBothSection } from "@/components/marketing/SeoGeoBothSection";
import { MissionValuesSection } from "@/components/mission/MissionValuesSection";
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
      <main className="container mx-auto px-4 sm:px-6 py-16 max-w-7xl">
        <HeroSection />
        <AiVisibilitySection />
        <SeoGeoComparisonSection />
        <VisibilityOfferingsSection />
        <SeoGeoBothSection />
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <MissionValuesSection />
        </div>
        <HowItWorks />
        <GeoLeadSection />
        <TestimonialsSection />
      </main>

      <FAQSection />

      <Footer />
    </div>
  );
}
