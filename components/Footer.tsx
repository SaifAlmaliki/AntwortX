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
    "text-slate-400 hover:text-cyan-300 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060606]";

  return (
    <footer
      className={cn(
        "relative border-t border-cyan-500/10 bg-[rgba(5,6,8,0.85)] backdrop-blur-md py-12",
        isRtl ? "rtl" : ""
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
        aria-hidden
      />
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-6">
            <div className="font-display text-2xl font-bold text-white mb-3 tracking-tight">
              <span className="text-white">Zem</span>
              <span className="text-gradient-signal">par</span>
            </div>
            <p className="text-slate-400 text-sm mb-5 max-w-sm leading-relaxed">
              {t("footer.description") ||
                "Comprehensive AI solutions from strategy to execution and implementation for businesses of all sizes."}
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
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-200/80 mb-4">
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
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-200/80 mb-4">
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
            "mt-10 pt-6 border-t border-cyan-500/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-500 text-xs",
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
