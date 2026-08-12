"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { LanguageSelector } from "@/components/ui/language-selector";
import { useLanguage } from "@/contexts/language-context";
import { useCinematicContent } from "@/lib/use-cinematic-content";
import { cn } from "@/lib/utils";

const NAV_HREFS = [
  { key: "overview" as const, href: "/#overview" },
  { key: "traffic" as const, href: "/#why" },
  { key: "green" as const, href: "/#impact" },
  { key: "app" as const, href: "/#technology" },
  { key: "cities" as const, href: "/#markets" },
];

export function ProductNav() {
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();
  const { direction } = useLanguage();
  const { brand, nav } = useCinematicContent();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
        scrolled
          ? "border-b border-white/[0.06] bg-[rgba(5,5,5,0.75)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn(
          "mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:h-14 sm:px-6",
          direction === "rtl" ? "flex-row-reverse" : ""
        )}
      >
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-white/90 transition-opacity hover:opacity-100 sm:text-[0.9375rem]"
        >
          {brand}
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label={nav.overview}>
          {NAV_HREFS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-[0.8125rem] font-medium text-white/55 transition-colors hover:text-white/90"
            >
              {nav[link.key]}
            </Link>
          ))}
        </nav>

        <div
          className={cn(
            "flex items-center gap-2",
            direction === "rtl" ? "flex-row-reverse" : ""
          )}
        >
          <div className="hidden sm:block [&_button]:text-white/70 [&_button:hover]:text-white [&_span]:text-white/70">
            <LanguageSelector />
          </div>
          <Link
            href="/#ride"
            className="btn-mobility-primary hidden min-h-9 items-center justify-center px-4 text-xs font-semibold sm:inline-flex sm:text-sm"
          >
            {nav.cta}
          </Link>
          <Link
            href="/#ride"
            className="btn-mobility-primary inline-flex min-h-9 items-center justify-center px-3 text-xs font-semibold md:hidden"
          >
            {nav.ctaShort}
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
