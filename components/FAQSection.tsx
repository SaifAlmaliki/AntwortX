"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

type FAQItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
  isRtl: boolean;
};

interface FAQItem {
  question: string;
  answer: string;
}

const FAQItem = ({
  question,
  answer,
  isOpen,
  toggleOpen,
  isRtl,
  reduceMotion,
}: FAQItemProps & { reduceMotion: boolean | null }) => {
  return (
    <div className="border-b border-cyan-500/10 last:border-b-0">
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        className={cn(
          "flex w-full items-center justify-between gap-3 py-4 text-left transition-colors rounded-lg -mx-2 px-2",
          "hover:bg-cyan-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(8,10,15,0.95)]",
          isRtl && "flex-row-reverse text-right"
        )}
      >
        <h3 className="text-lg font-medium text-white font-display pr-2">{question}</h3>
        <span className="shrink-0 text-cyan-400/80" aria-hidden>
          {isOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
        </span>
      </button>
      {reduceMotion ? (
        isOpen ? (
          <p className={cn("pb-4 text-slate-300 leading-relaxed", isRtl ? "text-right" : "")}>{answer}</p>
        ) : null
      ) : (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className={cn("pb-4 text-slate-300 leading-relaxed", isRtl ? "text-right" : "")}>{answer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export const FAQSection = () => {
  const { t, direction, locale } = useLanguage();
  const isRtl = direction === "rtl";
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = (locale.faq?.questions || []) as FAQItem[];

  return (
    <section
      className={cn(
        "marketing-section border-y border-cyan-500/10 bg-[rgba(6,8,12,0.4)] py-16 backdrop-blur-sm",
        isRtl ? "rtl" : ""
      )}
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className={cn("mb-12 text-center", isRtl ? "text-right" : "")}
        >
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">{t("faq.title")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">{t("faq.subtitle")}</p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.1 }}
          className="card-surface section-glow rounded-2xl border-cyan-500/15 p-5 md:p-8 lg:p-10"
        >
          {faqItems.map((item: FAQItem, index: number) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              toggleOpen={() => toggleFAQ(index)}
              isRtl={isRtl}
              reduceMotion={reduceMotion}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
