"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

type FAQItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
  isRtl: boolean;
};

const FAQItem = ({ question, answer, isOpen, toggleOpen, isRtl }: FAQItemProps) => {
  return (
    <div className="border-b border-gray-700 last:border-b-0">
      <button
        onClick={toggleOpen}
        className={`w-full flex items-center justify-between py-4 text-left ${isRtl ? 'flex-row-reverse' : ''}`}
      >
        <h3 className="text-lg font-medium text-white">{question}</h3>
        <span className="text-gray-400 ml-2">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className={`pb-4 text-gray-300 ${isRtl ? 'text-right' : ''}`}>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQSection = () => {
  const { t, direction, locale } = useLanguage();
  const isRtl = direction === "rtl";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Access the FAQ items from the locale object directly
  const faqItems = locale.faq?.questions || [];

  return (
    <section className={`py-16 bg-[#0a0a0a] ${isRtl ? 'rtl' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`text-center mb-12 ${isRtl ? 'text-right' : ''}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#111] border border-[#222] rounded-lg p-6 md:p-8"
        >
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              toggleOpen={() => toggleFAQ(index)}
              isRtl={isRtl}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
