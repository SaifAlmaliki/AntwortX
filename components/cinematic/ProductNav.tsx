"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";

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

function closeMobileMenu(
  setOpen: (value: boolean) => void,
  menuButtonRef: React.RefObject<HTMLButtonElement | null>
) {
  setOpen(false);
  queueMicrotask(() => menuButtonRef.current?.focus());
}

export function ProductNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileNavMenuId = useId();
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavPanelRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const panel = mobileNavPanelRef.current;
    if (!panel) return;

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.closest("[aria-hidden='true']"));

    requestAnimationFrame(() => focusables()[0]?.focus());

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMobileMenu(setMobileMenuOpen, mobileMenuButtonRef);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

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
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-3 px-4 sm:h-14 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-tight text-white/90 transition-opacity hover:opacity-100 sm:text-[0.9375rem]"
        >
          {brand}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={nav.overview}>
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

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden sm:block [&_button]:text-white/70 [&_button:hover]:text-white [&_span]:text-white/70">
            <LanguageSelector />
          </div>
          <Link
            href="/#ride"
            className="btn-mobility-primary hidden min-h-9 items-center justify-center px-4 text-xs font-semibold sm:inline-flex sm:text-sm"
          >
            <span className="hidden md:inline">{nav.cta}</span>
            <span className="md:hidden">{nav.ctaShort}</span>
          </Link>
          <button
            ref={mobileMenuButtonRef}
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-white/80 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls={mobileNavMenuId}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              aria-label="Close menu"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => closeMobileMenu(setMobileMenuOpen, mobileMenuButtonRef)}
            />
            <motion.div
              ref={mobileNavPanelRef}
              id={mobileNavMenuId}
              role="dialog"
              aria-modal="true"
              aria-label={nav.overview}
              className={cn(
                "fixed inset-x-0 top-12 z-50 border-b border-white/[0.08] bg-[rgba(5,5,5,0.96)] px-4 py-6 backdrop-blur-xl sm:top-14 lg:hidden",
                direction === "rtl" ? "text-end" : "text-start"
              )}
              initial={reduceMotion ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav className="flex flex-col gap-1" aria-label={nav.overview}>
                {NAV_HREFS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl px-3 py-3 text-base font-medium text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                    onClick={() => closeMobileMenu(setMobileMenuOpen, mobileMenuButtonRef)}
                  >
                    {nav[link.key]}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:hidden">
                <div className="[&_button]:text-white/70 [&_button:hover]:text-white [&_span]:text-white/70">
                  <LanguageSelector />
                </div>
                <Link
                  href="/#ride"
                  className="btn-mobility-primary min-h-11 w-full text-center"
                  onClick={() => closeMobileMenu(setMobileMenuOpen, mobileMenuButtonRef)}
                >
                  {nav.cta}
                </Link>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
