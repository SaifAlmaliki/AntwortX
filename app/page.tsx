"use client";

import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <main className="container mx-auto px-4 sm:px-6 py-16 max-w-7xl">
        <HeroSection />
        <HowItWorks />
      </main>

      <FAQSection />

      <Footer />
    </div>
  );
}
