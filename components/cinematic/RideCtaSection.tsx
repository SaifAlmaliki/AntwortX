"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Leaf, MapPin, QrCode, Smartphone } from "lucide-react";

import { useCinematicContent } from "@/lib/use-cinematic-content";
import { cn } from "@/lib/utils";

const STEP_ICONS = [Smartphone, MapPin, QrCode] as const;

export function RideCtaSection() {
  const reduceMotion = useReducedMotion();
  const { rideCta } = useCinematicContent();

  return (
    <section id="ride" className="relative py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,230,118,0.08), transparent 60%)",
        }}
        aria-hidden
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-[#00E676]/15 bg-[#0A0A0C]/90 p-8 backdrop-blur-sm sm:p-12"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00E676]/25 bg-[#00E676]/10 px-3 py-1 text-xs font-semibold text-[#00E676]">
              <Leaf className="size-3.5" aria-hidden />
              {rideCta.badge}
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white/90 sm:text-4xl">
              {rideCta.headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/55">{rideCta.sub}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={rideCta.primaryHref} className="btn-mobility-primary min-h-12 px-8 text-center">
                {rideCta.primaryLabel}
              </Link>
              <Link
                href={rideCta.secondaryHref}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-sm font-semibold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                {rideCta.secondaryLabel}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {rideCta.steps.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? Smartphone;
              return (
                <div
                  key={step.title}
                  className="flex gap-4 rounded-2xl border border-white/[0.06] bg-[#050505]/60 p-5"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#00E676]/10 text-[#00E676]">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00E676]/70">
                      {step.tag}
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold text-white/90">{step.title}</p>
                    <p className="mt-1 text-sm text-white/50">{step.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className={cn("mt-8 text-center text-xs text-white/35")}>{rideCta.footnote}</p>
      </motion.div>
    </section>
  );
}
