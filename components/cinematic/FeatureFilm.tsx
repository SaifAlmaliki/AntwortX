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
import { FEATURES } from "./content";

export function FeatureFilm() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="fleet" ref={sectionRef} className="relative h-[300vh] bg-[#050505]">
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
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.55) 45%, rgba(5,5,5,0.15) 100%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 flex h-full items-center px-6 sm:px-12 lg:px-24">
          <div className="relative w-full max-w-2xl">
            {FEATURES.map((f, i) => (
              <FeatureLine
                key={f.word}
                index={i}
                total={FEATURES.length}
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

        <StepDots progress={scrollYProgress} total={FEATURES.length} />
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
      className="absolute max-w-2xl"
    >
      <span className="font-display text-sm font-semibold tracking-[0.3em] text-[#00E676]/70">
        {tag}
      </span>
      <h3 className="mt-4 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white/90 sm:text-6xl lg:text-7xl">
        {word}
      </h3>
      <p className="mt-5 max-w-xl text-lg font-medium text-white/80 sm:text-xl">{line}</p>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/50">{detail}</p>
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
    <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-3">
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
    <motion.span
      style={{ opacity, width }}
      className="h-2 rounded-full bg-[#00E676]"
    />
  );
}
