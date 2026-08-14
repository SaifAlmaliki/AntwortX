"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

import { useLanguage } from "@/contexts/language-context";
import { useCinematicContent } from "@/lib/use-cinematic-content";
import { cn } from "@/lib/utils";

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M16.37 12.64c-.03-2.16 1.76-3.2 1.84-3.25-1-1.47-2.57-1.67-3.12-1.69-1.32-.13-2.59.78-3.26.78s-1.7-.76-2.8-.74c-1.44.02-2.77.84-3.51 2.13-1.51 2.61-.38 6.46 1.07 8.57.72 1.03 1.57 2.19 2.68 2.15 1.08-.04 1.49-.7 2.8-.7s1.68.7 2.82.67c1.17-.02 1.9-1.05 2.61-2.09.82-1.19 1.16-2.35 1.18-2.41-.03-.01-2.25-.86-2.28-3.42ZM14.7 6.5c.59-.72.99-1.72.88-2.72-.85.03-1.89.57-2.5 1.28-.55.63-1.03 1.66-.9 2.63.96.07 1.94-.49 2.52-1.19Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path fill="#34A853" d="M3.5 20.5 13 12 3.5 3.5v17Z" />
      <path fill="#FBBC04" d="M16.6 14.1 13 12 3.5 20.5l13.1-6.4Z" />
      <path fill="#4285F4" d="M20.5 10.3 16.6 8.4 13 12l3.6 2.1 3.9-1.9c.7-.4.7-1.5 0-1.9Z" />
      <path fill="#EA4335" d="M3.5 3.5 13 12l3.6-2.1L3.5 3.5Z" />
    </svg>
  );
}

function StoreButton({
  href,
  label,
  sub,
  icon,
}: {
  href: string;
  label: string;
  sub: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-white/15 bg-black px-4 py-2 text-white transition-colors hover:border-white/30 hover:bg-white/5"
    >
      {icon}
      <span className="flex flex-col leading-none">
        <span className="text-[0.65rem] text-white/60">{sub}</span>
        <span className="mt-0.5 text-sm font-semibold">{label}</span>
      </span>
    </Link>
  );
}

function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2rem] border border-white/12 bg-[#111] p-2 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      <div className="overflow-hidden rounded-[1.55rem] bg-[#050505]">{children}</div>
    </div>
  );
}

function MapScreen() {
  return (
    <div className="relative aspect-[9/19] w-full bg-[#1a2330]">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute left-[28%] top-[38%] size-3 rounded-full bg-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.8)]" />
      <div className="absolute left-[58%] top-[24%] flex size-8 items-center justify-center rounded-full bg-[#00E676] text-[0.65rem] font-bold text-black">
        B
      </div>
      <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white p-3 text-start text-[#111]">
        <p className="text-xs font-semibold">Blyzk · 209</p>
        <p className="mt-1 text-[0.7rem] text-[#00C853]">90%</p>
      </div>
    </div>
  );
}

export function ProductShowcase() {
  const reduceMotion = useReducedMotion();
  const { direction } = useLanguage();
  const { appShowcase } = useCinematicContent();
  const ref = useRef<HTMLDivElement>(null);
  const isRtl = direction === "rtl";
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [32, -32]);

  return (
    <section
      id="technology"
      ref={ref}
      className="relative overflow-hidden bg-[#0A0A0C] py-16 sm:py-24 lg:py-32"
    >
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <motion.div
          style={reduceMotion ? undefined : { y }}
          className={cn(
            "relative mx-auto h-[420px] w-full max-w-md sm:h-[480px]",
            isRtl && "lg:order-2"
          )}
        >
          <div
            className={cn(
              "absolute top-8 w-[42%] max-w-[170px] rotate-[-12deg]",
              isRtl ? "right-0" : "left-0"
            )}
          >
            <PhoneFrame>
              <MapScreen />
            </PhoneFrame>
          </div>
          <div
            className={cn(
              "absolute top-0 z-10 w-[48%] max-w-[196px] rotate-[8deg]",
              isRtl ? "left-2" : "right-2"
            )}
          >
            <PhoneFrame>
              <div className="aspect-[9/19] bg-[#f4fff8] p-5">
                <p className="font-display text-lg font-bold text-[#050505]">Blyzk</p>
                <ul className="mt-8 flex flex-col gap-4 text-sm text-[#050505]/70">
                  {appShowcase.stats.map((stat) => (
                    <li key={stat.label} className="flex items-center justify-between gap-2 border-b border-black/5 pb-3">
                      <span>{stat.label}</span>
                      <span className="font-semibold text-[#00C853]">{stat.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </PhoneFrame>
          </div>
          <div className="absolute bottom-0 left-1/2 z-20 w-[52%] max-w-[210px] -translate-x-1/2">
            <PhoneFrame>
              <Image
                src="/scooter/app-ui.png"
                alt={appShowcase.headline}
                width={800}
                height={1600}
                className="h-auto w-full"
              />
            </PhoneFrame>
          </div>
        </motion.div>

        <div className={cn("text-center lg:text-start", isRtl && "lg:order-1")}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#00E676]/80">
            {appShowcase.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw+0.5rem,3.25rem)] font-bold tracking-tight text-white">
            {appShowcase.headline}
          </h2>
          <p className="mt-4 max-w-md text-base text-white/55 sm:text-lg lg:max-w-none">
            {appShowcase.sub}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <StoreButton
              href="/#ride"
              sub="Download on the"
              label={appShowcase.appStore}
              icon={<AppleIcon />}
            />
            <StoreButton
              href="/#ride"
              sub="Get it on"
              label={appShowcase.playStore}
              icon={<PlayIcon />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
