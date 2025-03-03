"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { Footer } from "@/components/Footer";

export default function SolutionsPage() {
  const { t, direction, language } = useLanguage();
  
  const solutions = [
    {
      title: language === 'en' ? 'Customer Service' : 'خدمة العملاء',
      description: language === 'en' 
        ? 'AI agents that handle customer inquiries, provide support, and resolve issues 24/7.' 
        : 'وكلاء الذكاء الاصطناعي الذين يتعاملون مع استفسارات العملاء، ويقدمون الدعم، ويحلون المشكلات على مدار الساعة طوال أيام الأسبوع.',
    },
    {
      title: language === 'en' ? 'Sales Assistance' : 'مساعدة المبيعات',
      description: language === 'en' 
        ? 'AI agents that qualify leads, answer product questions, and guide customers through the sales process.' 
        : 'وكلاء الذكاء الاصطناعي الذين يؤهلون العملاء المحتملين، ويجيبون على أسئلة المنتج، ويوجهون العملاء خلال عملية البيع.',
    },
    {
      title: language === 'en' ? 'Internal Knowledge Management' : 'إدارة المعرفة الداخلية',
      description: language === 'en' 
        ? 'AI agents that help employees find information, documents, and answers to internal questions.' 
        : 'وكلاء الذكاء الاصطناعي الذين يساعدون الموظفين في العثور على المعلومات والمستندات والإجابات على الأسئلة الداخلية.',
    },
    {
      title: language === 'en' ? 'Data Analysis' : 'تحليل البيانات',
      description: language === 'en' 
        ? 'AI agents that analyze data, generate reports, and provide insights to help make better business decisions.' 
        : 'وكلاء الذكاء الاصطناعي الذين يحللون البيانات وينشئون التقارير ويقدمون رؤى للمساعدة في اتخاذ قرارات أعمال أفضل.',
    },
  ];

  return (
    <div>
      <main className="container mx-auto px-4 sm:px-6 py-16 max-w-7xl">
        <div className={`text-center mb-16 ${direction === 'rtl' ? 'rtl' : ''}`}>
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {language === 'en' ? 'Our Solutions' : 'حلولنا'}
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {language === 'en' 
              ? 'Discover how our custom AI agents can transform your business across various domains' 
              : 'اكتشف كيف يمكن لوكلاء الذكاء الاصطناعي المخصصين لدينا تحويل أعمالك عبر مختلف المجالات'}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              className={`bg-[#0a0a0a] border border-[#222] rounded-lg p-8 ${direction === 'rtl' ? 'rtl text-right' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ 
                boxShadow: "0 8px 32px rgba(0, 112, 243, 0.1)",
                borderColor: "rgba(59, 130, 246, 0.3)",
                y: -5
              }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">{solution.title}</h2>
              <p className="text-gray-400">{solution.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            {language === 'en' ? 'Ready to transform your business?' : 'هل أنت مستعد لتحويل عملك؟'}
          </h2>
          <Link href="/contact">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
              {language === 'en' ? 'Contact Us' : 'اتصل بنا'}
            </button>
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
