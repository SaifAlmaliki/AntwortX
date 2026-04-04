"use client";

import { useMemo } from "react";
import { useLanguage } from "@/contexts/language-context";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Globe, Users, Lightbulb, Award } from "lucide-react";

export default function AboutPage() {
  const { t, direction, language } = useLanguage();
  const isRtl = direction === "rtl";
  const reduceMotion = useReducedMotion();

  // Define expertise areas for each language to ensure proper display
  const expertiseAreas = language === 'ar' ? [
    {
      title: "أبحاث وتطوير الذكاء الاصطناعي",
      description: "باحثونا ومطورونا في مجال الذكاء الاصطناعي لديهم خبرة عميقة في التعلم الآلي ومعالجة اللغة الطبيعية وأنظمة الذكاء الوكيلي المصممة لعمليات الإنتاج.",
      icon: <Lightbulb className="h-10 w-10 text-primary" />
    },
    {
      title: "هندسة الحلول",
      description: "مهندسو الحلول لدينا يصممون تطبيقات ذكاء اصطناعي قوية وقابلة للتوسع تتكامل بسلاسة مع أنظمة الأعمال الحالية.",
      icon: <Globe className="h-10 w-10 text-primary" />
    },
    {
      title: "تصميم واجهات المستخدم",
      description: "نصمم تجارب سهلة للمشغلين حتى تتمكن الفرق من الإشراف على الوكلاء ومراجعة الإجراءات والبقاء متحكمين دون صراع مع الأدوات.",
      icon: <Users className="h-10 w-10 text-primary" />
    },
    {
      title: "تكامل المؤسسات",
      description: "مع خبرتنا في نشر حلول الذكاء الاصطناعي عبر مختلف الصناعات، نضمن التنفيذ السلس في بيئات المؤسسات المعقدة.",
      icon: <Award className="h-10 w-10 text-primary" />
    }
  ] : [
    {
      title: "AI Research & Development",
      description: "Our AI researchers and developers have deep expertise in machine learning, NLP, and agentic AI systems built for production operations.",
      icon: <Lightbulb className="h-10 w-10 text-primary" />
    },
    {
      title: "Solution Architecture",
      description: "Our solution architects design robust, scalable AI implementations that integrate seamlessly with existing business systems.",
      icon: <Globe className="h-10 w-10 text-primary" />
    },
    {
      title: "UX/UI Design",
      description: "We design operator-friendly experiences so teams can supervise agents, review actions, and stay in control without fighting the tooling.",
      icon: <Users className="h-10 w-10 text-primary" />
    },
    {
      title: "Enterprise Integration",
      description: "With expertise in deploying AI solutions across various industries, we ensure smooth implementation in complex enterprise environments.",
      icon: <Award className="h-10 w-10 text-primary" />
    }
  ];

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: reduceMotion ? 1 : 0 },
      visible: {
        opacity: 1,
        transition: reduceMotion ? { duration: 0 } : { staggerChildren: 0.1 },
      },
    }),
    [reduceMotion]
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { y: reduceMotion ? 0 : 20, opacity: reduceMotion ? 1 : 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: reduceMotion ? 0 : 0.5 },
      },
    }),
    [reduceMotion]
  );

  return (
    <div className={`min-h-screen ${isRtl ? "rtl" : ""}`}>
      {/* Hero Section */}
      <section className="marketing-section relative pt-12 pb-12 md:pt-24 md:pb-20">
        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            className="mb-16 text-center"
          >
            <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl mb-6 tracking-tight">
              {t("about.title") || "About Zempar"}
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              {t("about.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="marketing-section py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl mb-6">
              {t("about.who.title") || "Who We Are"}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              {t("about.who.description") || 
                "We are a team of AI experts and solution architects who have worked on groundbreaking projects across Germany, the UK, and Canada. Our passion lies in building AI agent solutions that help businesses drive more value."}
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {expertiseAreas.map((area, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card-surface flex min-w-0 flex-col items-center rounded-xl p-6 text-center"
              >
                <div className="mb-4">{area.icon}</div>
                <h3 className="mb-3 min-w-0 max-w-full text-pretty text-xl font-bold text-foreground">
                  {area.title}
                </h3>
                <p className="min-w-0 max-w-full text-pretty leading-relaxed text-muted-foreground">
                  {area.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Expertise */}
      <section className="marketing-section bg-gradient-to-b from-[rgba(6,8,12,0.6)] to-transparent py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl mb-6">
              {t("about.expertise.title") || "Our Expertise"}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              {t("about.expertise.description") || 
                "Combining deep technical knowledge with industry experience to deliver cutting-edge AI solutions"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.5 }}
              viewport={{ once: true }}
              className="card-surface min-w-0 rounded-xl p-8"
            >
              <div className="flex min-w-0 items-start gap-4">
                <div className="shrink-0 rounded-lg bg-primary/15 p-3">
                  <Globe className="h-6 w-6 text-primary" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="mb-3 text-pretty text-xl font-bold text-foreground">
                    {t("about.expertise.global.title") || "Global Experience"}
                  </h3>
                  <p className="text-pretty leading-relaxed text-muted-foreground">
                    {t("about.expertise.global.description") || 
                      "Our team brings diverse perspectives from working on AI projects across three continents, giving us unique insights into global operational and rollout requirements."}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.5 }}
              viewport={{ once: true }}
              className="card-surface min-w-0 rounded-xl p-8"
            >
              <div className="flex min-w-0 items-start gap-4">
                <div className="shrink-0 rounded-lg bg-primary/15 p-3">
                  <Users className="h-6 w-6 text-primary" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="mb-3 text-pretty text-xl font-bold text-foreground">
                    {t("about.expertise.team.title") || "Cross-functional Team"}
                  </h3>
                  <p className="text-pretty leading-relaxed text-muted-foreground">
                    {t("about.expertise.team.description") || 
                      "Our experts span AI research, software engineering, UX design, and business strategy - creating holistic solutions that excel technically and commercially."}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.1 }}
              viewport={{ once: true }}
              className="card-surface min-w-0 rounded-xl p-8"
            >
              <div className="flex min-w-0 items-start gap-4">
                <div className="shrink-0 rounded-lg bg-primary/15 p-3">
                  <Lightbulb className="h-6 w-6 text-primary" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="mb-3 text-pretty text-xl font-bold text-foreground">
                    {t("about.expertise.innovation.title") || "Innovation Focus"}
                  </h3>
                  <p className="text-pretty leading-relaxed text-muted-foreground">
                    {t("about.expertise.innovation.description") || 
                      "We stay at the edge of agentic AI, tool use, and workflow automation—bringing practical patterns into production, not just demos."}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.1 }}
              viewport={{ once: true }}
              className="card-surface min-w-0 rounded-xl p-8"
            >
              <div className="flex min-w-0 items-start gap-4">
                <div className="shrink-0 rounded-lg bg-primary/15 p-3">
                  <Award className="h-6 w-6 text-primary" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="mb-3 text-pretty text-xl font-bold text-foreground">
                    {t("about.expertise.results.title") || "Results-Driven"}
                  </h3>
                  <p className="text-pretty leading-relaxed text-muted-foreground">
                    {t("about.expertise.results.description") || 
                      "We measure what operations care about: cycle time, error rates, throughput, and human time saved—so automation shows up in the metrics that matter."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="marketing-section py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            viewport={{ once: true }}
            className="section-glow rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/90 via-primary/75 to-accent/85 p-8 text-center shadow-signal-lg md:p-12"
          >
            <h2 className="font-display mb-4 text-balance text-3xl font-bold text-foreground">
              {t("about.cta.title")}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-foreground/90">
              {t("about.cta.description")}
            </p>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] min-w-0 items-center justify-center rounded-full bg-background px-8 py-3 font-semibold text-foreground shadow-lg transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              {t("about.cta.button") || "Contact Us Today"}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
