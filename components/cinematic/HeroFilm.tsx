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
import { EXPLODED_PARTS, SCROLL_BEATS } from "./content";

function easeProgress(p: number, start: number, end: number) {
  if (p <= start) return 0;
  if (p >= end) return 1;
  const t = (p - start) / (end - start);
  return t * t * (3 - 2 * t);
}

function ExplodedPart({
  part,
  progress,
  reduceMotion,
}: {
  part: (typeof EXPLODED_PARTS)[number];
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const explode = useTransform(progress, (p) => {
    const t = easeProgress(p, 0.12, 0.55);
    return t;
  });
  const fadeIn = useTransform(progress, (p) => easeProgress(p, 0.18, 0.32));
  const fadeOut = useTransform(progress, (p) => 1 - easeProgress(p, 0.72, 0.88));
  const opacity = useTransform([fadeIn, fadeOut], ([a, b]) =>
    Math.min(a as number, b as number)
  );
  const x = useTransform(explode, (t) => t * part.dx);
  const y = useTransform(explode, (t) => t * part.dy);

  return (
    <motion.div
      style={
        reduceMotion
          ? { opacity: 0 }
          : {
              left: part.x,
              top: part.y,
              x,
              y,
              opacity,
            }
      }
      className="pointer-events-none absolute z-20 hidden sm:block"
    >
      <div className="flex flex-col items-center gap-1.5">
        <span className="size-2 rounded-full bg-[#00E676] shadow-[0_0_12px_rgba(0,230,118,0.8)]" />
        <span className="whitespace-nowrap rounded-full border border-white/10 bg-[rgba(5,5,5,0.85)] px-3 py-1 text-[0.6875rem] font-medium tracking-wide text-white/80 backdrop-blur-md">
          {part.label}
        </span>
      </div>
    </motion.div>
  );
}

function StoryBeat({
  beat,
  progress,
  reduceMotion,
}: {
  beat: (typeof SCROLL_BEATS)[number];
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const [start, end] = beat.range;
  const fadeInStart = start + (end - start) * 0.05;
  const fadeInEnd = start + (end - start) * 0.22;
  const fadeOutStart = end - (end - start) * 0.18;
  const isLast = beat.id === "cta";

  const opacity = useTransform(progress, (p) => {
    if (isLast) {
      return easeProgress(p, fadeInStart, fadeInEnd);
    }
    const inOp = easeProgress(p, fadeInStart, fadeInEnd);
    const outOp = 1 - easeProgress(p, fadeOutStart, end);
    return Math.min(inOp, outOp);
  });

  const y = useTransform(progress, (p) => {
    const t = easeProgress(p, fadeInStart, fadeInEnd);
    return (1 - t) * 32;
  });

  const alignClass =
    beat.align === "left"
      ? "items-start text-left max-w-xl mr-auto pl-6 sm:pl-12 lg:pl-24"
      : beat.align === "right"
        ? "items-end text-right max-w-xl ml-auto pr-6 sm:pr-12 lg:pr-24"
        : "items-center text-center max-w-4xl mx-auto px-6";

  return (
    <motion.div
      style={reduceMotion ? { opacity: beat.id === "hero" ? 1 : 0 } : { opacity, y }}
      className={`pointer-events-none absolute inset-x-0 top-[18%] z-30 flex flex-col sm:top-[22%] ${alignClass}`}
      aria-hidden={beat.id !== "hero"}
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
      {"bullets" in beat && beat.bullets ? (
        <ul
          className={`mt-5 flex flex-col gap-2 ${beat.align === "right" ? "items-end" : "items-start"}`}
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
      {"primaryCta" in beat && beat.primaryCta ? (
        <div className="pointer-events-auto mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link href={beat.primaryCta.href} className="btn-mobility-primary min-h-11 px-7">
            {beat.primaryCta.label}
          </Link>
          {"secondaryCta" in beat && beat.secondaryCta ? (
            <Link
              href={beat.secondaryCta.href}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 text-sm font-semibold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              {beat.secondaryCta.label}
            </Link>
          ) : null}
        </div>
      ) : null}
    </motion.div>
  );
}

export function HeroFilm() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const scooterScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.92, 1]);
  const scooterRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -8, 0]);
  const scooterY = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, -20, -20, 0]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.5]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <section
      id="overview"
      ref={sectionRef}
      className="relative h-[400vh]"
      aria-label="Zempar e-scooter product showcase"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#050505]">
        {/* Ambient radial glow */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: reduceMotion ? 0.5 : glowOpacity,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(0,230,118,0.06) 0%, rgba(0,214,255,0.03) 35%, transparent 70%), radial-gradient(ellipse 100% 80% at 50% 50%, #050815 0%, #050505 100%)",
          }}
          aria-hidden
        />

        {/* 3D stage */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            style={
              reduceMotion
                ? undefined
                : {
                    scale: scooterScale,
                    rotateY: scooterRotateY,
                    y: scooterY,
                  }
            }
            className="relative w-[min(92vw,680px)] will-change-transform"
          >
            <Image
              src="/scooter/hero-render.png"
              alt="Zempar shared e-scooter — premium white and green design"
              width={1200}
              height={1200}
              priority
              className="relative z-10 h-auto w-full select-none object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
              draggable={false}
            />

            {/* Rim light overlay */}
            <div
              className="pointer-events-none absolute inset-0 z-20 rounded-3xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 60%, rgba(0,230,118,0.04) 100%)",
              }}
              aria-hidden
            />

            {EXPLODED_PARTS.map((part) => (
              <ExplodedPart
                key={part.id}
                part={part}
                progress={scrollYProgress}
                reduceMotion={!!reduceMotion}
              />
            ))}
          </motion.div>
        </div>

        {/* Edge vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 50%, transparent 35%, rgba(5,5,5,0.65) 100%)",
          }}
          aria-hidden
        />

        {/* Story beats */}
        {SCROLL_BEATS.map((beat) => (
          <StoryBeat
            key={beat.id}
            beat={beat}
            progress={scrollYProgress}
            reduceMotion={!!reduceMotion}
          />
        ))}

        {/* Scroll cue */}
        <motion.div
          style={reduceMotion ? undefined : { opacity: cueOpacity }}
          className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2"
          aria-hidden
        >
          <div className="flex flex-col items-center gap-2 text-white/50">
            <span className="text-[0.65rem] uppercase tracking-[0.22em]">Scroll to explore</span>
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
