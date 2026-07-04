"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { FINAL_CTA } from "./content";

export function FinalCta() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // The clip plays alone first, then a wash + content fade in as you scroll.
  const washOpacity = useTransform(scrollYProgress, [0, 0.35, 0.6], [0.2, 0.55, 0.82]);
  const contentOpacity = useTransform(scrollYProgress, [0.28, 0.55], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.28, 0.6], [40, 0]);

  return (
    <section ref={ref} className="relative h-[220vh] bg-[#050509]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        >
          <source src="/cinematic/calm.mp4" type="video/mp4" />
        </video>
        <motion.div
          className="absolute inset-0 bg-[#0a0712]"
          style={reduceMotion ? { opacity: 0.72 } : { opacity: washOpacity }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32"
          style={{ background: "linear-gradient(to bottom, #f7f6fc, transparent)" }}
          aria-hidden
        />

        <motion.div
          style={reduceMotion ? undefined : { opacity: contentOpacity, y: contentY }}
          className="relative z-10 mx-auto max-w-3xl px-6 text-center"
        >
          <h2 className="font-display text-[clamp(2.25rem,5vw+1rem,4.5rem)] font-extrabold leading-[1.02] tracking-tight text-white">
            {FINAL_CTA.headline}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-200/90">
            {FINAL_CTA.sub}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={FINAL_CTA.primaryCta.href}
              className="btn-signal-primary min-h-[50px] w-full px-8 text-base min-[420px]:w-auto"
            >
              {FINAL_CTA.primaryCta.label}
            </Link>
            <Link
              href={FINAL_CTA.secondaryCta.href}
              className="inline-flex min-h-[50px] w-full items-center justify-center rounded-full border border-white/25 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 min-[420px]:w-auto"
            >
              {FINAL_CTA.secondaryCta.label}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
