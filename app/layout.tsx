import type { Metadata } from "next";
import { Syne, Geist, Geist_Mono, Tajawal } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SkipToMain } from "@/components/SkipToMain";
import { SiteChrome } from "@/components/site-chrome";
import { LanguageProvider } from "@/contexts/language-context";
import { StructuredData } from "@/components/structured-data";
import {
  BRAND_NAME_AR,
  DEFAULT_DESCRIPTION_AR,
  DEFAULT_TITLE_AR,
} from "@/lib/brand";
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

const tajawal = Tajawal({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  adjustFontFallback: true,
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: DEFAULT_TITLE_AR,
  description: DEFAULT_DESCRIPTION_AR,
  openGraph: {
    title: DEFAULT_TITLE_AR,
    description: DEFAULT_DESCRIPTION_AR,
    url: siteUrl,
    siteName: BRAND_NAME_AR,
    locale: "ar_IQ",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: DEFAULT_TITLE_AR,
    description: DEFAULT_DESCRIPTION_AR,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="overflow-x-hidden">
      <body
        className={`${syne.variable} ${geistSans.variable} ${geistMono.variable} ${tajawal.variable} relative min-h-screen bg-page font-sans text-foreground antialiased`}
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
