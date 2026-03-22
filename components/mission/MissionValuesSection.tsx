"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import {
  MISSION_PILLAR_DEFS,
  MISSION_PILLAR_IDS,
  type MissionSectionCards,
} from "@/lib/mission-values";
import { cn } from "@/lib/utils";
import { ValuePillarCard } from "./ValuePillarCard";

function getCards(locale: Record<string, unknown>): MissionSectionCards | null {
  const section = locale.missionSection as Record<string, unknown> | undefined;
  const raw = section?.cards;
  if (!raw || typeof raw !== "object") return null;
  const cards = raw as Record<string, { title?: string; description?: string }>;
  const out: Partial<MissionSectionCards> = {};
  for (const id of MISSION_PILLAR_IDS) {
    const c = cards[id];
    if (c?.title && c?.description) {
      out[id] = { title: c.title, description: c.description };
    }
  }
  return out.innovation && out.partnership && out.excellence && out.reliability
    ? (out as MissionSectionCards)
    : null;
}

export function MissionValuesSection() {
  const { locale, direction, t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const isRtl = direction === "rtl";
  const cards = getCards(locale as Record<string, unknown>);

  if (!cards) return null;

  const title = t("missionSection.title");
  const body = t("missionSection.body");
  const cta = t("missionSection.cta");

  return (
    <section
      className="marketing-section py-12 md:py-20"
      aria-labelledby="mission-section-heading"
    >
      <div
        className={cn(
          "flex min-w-0 flex-col gap-12 lg:flex-row lg:items-center lg:gap-14 xl:gap-16",
          isRtl && "lg:flex-row-reverse"
        )}
      >
        <div className={cn("min-w-0 flex-1 lg:max-w-xl xl:max-w-[28rem]", isRtl && "text-right")}>
          <motion.h2
            id="mission-section-heading"
            className="font-display text-3xl font-bold tracking-tight text-gradient-signal sm:text-4xl md:text-[2.5rem] md:leading-tight"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="mt-5 text-base leading-relaxed text-slate-300 sm:mt-6 sm:text-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.06 }}
          >
            {body}
          </motion.p>
          <motion.div
            className={cn("mt-8 sm:mt-10", isRtl && "flex justify-end")}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.12 }}
          >
            <Link
              href="/contact"
              className={cn(
                "btn-signal-primary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold",
                isRtl && "flex-row-reverse"
              )}
            >
              {cta}
              <ArrowRight className={cn("h-4 w-4 shrink-0", isRtl && "rotate-180")} aria-hidden />
            </Link>
          </motion.div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {MISSION_PILLAR_DEFS.map(({ id, icon }, index) => (
              <motion.div
                key={id}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: reduceMotion ? 0 : 0.08 + index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ValuePillarCard
                  icon={icon}
                  title={cards[id].title}
                  description={cards[id].description}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
