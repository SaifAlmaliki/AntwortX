"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQItem = ({
  question,
  answer,
  isRtl,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isRtl: boolean;
  isOpen: boolean;
  onToggle: (nextOpen: boolean) => void;
}) => {
  return (
    <details
      className={cn(
        "group border-b border-border/70 last:border-b-0",
        "[&[open]_summary_.faq-chevron]:rotate-180"
      )}
      open={isOpen}
      onToggle={(e) => {
        onToggle(e.currentTarget.open);
      }}
    >
      <summary
        className={cn(
          "flex w-full cursor-pointer list-none items-center justify-between gap-3 py-4 text-left transition-colors rounded-lg -mx-2 px-2",
          "[&::-webkit-details-marker]:hidden",
          "hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isRtl && "flex-row-reverse text-right"
        )}
      >
        <h3 className="font-display pr-2 text-lg font-medium text-foreground">{question}</h3>
        <ChevronDown
          className="faq-chevron shrink-0 text-primary/80 transition-transform duration-300 ease-out"
          size={22}
          aria-hidden
        />
      </summary>
      <p className={cn("pb-4 leading-relaxed text-muted-foreground", isRtl ? "text-right" : "")}>{answer}</p>
    </details>
  );
};

export const FAQSection = () => {
  const { t, direction, locale } = useLanguage();
  const isRtl = direction === "rtl";
  const reduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = (locale.faq?.questions || []) as FAQItem[];

  return (
    <section
      className={cn(
        "marketing-section border-y border-border/70 bg-card/40 py-16 backdrop-blur-sm",
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
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">{t("faq.title")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t("faq.subtitle")}</p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.1 }}
          className="card-surface section-glow rounded-2xl border-primary/15 p-5 md:p-8 lg:p-10"
        >
          {faqItems.map((item: FAQItem, index: number) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isRtl={isRtl}
              isOpen={openIndex === index}
              onToggle={(nextOpen) => {
                if (nextOpen) setOpenIndex(index);
                else setOpenIndex((current) => (current === index ? null : current));
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
