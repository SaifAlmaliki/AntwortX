import type { Metadata } from "next";
import { CinematicLanding } from "@/components/cinematic/CinematicLanding";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <CinematicLanding />
      <Footer />
    </>
  );
}
