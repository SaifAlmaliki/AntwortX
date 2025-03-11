"use client";

import { useLanguage } from "@/contexts/language-context";
import { Squares } from "@/components/ui/squares-background";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Globe, Users, Lightbulb, Award } from "lucide-react";

export default function AboutPage() {
  const { t, direction, language } = useLanguage();
  const isRtl = direction === 'rtl';

  // Define expertise areas for each language to ensure proper display
  const expertiseAreas = language === 'ar' ? [
    {
      title: "أبحاث وتطوير الذكاء الاصطناعي",
      description: "باحثونا ومطورونا في مجال الذكاء الاصطناعي لديهم خبرة عميقة في التعلم الآلي ومعالجة اللغة الطبيعية وأنظمة الذكاء الاصطناعي المحادثية.",
      icon: <Lightbulb className="h-10 w-10 text-blue-500" />
    },
    {
      title: "هندسة الحلول",
      description: "مهندسو الحلول لدينا يصممون تطبيقات ذكاء اصطناعي قوية وقابلة للتوسع تتكامل بسلاسة مع أنظمة الأعمال الحالية.",
      icon: <Globe className="h-10 w-10 text-blue-500" />
    },
    {
      title: "تصميم واجهات المستخدم",
      description: "نقوم بإنشاء واجهات بديهية تجعل تقنية الذكاء الاصطناعي سهلة الوصول والاستخدام للشركات وعملائها.",
      icon: <Users className="h-10 w-10 text-blue-500" />
    },
    {
      title: "تكامل المؤسسات",
      description: "مع خبرتنا في نشر حلول الذكاء الاصطناعي عبر مختلف الصناعات، نضمن التنفيذ السلس في بيئات المؤسسات المعقدة.",
      icon: <Award className="h-10 w-10 text-blue-500" />
    }
  ] : [
    {
      title: "AI Research & Development",
      description: "Our AI researchers and developers have deep expertise in machine learning, natural language processing, and conversational AI systems.",
      icon: <Lightbulb className="h-10 w-10 text-blue-500" />
    },
    {
      title: "Solution Architecture",
      description: "Our solution architects design robust, scalable AI implementations that integrate seamlessly with existing business systems.",
      icon: <Globe className="h-10 w-10 text-blue-500" />
    },
    {
      title: "UX/UI Design",
      description: "We create intuitive interfaces that make AI technology accessible and easy to use for businesses and their customers.",
      icon: <Users className="h-10 w-10 text-blue-500" />
    },
    {
      title: "Enterprise Integration",
      description: "With expertise in deploying AI solutions across various industries, we ensure smooth implementation in complex enterprise environments.",
      icon: <Award className="h-10 w-10 text-blue-500" />
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className={`min-h-screen bg-black ${isRtl ? 'rtl' : ''}`}>
      <Squares />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {t("about.title") || "About Intelligent Proxy"}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t("about.subtitle") || "Pioneering AI-powered customer support solutions"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-gradient-to-b from-transparent to-[#0a0a0a]">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-[#111] border border-[#222] rounded-2xl p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-white mb-6">
                  {t("about.mission.title") || "Our Mission"}
                </h2>
                <p className="text-gray-300 mb-4">
                  {t("about.mission.description") || 
                    "At Intelligent Proxy, we're on a mission to transform customer support through advanced AI technology. We believe businesses shouldn't have to choose between efficiency and quality when it comes to customer service."}
                </p>
                <p className="text-gray-300">
                  {t("about.mission.vision") || 
                    "Our vision is to create AI agents that understand, learn, and evolve - providing personalized support that feels genuinely human while delivering the consistency and availability only machines can offer."}
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full h-64 md:h-80">
                  <Image 
                    src="/about/mission.jpg" 
                    alt="Intelligent Proxy Mission" 
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t("about.who.title") || "Who We Are"}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
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
                className="bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col items-center text-center"
              >
                <div className="mb-4">
                  {area.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{area.title}</h3>
                <p className="text-gray-300">{area.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Expertise */}
      <section className="py-16 bg-gradient-to-b from-[#0a0a0a] to-transparent">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t("about.expertise.title") || "Our Expertise"}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t("about.expertise.description") || 
                "Combining deep technical knowledge with industry experience to deliver cutting-edge AI solutions"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-[#111] border border-[#222] rounded-xl p-8"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <Globe className="text-blue-500 h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t("about.expertise.global.title") || "Global Experience"}
                  </h3>
                  <p className="text-gray-300">
                    {t("about.expertise.global.description") || 
                      "Our team brings diverse perspectives from working on AI projects across three continents, giving us unique insights into global customer service needs."}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-[#111] border border-[#222] rounded-xl p-8"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <Users className="text-blue-500 h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t("about.expertise.team.title") || "Cross-functional Team"}
                  </h3>
                  <p className="text-gray-300">
                    {t("about.expertise.team.description") || 
                      "Our experts span AI research, software engineering, UX design, and business strategy - creating holistic solutions that excel technically and commercially."}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-[#111] border border-[#222] rounded-xl p-8"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <Lightbulb className="text-blue-500 h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t("about.expertise.innovation.title") || "Innovation Focus"}
                  </h3>
                  <p className="text-gray-300">
                    {t("about.expertise.innovation.description") || 
                      "We're constantly pushing boundaries, researching and implementing the latest advancements in natural language processing and conversational AI."}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-[#111] border border-[#222] rounded-xl p-8"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <Award className="text-blue-500 h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t("about.expertise.results.title") || "Results-Driven"}
                  </h3>
                  <p className="text-gray-300">
                    {t("about.expertise.results.description") || 
                      "Our solutions are designed with measurable business outcomes in mind - from reducing support costs to improving customer satisfaction and retention."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              {t("about.cta.title") || "Ready to transform your customer support?"}
            </h2>
            <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
              {t("about.cta.description") || 
                "Join the businesses already using Intelligent Proxy to deliver exceptional customer experiences at scale."}
            </p>
            <Link href="/contact">
              <button className="bg-white text-blue-600 font-medium px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                {t("about.cta.button") || "Contact Us Today"}
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
