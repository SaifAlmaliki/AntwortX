"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { HERO } from "./content";

const FRAME_COUNT = 48;
const framePath = (i: number) =>
  `/cinematic/hero-frames/f${String(i).padStart(3, "0")}.jpg`;

/** Draw an image to cover the canvas (object-fit: cover), centered. */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number
) {
  const ir = img.width / img.height;
  const cr = w / h;
  let dw = w;
  let dh = h;
  if (ir > cr) {
    dh = h;
    dw = h * ir;
  } else {
    dw = w;
    dh = w / ir;
  }
  const dx = (w - dw) / 2;
  const dy = (h - dh) / 2;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, dx, dy, dw, dh);
}

export function HeroFilm() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef(0);
  const lastFrameRef = useRef(-1);
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Headline fades and lifts away as the dashboard finishes assembling.
  const titleOpacity = useTransform(scrollYProgress, [0, 0.55, 0.8], [1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.8], [0, -60]);
  const titleScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.94]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // Preload the frame sequence.
  useEffect(() => {
    let cancelled = false;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        if (cancelled) return;
        loadedRef.current += 1;
        if (i === 0) render(0); // paint first frame ASAP
        if (loadedRef.current >= FRAME_COUNT) setReady(true);
      };
      imgs[i] = img;
    }
    imagesRef.current = imgs;
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const render = (frame: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[frame];
    if (!img || !img.complete || img.naturalWidth === 0) return;
    drawCover(ctx, img, canvas.clientWidth, canvas.clientHeight);
    lastFrameRef.current = frame;
  };

  const renderProgress = (p: number) => {
    const frame = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.round(p * (FRAME_COUNT - 1)))
    );
    if (frame !== lastFrameRef.current) render(frame);
  };

  useEffect(() => {
    sizeCanvas();
    // Reduced motion: show the fully-assembled final frame.
    renderProgress(reduceMotion ? 1 : scrollYProgress.get());
    const onResize = () => {
      sizeCanvas();
      renderProgress(reduceMotion ? 1 : scrollYProgress.get());
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, ready]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduceMotion) return;
    renderProgress(p);
  });

  return (
    <section ref={sectionRef} className="relative h-[320vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050509]">
        {/* Frame-sequence film */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden
        />
        {/* Cinematic scrims for legibility + edge falloff */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 30%, transparent 40%, rgba(5,5,9,0.55) 100%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(247,246,252,0.0) 55%, #f7f6fc 100%)",
          }}
          aria-hidden
        />

        <HeroCopy
          reduceMotion={!!reduceMotion}
          titleOpacity={titleOpacity}
          titleY={titleY}
          titleScale={titleScale}
          cueOpacity={cueOpacity}
        />
      </div>
    </section>
  );
}

function HeroCopy({
  reduceMotion,
  titleOpacity,
  titleY,
  titleScale,
  cueOpacity,
}: {
  reduceMotion: boolean;
  titleOpacity: MotionValue<number>;
  titleY: MotionValue<number>;
  titleScale: MotionValue<number>;
  cueOpacity: MotionValue<number>;
}) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        style={
          reduceMotion
            ? undefined
            : { opacity: titleOpacity, y: titleY, scale: titleScale }
        }
        className="mx-auto max-w-4xl"
      >
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-violet-300/90"
        >
          {HERO.eyebrow}
        </motion.p>
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(2.75rem,8vw+0.5rem,7rem)] font-extrabold leading-[0.98] tracking-tight text-white"
          style={{ textShadow: "0 2px 40px rgba(8,6,20,0.55)" }}
        >
          {HERO.headline}
        </motion.h1>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-slate-200/90 sm:text-lg"
        >
          {HERO.sub}
        </motion.p>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.66 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href={HERO.primaryCta.href}
            className="btn-signal-primary min-h-[48px] w-full min-w-0 px-7 text-base min-[420px]:w-auto"
          >
            {HERO.primaryCta.label}
          </Link>
          <Link
            href={HERO.secondaryCta.href}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 min-[420px]:w-auto"
          >
            {HERO.secondaryCta.label}
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={reduceMotion ? undefined : { opacity: cueOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-2 text-white/70">
          <span className="text-[0.7rem] uppercase tracking-[0.2em]">Scroll</span>
          <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/40 p-1">
            <motion.span
              className="h-2 w-1 rounded-full bg-white/80"
              animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </div>
      </motion.div>
    </div>
  );
}
