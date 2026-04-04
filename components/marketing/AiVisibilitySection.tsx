"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

export function AiVisibilitySection() {
  const { t, locale, direction } = useLanguage();
  const reduceMotion = useReducedMotion();
  const isRtl = direction === "rtl";

  const ai = (locale as Record<string, unknown>).aiVisibility as
    | { queries?: string[] }
    | undefined;
  const queries = Array.isArray(ai?.queries) ? ai!.queries! : [];

  return (
    <section
      className="marketing-section py-12 md:py-20"
      aria-labelledby="ai-visibility-heading"
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
            id="ai-visibility-heading"
            className="font-display text-balance text-3xl font-bold text-foreground sm:text-4xl md:text-5xl"
          >
            {t("aiVisibility.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-primary/85">
            {t("aiVisibility.subtitle")}
          </p>
        </motion.div>

        <motion.p
          className={cn(
            "mb-4 text-center text-sm font-medium text-muted-foreground",
            isRtl && "text-center"
          )}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.04 }}
        >
          {t("aiVisibility.promptIntro")}
        </motion.p>

        <ul className="mx-auto mb-10 max-w-2xl space-y-3" role="list">
          {queries.map((q, i) => (
            <motion.li
              key={i}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.45,
                delay: reduceMotion ? 0 : 0.06 + i * 0.05,
              }}
            >
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/30 px-4 py-3 shadow-sm">
                <Search
                  className="h-5 w-5 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <p className="min-w-0 flex-1 text-start text-sm italic leading-snug text-foreground/90 sm:text-base">
                  {q}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>

        <motion.div
          className="mx-auto max-w-3xl space-y-5 text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.08 }}
        >
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("aiVisibility.body")}
          </p>
          <p className="text-base font-medium leading-relaxed text-foreground/95 sm:text-lg">
            {t("aiVisibility.closing")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
