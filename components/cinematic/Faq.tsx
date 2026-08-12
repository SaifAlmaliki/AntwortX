"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import { useCinematicContent } from "@/lib/use-cinematic-content";
import { cn } from "@/lib/utils";

export function Faq() {
  const { faq } = useCinematicContent();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative bg-[#050505] py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-center font-display text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-bold tracking-tight text-white/90"
        >
          {faq.title}
        </motion.h2>
        <p className="mb-10 text-center text-sm text-white/45 sm:mb-12 sm:text-base">{faq.subtitle}</p>

        <div className="divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-[#0A0A0C]/80 backdrop-blur-sm">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="px-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-start"
                >
                  <span className="font-display text-base font-semibold text-white/85 sm:text-lg">
                    {item.q}
                  </span>
                  <Plus
                    className={cn(
                      "h-5 w-5 shrink-0 text-[#00E676] transition-transform duration-300",
                      isOpen && "rotate-45"
                    )}
                    aria-hidden
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-sm leading-relaxed text-white/50 sm:text-[0.95rem]">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
