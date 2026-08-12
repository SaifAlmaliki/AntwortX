"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { useLanguage } from "@/contexts/language-context";
import { useCinematicContent } from "@/lib/use-cinematic-content";

export function FeatureFilm() {
  const reduceMotion = useReducedMotion();
  const { direction } = useLanguage();
  const { features } = useCinematicContent();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isRtl = direction === "rtl";
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="why" ref={sectionRef} className="relative h-[240vh] bg-[#050505] sm:h-[280vh] lg:h-[300vh]">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <Image
          src="/scooter/scooter-street.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
          aria-hidden
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#050505]/60" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.75) 50%, rgba(5,5,5,0.88) 100%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{
            background: isRtl
              ? "linear-gradient(270deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.55) 45%, rgba(5,5,5,0.15) 100%)"
              : "linear-gradient(90deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.55) 45%, rgba(5,5,5,0.15) 100%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6 lg:justify-start lg:px-12 xl:px-24">
          <div className="relative w-full max-w-[min(100%,32rem)] text-center lg:max-w-2xl lg:text-start">
            {features.map((f, i) => (
              <FeatureLine
                key={f.word}
                index={i}
                total={features.length}
                progress={scrollYProgress}
                reduceMotion={!!reduceMotion}
                tag={f.tag}
                word={f.word}
                line={f.line}
                detail={f.detail}
              />
            ))}
          </div>
        </div>

        <StepDots progress={scrollYProgress} total={features.length} />
      </div>
    </section>
  );
}

function FeatureLine({
  index,
  total,
  progress,
  reduceMotion,
  tag,
  word,
  line,
  detail,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
  tag: string;
  word: string;
  line: string;
  detail: string;
}) {
  const seg = 1 / total;
  const start = index * seg;
  const end = start + seg;
  const inA = start + seg * 0.08;
  const inB = start + seg * 0.28;
  const outA = end - seg * 0.18;
  const opacity = useTransform(
    progress,
    [start, inA, inB, outA, end],
    index === total - 1 ? [0, 0, 1, 1, 1] : [0, 0, 1, 1, 0]
  );
  const y = useTransform(progress, [inA, inB], [40, 0]);

  return (
    <motion.div
      style={reduceMotion ? { opacity: index === 0 ? 1 : 0 } : { opacity, y }}
      className="absolute inset-x-0 mx-auto max-w-[min(100%,32rem)] lg:inset-x-auto lg:mx-0 lg:max-w-2xl"
    >
      <span className="font-display text-xs font-semibold tracking-[0.3em] text-[#00E676]/70 sm:text-sm">
        {tag}
      </span>
      <h3 className="mt-3 font-display text-[clamp(2rem,8vw,4.5rem)] font-extrabold leading-[1.04] tracking-tight text-white/90 sm:mt-4 sm:leading-[1.02]">
        {word}
      </h3>
      <p className="mx-auto mt-4 max-w-xl text-base font-medium text-white/80 sm:mt-5 sm:text-lg lg:mx-0 lg:text-xl">
        {line}
      </p>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/50 sm:mt-4 lg:mx-0">
        {detail}
      </p>
    </motion.div>
  );
}

function StepDots({
  progress,
  total,
}: {
  progress: MotionValue<number>;
  total: number;
}) {
  return (
    <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-10 sm:gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <Dot key={i} index={i} total={total} progress={progress} />
      ))}
    </div>
  );
}

function Dot({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const opacity = useTransform(
    progress,
    [index * seg - 0.02, index * seg + 0.04, (index + 1) * seg - 0.04, (index + 1) * seg + 0.02],
    [0.3, 1, 1, 0.3]
  );
  const width = useTransform(
    progress,
    [index * seg, index * seg + 0.05, (index + 1) * seg - 0.05, (index + 1) * seg],
    [8, 28, 28, 8]
  );
  return (
    <motion.span style={{ opacity, width }} className="h-1.5 rounded-full bg-[#00E676] sm:h-2" />
  );
}
