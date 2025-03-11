import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Squares } from "@/components/ui/squares-background";
import { FloatingHeader } from "@/components/ui/floating-header";
import { LanguageProvider } from "@/contexts/language-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Intelligent Proxy - Custom AI Agent Solutions",
  description: "Create tailored AI agents for various business needs with our powerful platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#060606] text-white overflow-x-hidden relative`}
      >
        {/* Global Squares background */}
        <div className="fixed inset-0 z-0">
          <Squares 
            direction="diagonal"
            speed={0.3}
            squareSize={50}
            borderColor="#222" 
            hoverFillColor="#1a1a1a"
          />
        </div>
        
        {/* Main content */}
        <div className="relative z-10">
          <LanguageProvider>
            <FloatingHeader />
            <main className="pt-20">
              {children}
            </main>
            <Toaster position="bottom-right" />
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
