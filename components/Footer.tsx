"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

export function Footer() {
  const { t, direction } = useLanguage();
  const isRtl = direction === "rtl";
  const currentYear = new Date().getFullYear();

  const linkClass =
    "rounded-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <footer
      className={cn(
        "relative border-t border-border/80 bg-card/85 py-12 backdrop-blur-md",
        isRtl ? "rtl" : ""
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        aria-hidden
      />
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-6">
            <div className="font-display mb-3 text-2xl font-bold tracking-tight text-foreground">
              <span className="text-foreground">Zem</span>
              <span className="text-gradient-signal">par</span>
            </div>
            <p className="mb-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("footer.description") ||
                "Generative Engine Optimization and SEO together—findable in search, accurately represented in LLM apps."}
            </p>
            <div
              className={cn(
                "flex gap-4",
                isRtl ? "flex-row-reverse" : ""
              )}
            >
              <Link
                href="https://www.facebook.com/profile.php?id=61574206222119"
                className={cn(linkClass, "p-1")}
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="https://www.instagram.com/zempar/"
                className={cn(linkClass, "p-1")}
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="https://www.linkedin.com/company/106535449/"
                className={cn(linkClass, "p-1")}
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary/85">
              {t("footer.product")}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className={linkClass}>
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/solutions" className={linkClass}>
                  {t("nav.solutions")}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className={linkClass}>
                  {t("footer.pricing")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary/85">
              {t("footer.company")}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className={linkClass}>
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkClass}>
                  {t("footer.contact")}
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className={linkClass}>
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={cn(
            "mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/80 pt-6 text-xs text-muted-foreground sm:flex-row",
            isRtl ? "sm:flex-row-reverse" : ""
          )}
        >
          <p>{t("footer.copyright").replace("2025", currentYear.toString())}</p>
          <p>
            {isRtl
              ? "صُمم بـ ❤️ لعمليات أذكى وأسرع"
              : "Designed with ❤️ for smarter, faster operations"}
          </p>
        </div>
      </div>
    </footer>
  );
}
