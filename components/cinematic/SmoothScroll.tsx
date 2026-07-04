"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";

// Height of the floating header we offset in-page anchor jumps by (px).
const HEADER_OFFSET = -96;

/**
 * Buttery smooth-scroll for the cinematic landing. Lenis drives the real page
 * scroll, so framer-motion's `useScroll` keeps working. Also teaches in-page
 * anchor links (e.g. "Start free" → #pricing) to scroll through Lenis, since
 * Lenis otherwise swallows native hash jumps. Disabled entirely under
 * prefers-reduced-motion (native anchor scrolling + scroll-margin take over).
 */
export function SmoothScroll() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    // Expose for tooling / debugging.
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const targetFromHref = (href: string) => {
      const hash = href.includes("#") ? "#" + href.split("#")[1] : "";
      if (!hash || hash === "#") return null;
      try {
        return document.querySelector(hash) as HTMLElement | null;
      } catch {
        return null;
      }
    };

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.(
        'a[href*="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      // Only same-page hash links ("#x" or "/#x" on the home route).
      const isSamePage = href.startsWith("#") || href.startsWith("/#");
      if (!isSamePage) return;
      const target = targetFromHref(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: HEADER_OFFSET, duration: 1.2 });
    };
    document.addEventListener("click", onClick);

    // Honor an initial hash landing (e.g. deep link to /#pricing).
    if (window.location.hash) {
      const target = document.querySelector(
        window.location.hash
      ) as HTMLElement | null;
      if (target) {
        requestAnimationFrame(() =>
          lenis.scrollTo(target, { offset: HEADER_OFFSET, immediate: true })
        );
      }
    }

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, [reduceMotion]);

  return null;
}
