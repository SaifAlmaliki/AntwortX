"use client";

import { motion } from "framer-motion";

import { useCinematicContent } from "@/lib/use-cinematic-content";

export function LogoStrip() {
  const { markets } = useCinematicContent();

  return (
    <section
      id="markets"
      className="relative border-y border-white/[0.06] bg-[#050505] py-12"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.24em] text-white/40"
        >
          {markets.title}
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {markets.cities.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="font-display text-xl font-semibold tracking-tight text-white/50 transition hover:text-[#00E676]/90 sm:text-2xl"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
