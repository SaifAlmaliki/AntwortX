"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

export default function SolutionsPage() {
  const { direction, language } = useLanguage();
  const reduceMotion = useReducedMotion();

  const solutions = [
    {
      title: language === "en" ? "AI Ops" : "عمليات الذكاء الاصطناعي",
      description:
        language === "en"
          ? "Operational automation for triage, routing, and repeatable tasks—so teams resolve issues faster with consistent playbooks."
          : "أتمتة تشغيلية للفرز والتوجيه والمهام المتكررة—لحل المشكلات أسرع بلعب تشغيلية متسقة.",
    },
    {
      title: language === "en" ? "Agentic workflows" : "سير عمل وكيلي",
      description:
        language === "en"
          ? "Autonomous agents that plan multi-step work, call your tools and APIs, and execute workflows with human-in-the-loop guardrails."
          : "وكلاء مستقلون يخططون لعمل متعدد الخطوات ويستدعون أدواتك وواجهاتك وينفذون سير عمل بضوابط وإشراف بشري عند الحاجة.",
    },
    {
      title: language === "en" ? "Operational knowledge" : "المعرفة التشغيلية",
      description:
        language === "en"
          ? "Ground agents in runbooks, SOPs, tickets, and docs so answers and actions match how your organization actually runs."
          : "تثبيت الوكلاء في أدلة التشغيل وإجراءات العمل والتذاكر والوثائق لتتوافق الإجابات والإجراءات مع تشغيل مؤسستك فعليًا.",
    },
    {
      title: language === "en" ? "Insights for operators" : "رؤى للمشغلين",
      description:
        language === "en"
          ? "Summaries, reports, and signals from operational data—so leaders and on-call teams decide faster with less manual digging."
          : "ملخصات وتقارير وإشارات من البيانات التشغيلية—لاتخاذ قرارات أسرع للقادة وفرق المناوبة دون بحث يدوي مكثف.",
    },
  ];

  return (
    <div>
      <div className="marketing-section container mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className={cn("mb-16 text-center", direction === "rtl" ? "rtl" : "")}>
          <motion.h1
            className="font-display mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {language === "en" ? "Our Solutions" : "حلولنا"}
          </motion.h1>
          <motion.p
            className="mx-auto max-w-3xl text-xl text-muted-foreground"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.1 }}
          >
            {language === "en"
              ? "AI Ops and agentic AI that connect your stack, automate work, and make day-to-day operations smarter and faster"
              : "عمليات الذكاء الاصطناعي وذكاء وكيلي يربط أنظمتك ويؤتمت العمل ويجعل العمليات اليومية أذكى وأسرع"}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              className={cn(
                "card-surface rounded-2xl border-primary/12 p-8",
                direction === "rtl" ? "rtl text-right" : ""
              )}
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.15 + index * 0.08 }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -4,
                      boxShadow: "0 0 0 1px rgba(34, 211, 238, 0.2), 0 24px 48px -20px rgba(34, 211, 238, 0.2)",
                    }
              }
            >
              <h2 className="font-display mb-4 text-2xl font-bold text-foreground">{solution.title}</h2>
              <p className="leading-relaxed text-muted-foreground">{solution.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-20 text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.5 }}
        >
          <h2 className="font-display mb-6 text-2xl font-bold text-foreground md:text-3xl">
            {language === "en" ? "Ready to transform your business?" : "هل أنت مستعد لتحويل عملك؟"}
          </h2>
          <Link href="/contact" className="inline-flex justify-center">
            <span className="btn-signal-primary px-10 py-3 text-base">
              {language === "en" ? "Contact Us" : "اتصل بنا"}
            </span>
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
