"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { useLanguage } from "@/contexts/language-context";
import { useCinematicContent } from "@/lib/use-cinematic-content";
import { cn } from "@/lib/utils";

function easeProgress(p: number, start: number, end: number) {
  if (p <= start) return 0;
  if (p >= end) return 1;
  const t = (p - start) / (end - start);
  return t * t * (3 - 2 * t);
}

function ExplodedPart({
  label,
  x,
  y,
  dx,
  dy,
  progress,
  reduceMotion,
}: {
  label: string;
  x: string;
  y: string;
  dx: number;
  dy: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const explode = useTransform(progress, (p) => easeProgress(p, 0.12, 0.55));
  const fadeIn = useTransform(progress, (p) => easeProgress(p, 0.18, 0.32));
  const fadeOut = useTransform(progress, (p) => 1 - easeProgress(p, 0.72, 0.88));
  const opacity = useTransform([fadeIn, fadeOut], ([a, b]) =>
    Math.min(a as number, b as number)
  );
  const tx = useTransform(explode, (t) => t * dx);
  const ty = useTransform(explode, (t) => t * dy);

  return (
    <motion.div
      style={
        reduceMotion
          ? { opacity: 0 }
          : { left: x, top: y, x: tx, y: ty, opacity }
      }
      className="pointer-events-none absolute z-20 hidden sm:block"
    >
      <div className="flex flex-col items-center gap-1.5">
        <span className="size-2 rounded-full bg-[#00E676] shadow-[0_0_12px_rgba(0,230,118,0.8)]" />
        <span className="whitespace-nowrap rounded-full border border-white/10 bg-[rgba(5,5,5,0.85)] px-3 py-1 text-[0.6875rem] font-medium tracking-wide text-white/80 backdrop-blur-md">
          {label}
        </span>
      </div>
    </motion.div>
  );
}

function StoryBeat({
  beat,
  progress,
  reduceMotion,
  isRtl,
  scrollCue,
}: {
  beat: ReturnType<typeof useCinematicContent>["scrollBeats"][number];
  progress: MotionValue<number>;
  reduceMotion: boolean;
  isRtl: boolean;
  scrollCue?: string;
}) {
  const [start, end] = beat.range;
  const fadeInStart = start + (end - start) * 0.05;
  const fadeInEnd = start + (end - start) * 0.22;
  const fadeOutStart = end - (end - start) * 0.18;
  const isLast = beat.id === "cta";

  const opacity = useTransform(progress, (p) => {
    if (isLast) return easeProgress(p, fadeInStart, fadeInEnd);
    const inOp = easeProgress(p, fadeInStart, fadeInEnd);
    const outOp = 1 - easeProgress(p, fadeOutStart, end);
    return Math.min(inOp, outOp);
  });

  const y = useTransform(progress, (p) => {
    const t = easeProgress(p, fadeInStart, fadeInEnd);
    return (1 - t) * 32;
  });

  const visualAlign =
    isRtl
      ? beat.align === "left"
        ? "right"
        : beat.align === "right"
          ? "left"
          : "center"
      : beat.align;

  const alignClass =
    visualAlign === "left"
      ? "items-start text-start max-w-xl me-auto ps-6 sm:ps-12 lg:ps-24"
      : visualAlign === "right"
        ? "items-end text-end max-w-xl ms-auto pe-6 sm:pe-12 lg:pe-24"
        : "items-center text-center max-w-4xl mx-auto px-6";

  return (
    <motion.div
      style={reduceMotion ? { opacity: beat.id === "hero" ? 1 : 0 } : { opacity, y }}
      className={`pointer-events-none absolute inset-x-0 top-[18%] z-30 flex flex-col sm:top-[22%] ${alignClass}`}
    >
      <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-[#00E676]/90">
        {beat.eyebrow}
      </p>
      <h2 className="font-display text-[clamp(2rem,5vw+0.5rem,4.5rem)] font-extrabold leading-[0.98] tracking-tight text-white/90">
        <span className="text-gradient-mobility">{beat.headline}</span>
      </h2>
      <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
        {beat.sub}
      </p>
      {beat.bullets ? (
        <ul
          className={cn(
            "mt-5 flex flex-col gap-2",
            visualAlign === "right" ? "items-end" : "items-start"
          )}
        >
          {beat.bullets.map((b) => (
            <li
              key={b}
              className="flex items-center gap-2 text-sm text-white/55 before:size-1 before:shrink-0 before:rounded-full before:bg-[#00E676]"
            >
              {b}
            </li>
          ))}
        </ul>
      ) : null}
      {beat.primaryCta ? (
        <div className="pointer-events-auto mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link href={beat.primaryCta.href} className="btn-mobility-primary min-h-11 px-7">
            {beat.primaryCta.label}
          </Link>
          {beat.secondaryCta ? (
            <Link
              href={beat.secondaryCta.href}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 text-sm font-semibold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              {beat.secondaryCta.label}
            </Link>
          ) : null}
        </div>
      ) : null}
      {beat.id === "hero" && scrollCue ? (
        <p className="sr-only">{scrollCue}</p>
      ) : null}
    </motion.div>
  );
}

export function HeroFilm() {
  const reduceMotion = useReducedMotion();
  const { direction } = useLanguage();
  const { scrollBeats, explodedParts, scrollCue } = useCinematicContent();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isRtl = direction === "rtl";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const scooterScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.92, 1]);
  const scooterRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [0, isRtl ? 8 : -8, 0]);
  const scooterY = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, -20, -20, 0]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.5]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <section
      id="overview"
      ref={sectionRef}
      className="relative h-[400vh]"
      aria-label={scrollBeats[0]?.headline}
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#050505]">
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: reduceMotion ? 0.5 : glowOpacity,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(0,230,118,0.06) 0%, rgba(0,214,255,0.03) 35%, transparent 70%), radial-gradient(ellipse 100% 80% at 50% 50%, #050815 0%, #050505 100%)",
          }}
          aria-hidden
        />

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            style={
              reduceMotion
                ? undefined
                : { scale: scooterScale, rotateY: scooterRotateY, y: scooterY }
            }
            className="relative w-[min(92vw,680px)] will-change-transform"
          >
            <Image
              src="/scooter/hero-render.png"
              alt={scrollBeats[0]?.headline ?? ""}
              width={1200}
              height={1200}
              priority
              className="relative z-10 h-auto w-full select-none object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
              draggable={false}
            />
            <div
              className="pointer-events-none absolute inset-0 z-20 rounded-3xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 60%, rgba(0,230,118,0.04) 100%)",
              }}
              aria-hidden
            />
            {explodedParts.map((part) => (
              <ExplodedPart
                key={part.id}
                label={part.label}
                x={part.x}
                y={part.y}
                dx={part.dx}
                dy={part.dy}
                progress={scrollYProgress}
                reduceMotion={!!reduceMotion}
              />
            ))}
          </motion.div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 50%, transparent 35%, rgba(5,5,5,0.65) 100%)",
          }}
          aria-hidden
        />

        {scrollBeats.map((beat) => (
          <StoryBeat
            key={beat.id}
            beat={beat}
            progress={scrollYProgress}
            reduceMotion={!!reduceMotion}
            isRtl={isRtl}
            scrollCue={scrollCue}
          />
        ))}

        <motion.div
          style={reduceMotion ? undefined : { opacity: cueOpacity }}
          className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2"
          aria-hidden
        >
          <div className="flex flex-col items-center gap-2 text-white/50">
            <span className="text-[0.65rem] uppercase tracking-[0.22em]">{scrollCue}</span>
            <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1">
              <motion.span
                className="h-2 w-1 rounded-full bg-[#00E676]"
                animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
