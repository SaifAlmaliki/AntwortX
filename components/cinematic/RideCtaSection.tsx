"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { useCinematicContent } from "@/lib/use-cinematic-content";
import { cn } from "@/lib/utils";

const STEP_IMAGES = [
  { src: "/scooter/app-ui.png", alt: "", fit: "cover" as const },
  { src: "/scooter/hero-void.png", alt: "", fit: "contain" as const },
  { src: "/scooter/scooter-street.jpg", alt: "", fit: "cover" as const },
  { src: "/scooter/hero-render.png", alt: "", fit: "contain" as const },
];

export function RideCtaSection() {
  const reduceMotion = useReducedMotion();
  const { rideCta } = useCinematicContent();

  return (
    <section id="ride" className="relative bg-[#050505] py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="font-display mb-10 text-[clamp(2rem,4vw+0.5rem,3.25rem)] font-bold tracking-tight text-white sm:mb-14"
        >
          {rideCta.headline}
        </motion.h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {rideCta.steps.map((step, i) => {
            const image = STEP_IMAGES[i];
            return (
              <motion.article
                key={step.title}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : i * 0.08 }}
                className="flex flex-col gap-4"
              >
                <div
                  className={cn(
                    "relative overflow-hidden rounded-2xl bg-[#0A0A0C]",
                    image?.fit === "contain" && "flex items-center justify-center"
                  )}
                >
                  {image ? (
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={640}
                      height={480}
                      className={cn(
                        "h-52 w-full sm:h-56 lg:h-48",
                        image.fit === "contain"
                          ? "object-contain p-4"
                          : "object-cover"
                      )}
                    />
                  ) : null}
                </div>
                <h3 className="text-base font-semibold leading-snug text-[#00E676] sm:text-lg">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/70 sm:text-[0.9375rem]">
                  {step.detail}
                </p>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-10 text-center text-xs text-white/35">{rideCta.footnote}</p>
      </div>
    </section>
  );
}
