"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

import { useCinematicContent } from "@/lib/use-cinematic-content";

export function ProductShowcase() {
  const reduceMotion = useReducedMotion();
  const { appShowcase } = useCinematicContent();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [48, -48]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [3, 0, -3]);

  return (
    <section
      id="technology"
      ref={ref}
      className="relative overflow-hidden bg-[#0A0A0C] py-24 sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,230,118,0.05), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#00E676]/80">
            {appShowcase.eyebrow}
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white/90 sm:text-5xl">
            {appShowcase.headline}
          </h2>
          <p className="mt-4 text-base text-white/55 sm:text-lg">{appShowcase.sub}</p>
        </motion.div>

        <motion.div
          style={reduceMotion ? undefined : { y, rotateZ: rotate }}
          className="mx-auto max-w-sm sm:max-w-md"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#050505] p-3 shadow-[0_40px_120px_-30px_rgba(0,230,118,0.15)]">
            <div className="overflow-hidden rounded-[2rem]">
              <Image
                src="/scooter/app-ui.png"
                alt={appShowcase.headline}
                width={800}
                height={1600}
                className="h-auto w-full"
              />
            </div>
          </div>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-6">
          {appShowcase.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-2xl font-bold text-white/90 sm:text-3xl">
                <span className="text-gradient-mobility">{stat.value}</span>
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-white/45">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
