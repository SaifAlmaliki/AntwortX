"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

export function Footer({ dark = false }: { dark?: boolean }) {
  const { t, direction } = useLanguage();
  const isRtl = direction === "rtl";
  const currentYear = new Date().getFullYear();

  const linkClass = dark
    ? "rounded-sm text-white/45 transition-colors duration-200 ease-out hover:text-[#00E676] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E676]/50"
    : "rounded-sm text-muted-foreground transition-colors duration-200 ease-out hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <footer
      className={cn(
        "relative py-12 backdrop-blur-md",
        dark
          ? "border-t border-white/[0.06] bg-[#050505]"
          : "border-t border-border/80 bg-card/85",
        isRtl ? "rtl" : ""
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
          dark ? "via-[#00E676]/20" : "via-primary/30"
        )}
        aria-hidden
      />
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-6">
            <div className={cn("font-display mb-3 text-2xl font-bold tracking-tight", dark ? "text-white/90" : "text-foreground")}>
              {t("home.title")}
            </div>
            <p className={cn("mb-5 max-w-sm text-sm leading-relaxed", dark ? "text-white/45" : "text-muted-foreground")}>
              {t("footer.description") ||
                "Premium shared micromobility — smart fleets, rider apps, and operator software for modern cities."}
            </p>
            <div
              className={cn(
                "flex gap-4",
                isRtl ? "flex-row-reverse" : ""
              )}
            >
              <Link
                href="https://www.facebook.com/profile.php?id=61574206222119"
                className={cn(
                  linkClass,
                  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md"
                )}
                aria-label="Facebook"
              >
                <Facebook size={20} aria-hidden />
              </Link>
              <Link
                href="https://www.instagram.com/zempar/"
                className={cn(
                  linkClass,
                  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md"
                )}
                aria-label="Instagram"
              >
                <Instagram size={20} aria-hidden />
              </Link>
              <Link
                href="https://www.linkedin.com/company/106535449/"
                className={cn(
                  linkClass,
                  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md"
                )}
                aria-label="LinkedIn"
              >
                <Linkedin size={20} aria-hidden />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className={cn("mb-4 text-xs font-semibold uppercase tracking-wider", dark ? "text-[#00E676]/80" : "text-primary/85")}>
              {t("footer.product")}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className={linkClass}>
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/#partner" className={linkClass}>
                  {t("footer.partnerships")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className={cn("mb-4 text-xs font-semibold uppercase tracking-wider", dark ? "text-[#00E676]/80" : "text-primary/85")}>
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
            "mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs sm:flex-row",
            dark ? "border-white/[0.06] text-white/35" : "border-border/80 text-muted-foreground",
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
