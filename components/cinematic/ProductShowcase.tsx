"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const ENGINE_SCORES = [
  { name: "ChatGPT", pct: 74 },
  { name: "Perplexity", pct: 68 },
  { name: "Gemini", pct: 61 },
  { name: "Claude", pct: 57 },
  { name: "Copilot", pct: 44 },
];

const TREND = [28, 33, 31, 39, 46, 52, 58, 63, 67];

function TrendChart() {
  const w = 320;
  const h = 120;
  const max = Math.max(...TREND);
  const min = Math.min(...TREND);
  const pts = TREND.map((v, i) => {
    const x = (i / (TREND.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 16) - 8;
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="zp-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(124,58,237,0.35)" />
          <stop offset="100%" stopColor="rgba(124,58,237,0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#zp-area)" />
      <path
        d={line}
        fill="none"
        stroke="#7c3aed"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={4} fill="#7c3aed" />
    </svg>
  );
}

export function ProductShowcase() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [2.5, 0, -2.5]);

  return (
    <section ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            One dashboard, every engine
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Your visibility, made visible.
          </h2>
        </motion.div>

        <motion.div
          style={reduceMotion ? undefined : { y, rotateX: rotate }}
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Browser frame */}
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_40px_120px_-30px_rgba(76,40,130,0.35)]">
            <div className="flex items-center gap-2 border-b border-border/70 bg-secondary/60 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <div className="mx-auto flex items-center gap-2 rounded-md bg-background/80 px-3 py-1 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                app.zempar.com/visibility
              </div>
            </div>

            {/* Dashboard body */}
            <div className="grid grid-cols-1 gap-4 bg-gradient-to-b from-background to-secondary/30 p-5 sm:grid-cols-3 sm:p-7">
              {/* Score card */}
              <div className="card-surface flex flex-col justify-between p-5 sm:row-span-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    AI Visibility Score
                  </p>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="font-display text-5xl font-extrabold leading-none text-gradient-signal">
                      67
                    </span>
                    <span className="mb-1 text-sm font-semibold text-emerald-600">
                      +14 ▲
                    </span>
                  </div>
                </div>
                <div className="mt-6 h-24 w-full">
                  <TrendChart />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Share of AI answers, last 30 days
                </p>
              </div>

              {/* Engine breakdown */}
              <div className="card-surface p-5 sm:col-span-2">
                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Presence by engine
                </p>
                <div className="space-y-3">
                  {ENGINE_SCORES.map((e, i) => (
                    <div key={e.name} className="flex items-center gap-3">
                      <span className="w-20 shrink-0 text-sm font-medium text-foreground">
                        {e.name}
                      </span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-700"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${e.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <span className="w-10 shrink-0 text-right text-sm font-semibold text-foreground">
                        {e.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alert card */}
              <div className="card-surface flex items-center gap-3 p-5 sm:col-span-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  ●
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Competitor gained the answer for “best GEO platform”
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Perplexity now cites a rival · fix suggested
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
