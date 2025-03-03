"use client";

import { motion } from "framer-motion";
import { Info, Mail, Zap, Code, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SplineSceneBasic } from "@/components/ui/code.demo";
import { useLanguage } from "@/contexts/language-context";

export function HeroSection() {
  const { t, direction, language } = useLanguage();
  
  return (
    <section className="space-y-16 overflow-hidden">
      <div className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center ${direction === 'rtl' ? 'lg:flex-row-reverse' : ''}`}>
        <motion.div 
          className="flex-1 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white ${direction === 'rtl' ? 'text-right' : ''}`}>
            <span className="text-blue-500">{t('home.subtitle').split(' ')[0]}</span> {t('home.subtitle').split(' ').slice(1).join(' ')}
          </h1>
          <p className={`text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 ${direction === 'rtl' ? 'text-right' : ''}`}>
            {t('home.description')}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 ${direction === 'rtl' ? 'sm:flex-row-reverse' : ''}`}>
            <Link href="/about">
              <Button size="lg" className={`gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {direction === 'rtl' ? <Info className="h-4 w-4" /> : null}
                {t('about.title')} 
                {direction === 'ltr' ? <Info className="h-4 w-4" /> : null}
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className={`gap-2 w-full sm:w-auto bg-[#2a2a2a] text-blue-300 hover:bg-[#3a3a3a] hover:text-blue-200 border border-[#444] ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {t('contact.title')} <Mail className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="flex-1 w-full">
          <motion.div
            className="bg-[#0a0a0a] border border-[#222] rounded-lg p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`flex flex-col p-4 bg-[#111] rounded-lg ${direction === 'rtl' ? 'text-right' : ''}`}>
                <Zap className={`h-8 w-8 text-blue-500 mb-2 ${direction === 'rtl' ? 'self-end' : ''}`} />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {language === 'en' ? 'Custom AI Agents' : 'وكلاء ذكاء اصطناعي مخصصين'}
                </h3>
                <p className="text-gray-400">
                  {language === 'en' 
                    ? 'Build AI agents tailored to your specific business needs and use cases' 
                    : 'بناء وكلاء ذكاء اصطناعي مصممة خصيصًا لاحتياجات عملك وحالات الاستخدام'}
                </p>
              </div>
              <div className={`flex flex-col p-4 bg-[#111] rounded-lg ${direction === 'rtl' ? 'text-right' : ''}`}>
                <Code className={`h-8 w-8 text-blue-500 mb-2 ${direction === 'rtl' ? 'self-end' : ''}`} />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {language === 'en' ? 'Easy Integration' : 'تكامل سهل'}
                </h3>
                <p className="text-gray-400">
                  {language === 'en' 
                    ? 'Seamlessly integrate with your existing systems and workflows' 
                    : 'تكامل سلس مع أنظمتك وسير عملك الحالية'}
                </p>
              </div>
              <div className={`flex flex-col p-4 bg-[#111] rounded-lg ${direction === 'rtl' ? 'text-right' : ''}`}>
                <Layers className={`h-8 w-8 text-blue-500 mb-2 ${direction === 'rtl' ? 'self-end' : ''}`} />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {language === 'en' ? 'Knowledge Base' : 'قاعدة المعرفة'}
                </h3>
                <p className="text-gray-400">
                  {language === 'en' 
                    ? 'Train AI agents with your domain-specific knowledge' 
                    : 'تدريب وكلاء الذكاء الاصطناعي بمعرفة المجال المحددة الخاصة بك'}
                </p>
              </div>
              <div className={`flex flex-col p-4 bg-[#111] rounded-lg ${direction === 'rtl' ? 'text-right' : ''}`}>
                <motion.div 
                  className={`h-8 w-8 text-blue-500 mb-2 ${direction === 'rtl' ? 'self-end' : ''}`}
                  animate={{ rotate: [0, 15, 0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
                    <circle cx="12" cy="15" r="1" />
                  </svg>
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {language === 'en' ? 'Secure & Private' : 'آمن وخاص'}
                </h3>
                <p className="text-gray-400">
                  {language === 'en' 
                    ? 'Enterprise-grade security for your sensitive data' 
                    : 'أمان على مستوى المؤسسات لبياناتك الحساسة'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <SplineSceneBasic />
      </motion.div>
    </section>
  );
}
