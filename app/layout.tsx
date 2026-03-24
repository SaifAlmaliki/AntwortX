import type { Metadata } from "next";
import { Syne, Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Squares } from "@/components/ui/squares-background";
import { FloatingHeader } from "@/components/ui/floating-header";
import { LanguageProvider } from "@/contexts/language-context";
import { StructuredData } from "@/components/structured-data";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();
const defaultTitle = "Zempar - AI Ops & Agentic AI";
const defaultDescription =
  "AI Ops and agentic AI for smarter, faster, more efficient operations—workflow automation, tool-using agents, and enterprise integration.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: defaultTitle,
  description: defaultDescription,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName: "Zempar",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: defaultTitle,
    description: defaultDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark overflow-x-hidden">
      <body
        className={`${syne.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-page text-white relative`}
      >
        <StructuredData />
        {/* Animated grid (original look: visible #222 lines on #060606) */}
        <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
          <Squares
            direction="diagonal"
            speed={0.3}
            squareSize={50}
            borderColor="#222"
            hoverFillColor="#1a1a1a"
          />
        </div>

        <div className="relative z-10">
          <LanguageProvider>
            <FloatingHeader />
            <main className="pt-20">{children}</main>
            <Toaster position="bottom-right" />
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
