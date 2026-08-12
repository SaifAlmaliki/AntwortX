import type { Metadata } from "next";
import { Syne, Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SkipToMain } from "@/components/SkipToMain";
import { SiteChrome } from "@/components/site-chrome";
import { LanguageProvider } from "@/contexts/language-context";
import { StructuredData } from "@/components/structured-data";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  adjustFontFallback: true,
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

const siteUrl = getSiteUrl();
const defaultTitle = "Zempar — Shared E-Scooter Platform";
const defaultDescription =
  "Premium shared micromobility for modern cities. Zempar powers e-scooter fleets across global markets with smart hardware, rider apps, and operator software.";

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
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${syne.variable} ${geistSans.variable} ${geistMono.variable} relative min-h-screen bg-page font-sans text-foreground antialiased`}
      >
        <StructuredData />

        <div className="relative z-10">
          <LanguageProvider>
            <SkipToMain />
            <SiteChrome>{children}</SiteChrome>
            <Toaster position="bottom-right" />
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
