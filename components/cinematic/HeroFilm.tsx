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

function HeroIntro({
  beat,
  progress,
  reduceMotion,
  isRtl,
}: {
  beat: ReturnType<typeof useCinematicContent>["scrollBeats"][number];
  progress: MotionValue<number>;
  reduceMotion: boolean;
  isRtl: boolean;
}) {
  const opacity = useTransform(progress, [0, 0.1, 0.14], [1, 1, 0]);
  const y = useTransform(progress, [0, 0.14], [0, -28]);

  return (
    <motion.div
      style={reduceMotion ? undefined : { opacity, y }}
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-40 px-6 pt-[4.5rem] sm:pt-24 lg:pt-28",
        isRtl ? "text-end" : "text-start"
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(52vh,520px)]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.92) 45%, rgba(5,5,5,0.55) 75%, transparent 100%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl lg:max-w-5xl">
        <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-[#00E676]">
          {beat.eyebrow}
        </p>
        <h1
          className="font-display text-[clamp(2.25rem,6vw,4.75rem)] font-extrabold leading-[1.02] tracking-tight text-white"
          style={{ textShadow: "0 2px 40px rgba(0,0,0,0.85), 0 0 80px rgba(0,230,118,0.12)" }}
        >
          {beat.headline}
        </h1>
        <p
          className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
          style={{ textShadow: "0 1px 24px rgba(0,0,0,0.8)" }}
        >
          {beat.sub}
        </p>
      </div>
    </motion.div>
  );
}

function StoryBeat({
  beat,
  progress,
  reduceMotion,
  isRtl,
}: {
  beat: ReturnType<typeof useCinematicContent>["scrollBeats"][number];
  progress: MotionValue<number>;
  reduceMotion: boolean;
  isRtl: boolean;
}) {
  if (beat.id === "hero") return null;

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
      style={reduceMotion ? { opacity: beat.id === "cta" ? 1 : 0 } : { opacity, y }}
      className={cn(
        "pointer-events-none absolute inset-x-0 z-30 flex flex-col",
        isLast ? "top-[14%] sm:top-[16%]" : "top-1/2 -translate-y-1/2",
        alignClass
      )}
    >
      <div
        className={cn(
          "rounded-2xl border border-white/[0.06] bg-[rgba(5,5,5,0.72)] p-6 backdrop-blur-md sm:p-8",
          visualAlign === "center" && "mx-auto"
        )}
      >
        <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-[#00E676]">
          {beat.eyebrow}
        </p>
        <h2
          className="font-display text-[clamp(1.75rem,4vw+0.5rem,3.5rem)] font-extrabold leading-[1.02] tracking-tight text-white"
          style={{ textShadow: "0 2px 32px rgba(0,0,0,0.75)" }}
        >
          {beat.headline}
        </h2>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
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
                className="flex items-center gap-2 text-sm text-white/65 before:size-1.5 before:shrink-0 before:rounded-full before:bg-[#00E676]"
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
      </div>
    </motion.div>
  );
}

export function HeroFilm() {
  const reduceMotion = useReducedMotion();
  const { direction } = useLanguage();
  const { scrollBeats, explodedParts, scrollCue } = useCinematicContent();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isRtl = direction === "rtl";
  const heroBeat = scrollBeats[0];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const scooterScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.88, 1]);
  const scooterRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [0, isRtl ? 6 : -6, 0]);
  const scooterY = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [40, 0, 0, 20]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.7, 1, 1, 0.55]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const floorGlow = useTransform(scrollYProgress, [0, 0.15], [0.5, 0.85]);

  return (
    <section
      id="overview"
      ref={sectionRef}
      className="relative h-[400vh]"
      aria-label={heroBeat?.headline}
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#050505]">
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: reduceMotion ? 0.5 : glowOpacity,
            background:
              "radial-gradient(ellipse 70% 50% at 50% 72%, rgba(0,230,118,0.09) 0%, rgba(0,214,255,0.04) 40%, transparent 70%), radial-gradient(ellipse 100% 80% at 50% 50%, #050815 0%, #050505 100%)",
          }}
          aria-hidden
        />

        {heroBeat ? (
          <HeroIntro
            beat={heroBeat}
            progress={scrollYProgress}
            reduceMotion={!!reduceMotion}
            isRtl={isRtl}
          />
        ) : null}

        <div
          className="absolute inset-x-0 bottom-0 flex items-end justify-center"
          style={{ height: "72%", perspective: "1200px" }}
        >
          <motion.div
            style={
              reduceMotion
                ? undefined
                : { scale: scooterScale, rotateY: scooterRotateY, y: scooterY }
            }
            className="relative w-[min(88vw,640px)] will-change-transform sm:w-[min(78vw,720px)]"
          >
            <motion.div
              className="pointer-events-none absolute left-1/2 top-[58%] z-0 h-32 w-[70%] -translate-x-1/2 rounded-[100%] blur-3xl"
              style={{
                opacity: reduceMotion ? 0.5 : floorGlow,
                background: "rgba(0,230,118,0.18)",
              }}
              aria-hidden
            />
            <Image
              src="/scooter/hero-void.png"
              alt={heroBeat?.headline ?? ""}
              width={1200}
              height={1200}
              priority
              className="relative z-10 h-auto w-full select-none object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,0.85)]"
              draggable={false}
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
              "radial-gradient(120% 90% at 50% 65%, transparent 30%, rgba(5,5,5,0.5) 100%)",
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
