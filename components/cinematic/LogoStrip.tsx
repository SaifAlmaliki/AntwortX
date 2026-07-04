"use client";

import { motion } from "framer-motion";
import { ENGINES } from "./content";

export function LogoStrip() {
  return (
    <section className="relative border-y border-border/70 bg-background/80 py-12 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground"
        >
          Monitoring your brand across every answer engine
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {ENGINES.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="font-display text-xl font-semibold tracking-tight text-foreground/70 grayscale transition hover:text-foreground sm:text-2xl"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
