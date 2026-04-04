"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { TESTIMONIALS } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  const { direction, t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const isRtl = direction === "rtl";

  return (
    <section className="marketing-section py-12 md:py-20" aria-labelledby="testimonials-heading">
      <div className={cn("mb-12 text-center md:mb-16", isRtl && "rtl")}>
        <motion.h2
          id="testimonials-heading"
          className="font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          {t("testimonials.title")}
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.08 }}
        >
          {t("testimonials.subtitle")}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {TESTIMONIALS.map((item, index) => (
          <motion.article
            key={item.name}
            className={cn(
              "card-surface flex min-h-0 min-w-0 flex-col border border-primary/10 border-b-2 border-b-amber-500/45 p-5 sm:p-6",
              isRtl && "text-right"
            )}
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.5,
              delay: reduceMotion ? 0 : 0.06 + index * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div
              className={cn("mb-4 flex gap-0.5", isRtl && "justify-end")}
              aria-label={t("testimonials.ratingLabel")}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400"
                  aria-hidden
                />
              ))}
            </div>
            <blockquote
              className={cn(
                "mb-6 min-w-0 flex-1 text-sm font-normal leading-relaxed text-foreground/90 sm:text-[0.9375rem]",
                isRtl ? "text-right" : "text-left"
              )}
            >
              <span className="italic">&ldquo;{item.quote}&rdquo;</span>
            </blockquote>
            <footer className={cn("mt-auto border-t border-primary/10 pt-4", isRtl && "text-right")}>
              <p className="font-display font-semibold text-foreground">{item.name}</p>
              <p className="mt-1 text-sm text-muted-foreground/90">{item.role}</p>
            </footer>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
