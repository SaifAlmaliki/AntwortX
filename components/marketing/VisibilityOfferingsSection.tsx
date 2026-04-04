"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Diamond } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

function scrollToLead() {
  document.getElementById("geo-lead")?.scrollIntoView({ behavior: "smooth" });
}

export function VisibilityOfferingsSection() {
  const { t, locale, direction } = useLanguage();
  const reduceMotion = useReducedMotion();
  const isRtl = direction === "rtl";

  const vo = (locale as Record<string, unknown>).visibilityOfferings as
    | {
        audit?: { features?: string[] };
        growth?: { features?: string[] };
      }
    | undefined;

  const auditFeatures = Array.isArray(vo?.audit?.features)
    ? vo!.audit!.features!
    : [];
  const growthFeatures = Array.isArray(vo?.growth?.features)
    ? vo!.growth!.features!
    : [];

  return (
    <section
      className="marketing-section py-12 md:py-20"
      aria-labelledby="offerings-heading"
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
            id="offerings-heading"
            className="font-display text-balance text-3xl font-bold text-foreground sm:text-4xl md:text-5xl"
          >
            {t("visibilityOfferings.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {t("visibilityOfferings.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <motion.article
            className={cn(
              "flex flex-col rounded-2xl border border-border/60 bg-card/30 p-6 shadow-lg md:p-8",
              isRtl && "text-right"
            )}
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.05 }}
          >
            <h3 className="font-display text-2xl font-bold text-foreground">
              {t("visibilityOfferings.audit.title")}
            </h3>
            <p className="mt-1 text-sm font-medium text-primary/90">
              {t("visibilityOfferings.audit.tagline")}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("visibilityOfferings.audit.description")}
            </p>
            <ul className="mt-6 flex-1 space-y-2.5" role="list">
              {auditFeatures.map((line, i) => (
                <li
                  key={i}
                  className={cn(
                    "flex gap-2 text-sm text-foreground/90",
                    isRtl && "flex-row-reverse"
                  )}
                >
                  <Diamond
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/80"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-lg border border-primary/10 bg-primary/[0.06] px-4 py-3 text-sm text-foreground/95">
              <span className="font-semibold text-primary/90">
                {t("visibilityOfferings.bestForLabel")}{" "}
              </span>
              {t("visibilityOfferings.audit.bestFor")}
            </div>
            <button
              type="button"
              onClick={scrollToLead}
              className={cn(
                "btn-signal-primary mt-6 inline-flex w-full items-center justify-center gap-2 py-3",
                isRtl && "flex-row-reverse"
              )}
            >
              {t("visibilityOfferings.audit.cta")}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </button>
          </motion.article>

          <motion.article
            className={cn(
              "relative flex flex-col overflow-hidden rounded-2xl border border-primary/25 bg-card p-6 shadow-xl md:p-8",
              isRtl && "text-right"
            )}
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.1 }}
          >
            <div className="absolute left-1/2 top-0 -translate-x-1/2">
              <span className="inline-block rounded-b-lg bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                {t("visibilityOfferings.growth.badge")}
              </span>
            </div>
            <h3 className="mt-6 font-display text-2xl font-bold text-foreground">
              {t("visibilityOfferings.growth.title")}
            </h3>
            <p className="mt-1 text-sm font-medium text-primary/90">
              {t("visibilityOfferings.growth.tagline")}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("visibilityOfferings.growth.description")}
            </p>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
              {t("visibilityOfferings.growth.plusLabel")}
            </p>
            <ul className="mt-3 flex-1 space-y-2.5" role="list">
              {growthFeatures.map((line, i) => (
                <li
                  key={i}
                  className={cn(
                    "flex gap-2 text-sm text-foreground/90",
                    isRtl && "flex-row-reverse"
                  )}
                >
                  <Diamond
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/80"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-lg border border-border/60 bg-card/40 px-4 py-3 text-sm text-foreground/95">
              <span className="font-semibold text-foreground">
                {t("visibilityOfferings.bestForLabel")}{" "}
              </span>
              {t("visibilityOfferings.growth.bestFor")}
            </div>
            <button
              type="button"
              onClick={scrollToLead}
              className={cn(
                "mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-foreground py-3 text-sm font-semibold text-background transition hover:bg-foreground/90",
                isRtl && "flex-row-reverse"
              )}
            >
              {t("visibilityOfferings.growth.cta")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
