"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageSquare, Upload, Globe, Bot } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

export function HowItWorks() {
  const { t, direction } = useLanguage();
  const reduceMotion = useReducedMotion();

  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 text-cyan-400 md:h-9 md:w-9" />,
      title: t("howItWorks.features.aiChat.title"),
      description: t("howItWorks.features.aiChat.description"),
      key: "aiChat",
    },
    {
      icon: <Upload className="h-8 w-8 text-cyan-400 md:h-9 md:w-9" />,
      title: t("howItWorks.features.knowledgeBase.title"),
      description: t("howItWorks.features.knowledgeBase.description"),
      key: "knowledgeBase",
    },
    {
      icon: <Globe className="h-8 w-8 text-cyan-400 md:h-9 md:w-9" />,
      title: t("howItWorks.features.multilingual.title"),
      description: t("howItWorks.features.multilingual.description"),
      key: "multilingual",
    },
    {
      icon: <Bot className="h-8 w-8 text-cyan-400 md:h-9 md:w-9" />,
      title: t("howItWorks.features.learning.title"),
      description: t("howItWorks.features.learning.description"),
      key: "learning",
    },
  ];

  const formatTitleWithBrandMark = (title: string) => {
    if (title.includes("Zempar_")) {
      const parts = title.split("Zempar_");
      return (
        <>
          {parts[0]}
          <span className="text-white">Zem</span>
          <span className="text-gradient-signal">par</span>
          {parts[1]}
        </>
      );
    }
    if (title.includes("Zempar")) {
      const parts = title.split("Zempar");
      return (
        <>
          {parts[0]}
          <span className="text-white">Zem</span>
          <span className="text-gradient-signal">par</span>
          {parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <section className="marketing-section py-12 md:py-20">
      <div className={cn("mb-12 text-center md:mb-16", direction === "rtl" ? "rtl" : "")}>
        <motion.h2
          className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          {formatTitleWithBrandMark(t("howItWorks.title"))}
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-lg text-slate-400"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.08 }}
        >
          {t("howItWorks.subtitle")}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.key}
            className="min-w-0"
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.5,
              delay: reduceMotion ? 0 : 0.08 + index * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Card
              className={cn(
                "bg-transparent text-white shadow-none card-surface group h-full border-cyan-500/10 hover:-translate-y-0.5",
                direction === "rtl" ? "rtl" : ""
              )}
            >
              <CardHeader className={cn(direction === "rtl" ? "text-right" : "")}>
                <div className={cn("mb-2", direction === "rtl" ? "flex justify-end" : "")}>{feature.icon}</div>
                <CardTitle className="font-display text-xl text-white sm:text-2xl">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription
                  className={cn(
                    "text-base leading-relaxed text-slate-400",
                    direction === "rtl" ? "text-right" : ""
                  )}
                >
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
