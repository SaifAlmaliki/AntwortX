"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Search, FileText, Sparkles, LineChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

export function HowItWorks() {
  const { t, direction } = useLanguage();
  const reduceMotion = useReducedMotion();

  const features = [
    {
      icon: <Search className="h-8 w-8 text-primary md:h-9 md:w-9" aria-hidden />,
      title: t("howItWorks.features.aiChat.title"),
      description: t("howItWorks.features.aiChat.description"),
      key: "aiChat",
    },
    {
      icon: <FileText className="h-8 w-8 text-primary md:h-9 md:w-9" aria-hidden />,
      title: t("howItWorks.features.knowledgeBase.title"),
      description: t("howItWorks.features.knowledgeBase.description"),
      key: "knowledgeBase",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary md:h-9 md:w-9" aria-hidden />,
      title: t("howItWorks.features.multilingual.title"),
      description: t("howItWorks.features.multilingual.description"),
      key: "multilingual",
    },
    {
      icon: <LineChart className="h-8 w-8 text-primary md:h-9 md:w-9" aria-hidden />,
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
          <span className="text-foreground">Zem</span>
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
          <span className="text-foreground">Zem</span>
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
          className="font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          {formatTitleWithBrandMark(t("howItWorks.title"))}
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
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
                "group card-surface h-full overflow-visible border-primary/10 bg-transparent text-foreground shadow-none hover:-translate-y-0.5",
                direction === "rtl" ? "rtl" : ""
              )}
            >
              <CardHeader className={cn("overflow-visible", direction === "rtl" ? "text-right" : "")}>
                <div className={cn("mb-2", direction === "rtl" ? "flex justify-end" : "")}>{feature.icon}</div>
                <CardTitle className="font-display pb-0.5 text-xl leading-relaxed text-foreground sm:text-2xl sm:leading-relaxed">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription
                  className={cn(
                    "text-base leading-relaxed text-muted-foreground",
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
