"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Bike, Cpu, MapPinned, Smartphone } from "lucide-react";

import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/language-context";

const EXPERTISE_KEYS = [
  { key: "hardware", icon: Bike },
  { key: "fleet", icon: Cpu },
  { key: "app", icon: Smartphone },
  { key: "ops", icon: MapPinned },
] as const;

export default function AboutPage() {
  const { t, direction } = useLanguage();
  const isRtl = direction === "rtl";
  const reduceMotion = useReducedMotion();

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: reduceMotion ? 1 : 0 },
      visible: {
        opacity: 1,
        transition: reduceMotion ? { duration: 0 } : { staggerChildren: 0.1 },
      },
    }),
    [reduceMotion]
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { y: reduceMotion ? 0 : 20, opacity: reduceMotion ? 1 : 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: reduceMotion ? 0 : 0.5 },
      },
    }),
    [reduceMotion]
  );

  return (
    <div className={isRtl ? "rtl" : ""}>
      <section className="marketing-section relative pb-12 pt-12 md:pb-20 md:pt-24">
        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            className="mb-16 text-center"
          >
            <h1 className="font-display mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {t("about.title")}
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              {t("about.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="marketing-section py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="font-display mb-6 text-3xl font-bold text-foreground md:text-4xl">
              {t("about.who.title")}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              {t("about.who.description")}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {EXPERTISE_KEYS.map(({ key, icon: Icon }) => (
              <motion.div
                key={key}
                variants={itemVariants}
                className="card-surface flex min-w-0 flex-col items-center rounded-xl p-6 text-center"
              >
                <div className="mb-4">
                  <Icon className="size-10 text-primary" aria-hidden />
                </div>
                <h3 className="mb-3 min-w-0 max-w-full text-pretty text-xl font-bold text-foreground">
                  {t(`about.expertise.${key}.title`)}
                </h3>
                <p className="min-w-0 max-w-full text-pretty leading-relaxed text-muted-foreground">
                  {t(`about.expertise.${key}.description`)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="marketing-section bg-gradient-to-b from-[rgba(6,8,12,0.6)] to-transparent py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="font-display mb-6 text-3xl font-bold text-foreground md:text-4xl">
              {t("about.expertise.title")}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              {t("about.expertise.description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {(
              [
                ["cities", "team"],
                ["innovation", "results"],
              ] as const
            ).flatMap((row, rowIndex) =>
              row.map((key, colIndex) => (
                <motion.div
                  key={key}
                  initial={reduceMotion ? false : { opacity: 0, x: colIndex === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.5,
                    delay: reduceMotion ? 0 : rowIndex * 0.1,
                  }}
                  viewport={{ once: true }}
                  className="card-surface min-w-0 rounded-xl p-8"
                >
                  <h3 className="mb-3 text-pretty text-xl font-bold text-foreground">
                    {t(`about.expertise.${key}.title`)}
                  </h3>
                  <p className="text-pretty leading-relaxed text-muted-foreground">
                    {t(`about.expertise.${key}.description`)}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="marketing-section py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            viewport={{ once: true }}
            className="section-glow rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/90 via-primary/75 to-accent/85 p-8 text-center shadow-signal-lg md:p-12"
          >
            <h2 className="font-display mb-4 text-balance text-3xl font-bold text-foreground">
              {t("about.cta.title")}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-foreground/90">
              {t("about.cta.description")}
            </p>
            <Link
              href="/contact"
              className="inline-flex min-h-11 min-w-0 items-center justify-center rounded-full bg-background px-8 py-3 font-semibold text-foreground shadow-lg transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              {t("about.cta.button")}
            </Link>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
