"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

import { useCinematicContent } from "@/lib/use-cinematic-content";

export function FinalCta() {
  const reduceMotion = useReducedMotion();
  const { finalCta } = useCinematicContent();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const washOpacity = useTransform(scrollYProgress, [0, 0.35, 0.6], [0.3, 0.6, 0.85]);
  const contentOpacity = useTransform(scrollYProgress, [0.28, 0.55], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.28, 0.6], [40, 0]);

  return (
    <section ref={ref} className="relative h-[180vh] bg-[#050505] sm:h-[200vh] lg:h-[220vh]">
      <div className="sticky top-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden">
        <Image
          src="/scooter/scooter-street.jpg"
          alt=""
          fill
          className="object-cover"
          aria-hidden
          sizes="100vw"
        />
        <motion.div
          className="absolute inset-0 bg-[#050505]"
          style={reduceMotion ? { opacity: 0.82 } : { opacity: washOpacity }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,230,118,0.08), transparent 70%)",
          }}
          aria-hidden
        />

        <motion.div
          style={reduceMotion ? undefined : { opacity: contentOpacity, y: contentY }}
          className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6"
        >
          <h2 className="font-display text-[clamp(2.25rem,5vw+1rem,4.5rem)] font-extrabold leading-[1.02] tracking-tight text-white/90">
            {finalCta.headline}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/55">{finalCta.sub}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={finalCta.primaryCta.href}
              className="btn-mobility-primary min-h-[50px] w-full px-8 text-base min-[420px]:w-auto"
            >
              {finalCta.primaryCta.label}
            </Link>
            <Link
              href={finalCta.secondaryCta.href}
              className="inline-flex min-h-[50px] w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-base font-semibold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10 min-[420px]:w-auto"
            >
              {finalCta.secondaryCta.label}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
