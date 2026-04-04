"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
export function SeoGeoBothSection() {
  const { t, direction } = useLanguage();
  const reduceMotion = useReducedMotion();
  const isRtl = direction === "rtl";

  return (
    <section
      className="marketing-section py-12 md:py-20"
      aria-labelledby="seo-geo-both-heading"
    >
      <div
        className={cn(
          "overflow-hidden rounded-3xl border border-cyan-500/15 bg-[#050508] px-6 py-14 text-center shadow-[0_0_60px_-12px_rgba(34,211,238,0.12)] sm:px-10 md:py-20",
          isRtl && "rtl"
        )}
      >
        <motion.div
          className="mx-auto flex max-w-2xl flex-col items-center"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
        >
          <div
            className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400 text-[#060606]"
            aria-hidden
          >
            <Sparkles className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <h2
            id="seo-geo-both-heading"
            className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-[2.35rem]"
          >
            {t("seoGeoBoth.title")}
          </h2>
          <p className="mt-5 text-base font-semibold text-white sm:text-lg">
            {t("seoGeoBoth.subtitle")}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
            {t("seoGeoBoth.body")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
