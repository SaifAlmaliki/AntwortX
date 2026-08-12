"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { useCinematicContent } from "@/lib/use-cinematic-content";

function formatValue(v: number, target: number) {
  if (!Number.isInteger(target)) return v.toFixed(1);
  return Math.round(v).toLocaleString("en-US");
}

function Counter({
  value,
  prefix,
  suffix,
  play,
}: {
  value: number;
  prefix: string;
  suffix: string;
  play: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!play) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, value, reduceMotion]);

  return (
    <span className="font-display text-[clamp(2.5rem,8vw,3.75rem)] font-extrabold tracking-tight">
      <span className="text-gradient-mobility">
        {prefix}
        {formatValue(display, value)}
        {suffix}
      </span>
    </span>
  );
}

export function Metrics() {
  const { metrics } = useCinematicContent();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="impact" className="relative overflow-hidden bg-[#0A0A0C] py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6" ref={ref}>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-12">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="flex flex-col items-center text-center"
            >
              <Counter
                value={m.value}
                prefix={m.prefix}
                suffix={m.suffix}
                play={inView}
              />
              <span className="mt-4 text-sm font-medium uppercase tracking-[0.16em] text-white/45">
                {m.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
