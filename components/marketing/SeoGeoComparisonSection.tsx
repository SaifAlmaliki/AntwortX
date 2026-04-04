"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Diamond } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

const labelClass =
  "text-xs font-semibold uppercase tracking-wider text-muted-foreground/80";
const highlightBoxClass =
  "mt-2 rounded-lg border border-primary/10 bg-primary/[0.06] px-4 py-3 text-sm text-foreground/95";
const cardShellClass =
  "overflow-hidden rounded-2xl border border-border/60 bg-card/30 text-start shadow-lg";
const headerStripClass = "border-b border-border/60 bg-card/40 px-6 py-4 md:px-8";
const bodyPaddingClass = "p-6 text-sm text-muted-foreground md:p-8";

function OptimizesList({ lines }: { lines: string[] }) {
  return (
    <ul className="mt-2 space-y-2.5" role="list">
      {lines.map((line, i) => (
        <li key={i} className="flex gap-2 text-sm text-foreground/90">
          <Diamond
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/80"
            aria-hidden
          />
          <span className="min-w-0 flex-1">{line}</span>
        </li>
      ))}
    </ul>
  );
}

type ComparisonContentProps = {
  labelMainGoal: string;
  mainGoal: string;
  howFindLabel: string;
  howFindHighlight: string;
  labelOptimizes: string;
  optimizes: string[];
  influencesLabel: string;
  influencesHighlight: string;
  labelWhy: string;
  whyMatters: string;
};

function ComparisonBody({
  labelMainGoal,
  mainGoal,
  howFindLabel,
  howFindHighlight,
  labelOptimizes,
  optimizes,
  influencesLabel,
  influencesHighlight,
  labelWhy,
  whyMatters,
}: ComparisonContentProps) {
  return (
    <div className={cn("flex flex-1 flex-col gap-5", bodyPaddingClass)}>
      <div>
        <p className={labelClass}>{labelMainGoal}</p>
        <p className="mt-1.5 text-foreground/95">{mainGoal}</p>
      </div>
      <div>
        <p className={labelClass}>{howFindLabel}</p>
        <p className={highlightBoxClass}>{howFindHighlight}</p>
      </div>
      <div>
        <p className={labelClass}>{labelOptimizes}</p>
        <OptimizesList lines={optimizes} />
      </div>
      <div>
        <p className={labelClass}>{influencesLabel}</p>
        <p className={highlightBoxClass}>{influencesHighlight}</p>
      </div>
      <div>
        <p className={labelClass}>{labelWhy}</p>
        <p className="mt-1.5 text-foreground/95">{whyMatters}</p>
      </div>
    </div>
  );
}

function MobileComparisonCard({
  title,
  cardSubtitle,
  contentProps,
  isRtl,
  reduceMotion,
  delay,
}: {
  title: string;
  cardSubtitle: string;
  contentProps: ComparisonContentProps;
  isRtl: boolean;
  reduceMotion: boolean | null;
  delay: number;
}) {
  return (
    <motion.article
      className={cn("flex min-w-0 flex-col", cardShellClass)}
      dir={isRtl ? "rtl" : "ltr"}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: reduceMotion ? 0 : delay }}
    >
      <div className={headerStripClass}>
        <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{cardSubtitle}</p>
      </div>
      <ComparisonBody {...contentProps} />
    </motion.article>
  );
}

