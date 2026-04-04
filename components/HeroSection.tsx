"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Info, Mail, Search, FileText, Code, LineChart } from "lucide-react";
import Link from "next/link";
import { SplineSceneBasic } from "@/components/ui/code.demo";
import { useLanguage } from "@/contexts/language-context";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";

type FeatureBlockProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  direction: "ltr" | "rtl";
};

function FeatureBlock({ icon, title, description, className, direction }: FeatureBlockProps) {
  const isRtl = direction === "rtl";
  return (
    <div
      className={cn(
        "card-surface group relative flex h-full min-w-0 w-full flex-col p-5 sm:p-6",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <Spotlight size={220} fill="signal" />
      </div>
      <div
        className={cn(
          "relative z-10 flex min-w-0 flex-1 flex-col gap-3",
          isRtl ? "text-right" : "text-left"
        )}
      >
        <div
          className={cn(
            "flex gap-3 pb-0.5",
            isRtl ? "flex-row-reverse" : "flex-row",
            "items-start"
          )}
        >
          <div className="shrink-0 pt-0.5 text-primary">{icon}</div>
          <h3 className="min-w-0 flex-1 hyphens-none text-pretty font-display text-base font-semibold leading-[1.4] text-foreground sm:text-lg">
            {title}
          </h3>
        </div>
        <p className="min-w-0 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
          {description}
        </p>
      </div>
    </div>
  );
}

type FeatureDef = {
  key: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

function iconForFeatureKey(key: string, reduceMotion: boolean | null): ReactNode {
  const chartIcon = (
    <motion.div
      animate={reduceMotion ? undefined : { rotate: [0, 12, 0, -12, 0] }}
      transition={reduceMotion ? undefined : { repeat: Infinity, duration: 5, ease: "easeInOut" }}
      className="inline-flex shrink-0 text-primary"
    >
      <LineChart className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
    </motion.div>
  );
  switch (key) {
    case "audit":
      return <Search className="h-8 w-8 shrink-0 text-primary" aria-hidden />;
    case "signals":
      return <FileText className="h-7 w-7 shrink-0 text-primary sm:h-8 sm:w-8" aria-hidden />;
    case "technical":
      return <Code className="h-7 w-7 shrink-0 text-primary sm:h-8 sm:w-8" aria-hidden />;
    case "measure":
      return chartIcon;
    default:
      return <Search className="h-8 w-8 shrink-0 text-primary" aria-hidden />;
  }
}

export function HeroSection() {
  const { t, direction, locale } = useLanguage();
  const reduceMotion = useReducedMotion();
  const subtitle = t("home.subtitle");
  const firstWord = subtitle.split(" ")[0] ?? "";
  const restWords = subtitle.split(" ").slice(1).join(" ");

  const rawCards = (locale as { home?: { featureCards?: unknown } }).home?.featureCards;
  const featureCards = Array.isArray(rawCards)
    ? (rawCards as { key?: string; title?: string; description?: string }[])
    : [];

  const features: FeatureDef[] = featureCards
    .filter((c) => c.key && c.title && c.description)
    .map((c) => ({
      key: c.key as string,
      icon: iconForFeatureKey(c.key as string, reduceMotion),
      title: c.title as string,
      description: c.description as string,
    }));

  const enterTarget = { opacity: 1, y: 0 };

  return (
    <section className="marketing-section space-y-12 sm:space-y-14 lg:space-y-20">
      <div
        className={cn(
          "flex min-w-0 flex-col gap-10 lg:flex-row lg:items-start lg:gap-12 xl:gap-16",
          direction === "rtl" ? "lg:flex-row-reverse" : ""
        )}
      >
        <motion.div
          className={cn(
            "min-w-0 w-full shrink-0 lg:max-w-[min(100%,32rem)] xl:max-w-[min(100%,36rem)]",
            direction === "rtl" ? "lg:pl-6 xl:pl-8" : "lg:pr-6 xl:pr-8"
          )}
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={enterTarget}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80 sm:tracking-[0.2em]">
            {t("home.eyebrow")}
          </p>
          <h1
            className={cn(
              "font-display text-[clamp(1.875rem,4.2vw+0.85rem,3.5rem)] font-bold leading-[1.12] tracking-tight text-pretty",
              direction === "rtl" ? "text-right" : "text-left"
            )}
          >
            <span className="text-gradient-signal">{firstWord}</span>
            {restWords ? (
              <span className="hyphens-none text-foreground">
                {" "}
                {restWords}
              </span>
            ) : null}
          </h1>
          <p
            className={cn(
              "mt-4 max-w-prose text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg",
              direction === "rtl" ? "ml-auto text-right" : ""
            )}
          >
            {t("home.description")}
          </p>
          <div
            className={cn(
              "mt-6 flex min-w-0 flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center",
              direction === "rtl" ? "sm:flex-row-reverse" : ""
            )}
          >
            <Link href="/about" className="inline-flex min-w-0 w-full min-[400px]:w-auto">
              <span
                className={cn(
                  "btn-signal-primary min-h-[44px] w-full min-w-0 gap-2 px-5 py-3 text-center min-[400px]:w-auto inline-flex whitespace-normal",
                  direction === "rtl" ? "flex-row-reverse" : ""
                )}
              >
                {direction === "rtl" ? <Info className="h-4 w-4 shrink-0" /> : null}
                <span className="text-balance">{t("about.title")}</span>
                {direction === "ltr" ? <Info className="h-4 w-4 shrink-0" /> : null}
              </span>
            </Link>
            <Link href="/contact" className="inline-flex min-w-0 w-full min-[400px]:w-auto">
              <span
                className={cn(
                  "btn-signal-secondary min-h-[44px] w-full min-w-0 gap-2 border px-5 py-3 text-center min-[400px]:w-auto inline-flex whitespace-normal",
                  direction === "rtl" ? "flex-row-reverse" : ""
                )}
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span className="text-balance">{t("contact.title")}</span>
              </span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="min-w-0 w-full flex-1 lg:min-w-[min(100%,18rem)]"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={enterTarget}
          transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Wide 2×2 grid: each card gets ~half of the (wide) right column—no ultra-narrow bento rails. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-5">
            {features.map((f, index) => (
              <motion.div
                key={f.key}
                className="min-w-0"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={enterTarget}
                transition={{
                  duration: 0.45,
                  delay: reduceMotion ? 0 : 0.18 + index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <FeatureBlock
                  icon={f.icon}
                  title={f.title}
                  description={f.description}
                  className="min-h-[12.5rem] sm:min-h-[14rem]"
                  direction={direction}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="min-w-0 w-full"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
      >
        <SplineSceneBasic />
      </motion.div>
    </section>
  );
}
