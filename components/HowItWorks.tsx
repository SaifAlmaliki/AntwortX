"use client";

import { motion } from "framer-motion";
import { MessageSquare, Upload, Globe, Bot } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

export function HowItWorks() {
  const { t, direction } = useLanguage();
  
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
      title: t("howItWorks.features.aiChat.title"),
      description: t("howItWorks.features.aiChat.description"),
      key: "aiChat"
    },
    {
      icon: <Upload className="h-8 w-8 text-blue-500" />,
      title: t("howItWorks.features.knowledgeBase.title"),
      description: t("howItWorks.features.knowledgeBase.description"),
      key: "knowledgeBase"
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: t("howItWorks.features.multilingual.title"),
      description: t("howItWorks.features.multilingual.description"),
      key: "multilingual"
    },
    {
      icon: <Bot className="h-8 w-8 text-blue-500" />,
      title: t("howItWorks.features.learning.title"),
      description: t("howItWorks.features.learning.description"),
      key: "learning"
    }
  ];

  // Function to format the title with blue X
  const formatTitleWithBlueX = (title: string) => {
    // Handle the special marker for Arabic
    if (title.includes('Intelligent_Proxy_')) {
      const parts = title.split('Intelligent_Proxy_');
      return (
        <>
          {parts[0]}<span className="text-white">Intelligent</span><span className="text-blue-500">Proxy</span>{parts[1]}
        </>
      );
    }
    // Handle the regular Intelligent Proxy for English
    else if (title.includes('Intelligent Proxy')) {
      const parts = title.split('Intelligent Proxy');
      return (
        <>
          {parts[0]}<span className="text-white">Intelligent</span><span className="text-blue-500">Proxy</span>{parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <section className="py-16">
      <div className={`text-center mb-12 ${direction === 'rtl' ? 'rtl' : ''}`}>
        <motion.h2 
          className="text-3xl sm:text-4xl font-bold mb-4 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {formatTitleWithBlueX(t("howItWorks.title"))}
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t("howItWorks.subtitle")}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
          >
            <Card className={`h-full bg-[#0a0a0a] border-[#222] shadow-lg hover:shadow-xl transition-shadow ${direction === 'rtl' ? 'rtl' : ''}`}>
              <CardHeader className={direction === 'rtl' ? 'text-right' : ''}>
                <div className={`mb-2 ${direction === 'rtl' ? 'flex justify-end' : ''}`}>{feature.icon}</div>
                <CardTitle className="text-xl sm:text-2xl text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={`text-gray-400 text-base ${direction === 'rtl' ? 'text-right' : ''}`}>
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
