"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Diamond } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
function Column({
  variant,
  title,
  cardSubtitle,
  labelMainGoal,
  mainGoal,
  howFind,
  howFindHighlight,
  labelOptimizes,
  optimizes,
  influences,
  influencesHighlight,
  labelWhy,
  whyMatters,
  isRtl,
  reduceMotion,
  delay,
}: {
  variant: "seo" | "geo";
  title: string;
  cardSubtitle: string;
  labelMainGoal: string;
  mainGoal: string;
  howFind: string;
  howFindHighlight: string;
  labelOptimizes: string;
  optimizes: string[];
  influences: string;
  influencesHighlight: string;
  labelWhy: string;
  whyMatters: string;
  isRtl: boolean;
  reduceMotion: boolean | null;
  delay: number;
}) {
  const headerClass =
    variant === "seo"
      ? "border-cyan-500/30 bg-cyan-500/[0.08]"
      : "border-cyan-400/20 bg-white/[0.04]";
  const boxClass =
    variant === "seo"
      ? "border-cyan-500/15 bg-cyan-500/[0.06]"
      : "border-white/10 bg-white/[0.03]";

  return (
    <motion.article
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-2xl border text-left",
        variant === "seo"
          ? "border-cyan-500/25"
          : "border-white/[0.12]",
        isRtl && "text-right"
      )}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: reduceMotion ? 0 : delay }}
    >
      <div className={cn("border-b px-5 py-4", headerClass)}>
        <h3 className="font-display text-xl font-bold text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-300">{cardSubtitle}</p>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-5 text-sm text-slate-400">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {labelMainGoal}
          </p>
          <p className="mt-1.5 text-slate-200">{mainGoal}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {howFind}
          </p>
          <p
            className={cn(
              "mt-2 rounded-lg border px-3 py-2.5 text-slate-200",
              boxClass
            )}
          >
            {howFindHighlight}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {labelOptimizes}
          </p>
          <ul className="mt-2 space-y-2" role="list">
            {optimizes.map((line, i) => (
              <li
                key={i}
                className={cn(
                  "flex gap-2 text-slate-300",
                  isRtl && "flex-row-reverse"
                )}
              >
                <Diamond
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400/70"
                  aria-hidden
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {influences}
          </p>
          <p
            className={cn(
              "mt-2 rounded-lg border px-3 py-2.5 text-slate-200",
              boxClass
            )}
          >
            {influencesHighlight}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {labelWhy}
          </p>
          <p className="mt-1.5 text-slate-200">{whyMatters}</p>
        </div>
      </div>
    </motion.article>
  );
}

export function SeoGeoComparisonSection() {
  const { t, locale, direction } = useLanguage();
  const reduceMotion = useReducedMotion();
  const isRtl = direction === "rtl";

  const sg = (locale as Record<string, unknown>).seoGeo as
    | {
        seo?: { optimizes?: string[] } & Record<string, string>;
        geo?: { optimizes?: string[] } & Record<string, string>;
      }
    | undefined;

  const seoOpt = Array.isArray(sg?.seo?.optimizes) ? sg!.seo!.optimizes! : [];
  const geoOpt = Array.isArray(sg?.geo?.optimizes) ? sg!.geo!.optimizes! : [];

  return (
    <section
      className="marketing-section py-12 md:py-20"
      aria-labelledby="seo-geo-heading"
    >
      <div className={cn(isRtl && "rtl")}>
        <motion.div
          className="mb-10 text-center md:mb-12"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2
            id="seo-geo-heading"
            className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl text-balance"
          >
            {t("seoGeo.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-400">
            {t("seoGeo.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <Column
            variant="seo"
            title={t("seoGeo.seo.label")}
            cardSubtitle={t("seoGeo.seo.cardSubtitle")}
            labelMainGoal={t("seoGeo.labels.mainGoal")}
            mainGoal={t("seoGeo.seo.mainGoal")}
            howFind={t("seoGeo.seo.howFindLabel")}
            howFindHighlight={t("seoGeo.seo.howFindHighlight")}
            labelOptimizes={t("seoGeo.labels.optimizes")}
            optimizes={seoOpt}
            influences={t("seoGeo.seo.influencesLabel")}
            influencesHighlight={t("seoGeo.seo.influencesHighlight")}
            labelWhy={t("seoGeo.labels.whyMatters")}
            whyMatters={t("seoGeo.seo.whyMatters")}
            isRtl={isRtl}
            reduceMotion={reduceMotion}
            delay={0.05}
          />
          <Column
            variant="geo"
            title={t("seoGeo.geo.label")}
            cardSubtitle={t("seoGeo.geo.cardSubtitle")}
            labelMainGoal={t("seoGeo.labels.mainGoal")}
            mainGoal={t("seoGeo.geo.mainGoal")}
            howFind={t("seoGeo.geo.howFindLabel")}
            howFindHighlight={t("seoGeo.geo.howFindHighlight")}
            labelOptimizes={t("seoGeo.labels.optimizes")}
            optimizes={geoOpt}
            influences={t("seoGeo.geo.influencesLabel")}
            influencesHighlight={t("seoGeo.geo.influencesHighlight")}
            labelWhy={t("seoGeo.labels.whyMatters")}
            whyMatters={t("seoGeo.geo.whyMatters")}
            isRtl={isRtl}
            reduceMotion={reduceMotion}
            delay={0.1}
          />
        </div>
      </div>
    </section>
  );
}