function DesktopComparisonTable({
  seoTitle,
  seoSubtitle,
  geoTitle,
  geoSubtitle,
  seoContent,
  geoContent,
  isRtl,
  reduceMotion,
}: {
  seoTitle: string;
  seoSubtitle: string;
  geoTitle: string;
  geoSubtitle: string;
  seoContent: ComparisonContentProps;
  geoContent: ComparisonContentProps;
  isRtl: boolean;
  reduceMotion: boolean | null;
}) {
  const rowClass =
    "grid grid-cols-2 divide-x divide-border/60 border-b border-border/60 last:border-b-0";
  const cellClass = "min-w-0 px-6 py-5 md:px-8";

  return (
    <motion.div
      className={cn("hidden min-w-0 lg:block", cardShellClass)}
      dir={isRtl ? "rtl" : "ltr"}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.05 }}
    >
      <div className={rowClass}>
        <div className="bg-card/40 px-6 py-4 md:px-8">
          <h3 className="font-display text-xl font-bold text-foreground">{seoTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{seoSubtitle}</p>
        </div>
        <div className="bg-card/40 px-6 py-4 md:px-8">
          <h3 className="font-display text-xl font-bold text-foreground">{geoTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{geoSubtitle}</p>
        </div>
      </div>

      <div className={rowClass}>
        <div className={cellClass}>
          <p className={labelClass}>{seoContent.labelMainGoal}</p>
          <p className="mt-1.5 text-sm text-foreground/95">{seoContent.mainGoal}</p>
        </div>
        <div className={cellClass}>
          <p className={labelClass}>{geoContent.labelMainGoal}</p>
          <p className="mt-1.5 text-sm text-foreground/95">{geoContent.mainGoal}</p>
        </div>
      </div>

      <div className={rowClass}>
        <div className={cellClass}>
          <p className={labelClass}>{seoContent.howFindLabel}</p>
          <p className={highlightBoxClass}>{seoContent.howFindHighlight}</p>
        </div>
        <div className={cellClass}>
          <p className={labelClass}>{geoContent.howFindLabel}</p>
          <p className={highlightBoxClass}>{geoContent.howFindHighlight}</p>
        </div>
      </div>

      <div className={rowClass}>
        <div className={cellClass}>
          <p className={labelClass}>{seoContent.labelOptimizes}</p>
          <OptimizesList lines={seoContent.optimizes} />
        </div>
        <div className={cellClass}>
          <p className={labelClass}>{geoContent.labelOptimizes}</p>
          <OptimizesList lines={geoContent.optimizes} />
        </div>
      </div>

      <div className={rowClass}>
        <div className={cellClass}>
          <p className={labelClass}>{seoContent.influencesLabel}</p>
          <p className={highlightBoxClass}>{seoContent.influencesHighlight}</p>
        </div>
        <div className={cellClass}>
          <p className={labelClass}>{geoContent.influencesLabel}</p>
          <p className={highlightBoxClass}>{geoContent.influencesHighlight}</p>
        </div>
      </div>

      <div className={rowClass}>
        <div className={cellClass}>
          <p className={labelClass}>{seoContent.labelWhy}</p>
          <p className="mt-1.5 text-sm text-foreground/95">{seoContent.whyMatters}</p>
        </div>
        <div className={cellClass}>
          <p className={labelClass}>{geoContent.labelWhy}</p>
          <p className="mt-1.5 text-sm text-foreground/95">{geoContent.whyMatters}</p>
        </div>
      </div>
    </motion.div>
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

  const labelMainGoal = t("seoGeo.labels.mainGoal");
  const labelOptimizes = t("seoGeo.labels.optimizes");
  const labelWhy = t("seoGeo.labels.whyMatters");

  const seoContent: ComparisonContentProps = {
    labelMainGoal,
    mainGoal: t("seoGeo.seo.mainGoal"),
    howFindLabel: t("seoGeo.seo.howFindLabel"),
    howFindHighlight: t("seoGeo.seo.howFindHighlight"),
    labelOptimizes,
    optimizes: seoOpt,
    influencesLabel: t("seoGeo.seo.influencesLabel"),
    influencesHighlight: t("seoGeo.seo.influencesHighlight"),
    labelWhy,
    whyMatters: t("seoGeo.seo.whyMatters"),
  };

  const geoContent: ComparisonContentProps = {
    labelMainGoal,
    mainGoal: t("seoGeo.geo.mainGoal"),
    howFindLabel: t("seoGeo.geo.howFindLabel"),
    howFindHighlight: t("seoGeo.geo.howFindHighlight"),
    labelOptimizes,
    optimizes: geoOpt,
    influencesLabel: t("seoGeo.geo.influencesLabel"),
    influencesHighlight: t("seoGeo.geo.influencesHighlight"),
    labelWhy,
    whyMatters: t("seoGeo.geo.whyMatters"),
  };

  return (
    <section
      className="marketing-section py-12 md:py-20"
      aria-labelledby="seo-geo-heading"
    >
      <div className={cn(isRtl && "rtl")} dir={isRtl ? "rtl" : "ltr"}>
        <motion.div
          className="mb-10 text-center md:mb-12"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2
            id="seo-geo-heading"
            className="font-display text-balance text-3xl font-bold text-foreground sm:text-4xl md:text-5xl"
          >
            {t("seoGeo.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {t("seoGeo.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:hidden">
          <MobileComparisonCard
            title={t("seoGeo.seo.label")}
            cardSubtitle={t("seoGeo.seo.cardSubtitle")}
            contentProps={seoContent}
            isRtl={isRtl}
            reduceMotion={reduceMotion}
            delay={0.05}
          />
          <MobileComparisonCard
            title={t("seoGeo.geo.label")}
            cardSubtitle={t("seoGeo.geo.cardSubtitle")}
            contentProps={geoContent}
            isRtl={isRtl}
            reduceMotion={reduceMotion}
            delay={0.1}
          />
        </div>

        <DesktopComparisonTable
          seoTitle={t("seoGeo.seo.label")}
          seoSubtitle={t("seoGeo.seo.cardSubtitle")}
          geoTitle={t("seoGeo.geo.label")}
          geoSubtitle={t("seoGeo.geo.cardSubtitle")}
          seoContent={seoContent}
          geoContent={geoContent}
          isRtl={isRtl}
          reduceMotion={reduceMotion}
        />
      </div>
    </section>
  );
}
