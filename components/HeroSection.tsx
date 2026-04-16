"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Search, FileText, Code, LineChart, Send, Handshake } from "lucide-react";
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
      initial={reduceMotion ? false : { rotate: -10, opacity: 0.85 }}
      whileInView={reduceMotion ? undefined : { rotate: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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

const HERO_SUBTITLE_GRADIENT_WORDS = 4;

export function HeroSection() {
  const { t, direction, locale } = useLanguage();
  const reduceMotion = useReducedMotion();
  const subtitle = t("home.subtitle");
  const subtitleWords = subtitle.trim().split(/\s+/).filter(Boolean);
  const accentWords = Math.min(HERO_SUBTITLE_GRADIENT_WORDS, Math.max(1, subtitleWords.length));
  const headlineAccent = subtitleWords.slice(0, accentWords).join(" ");
  const headlineRest = subtitleWords.slice(accentWords).join(" ");

  const rawCards = (locale as { home?: { featureCards?: unknown } }).home?.featureCards;
  const featureCards = Array.isArray(rawCards)
    ? (rawCards as { key?: string; title?: string; description?: string }[])
    : [];

  /** Slim set: audit + measure — less overlap with SEO vs GEO section. */
  const allowedKeys = new Set(["audit", "measure"]);

  const features: FeatureDef[] = featureCards
    .filter((c) => c.key && c.title && c.description && allowedKeys.has(String(c.key)))
    .map((c) => ({
      key: c.key as string,
      icon: iconForFeatureKey(c.key as string, reduceMotion),
      title: c.title as string,
      description: c.description as string,
    }));

  const trustMicro = (locale as { home?: { trustMicro?: unknown } }).home?.trustMicro;
  const trustItems = Array.isArray(trustMicro)
    ? (trustMicro as string[]).filter((s) => typeof s === "string" && s.trim().length > 0)
    : [];

  const enterTarget = { opacity: 1, y: 0 };

  return (
    <section className="marketing-section space-y-12 sm:space-y-14 lg:space-y-20">
      <div className="flex min-w-0 flex-col gap-10">
        <motion.div
          className={cn(
            "min-w-0 w-full max-w-[min(100%,40rem)]",
            direction === "rtl" ? "ml-auto" : ""
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
            <span className="text-gradient-signal">{headlineAccent}</span>
            {headlineRest ? (
              <span className="hyphens-none text-foreground">
                {" "}
                {headlineRest}
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
            <Link
              href="/#geo-lead"
              className={cn(
                "btn-signal-primary min-h-[44px] w-full min-w-0 min-[400px]:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-center whitespace-normal no-underline",
                direction === "rtl" ? "flex-row-reverse" : ""
              )}
            >
              {direction === "rtl" ? <Send className="h-4 w-4 shrink-0" /> : null}
              <span className="text-balance">{t("home.primaryCta")}</span>
              {direction === "ltr" ? <Send className="h-4 w-4 shrink-0" /> : null}
            </Link>
            <Link
              href="/contact"
              className={cn(
                "btn-signal-secondary min-h-[44px] w-full min-w-0 min-[400px]:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-center whitespace-normal no-underline",
                direction === "rtl" ? "flex-row-reverse" : ""
              )}
            >
              <Handshake className="h-4 w-4 shrink-0" />
              <span className="text-balance">{t("visibilityOfferings.growth.cta")}</span>
            </Link>
          </div>
          {trustItems.length > 0 ? (
            <p
              className={cn(
                "mt-4 text-xs font-medium text-muted-foreground/90 sm:text-sm",
                direction === "rtl" ? "text-right" : "text-left"
              )}
            >
              {trustItems.join(direction === "rtl" ? " · " : " · ")}
            </p>
          ) : null}
        </motion.div>
      </div>

      {features.length > 0 ? (
        <motion.div
          className="grid min-w-0 w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:max-w-4xl lg:grid-cols-2"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={enterTarget}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.14, ease: [0.22, 1, 0.36, 1] }}
        >
          {features.map((f, index) => (
            <motion.div
              key={f.key}
              className="min-w-0"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={enterTarget}
              transition={{
                duration: 0.45,
                delay: reduceMotion ? 0 : 0.2 + index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <FeatureBlock
                icon={f.icon}
                title={f.title}
                description={f.description}
                className="min-h-[11rem] sm:min-h-[12rem]"
                direction={direction}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : null}

      <motion.div
        className="mx-auto w-full max-w-7xl px-4 sm:px-6"
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
