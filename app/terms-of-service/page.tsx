"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/language-context";
import { BRAND_EMAIL, BRAND_NAME_AR, BRAND_NAME_EN } from "@/lib/brand";

export default function TermsOfServicePage() {
  const { direction, language } = useLanguage();
  const isRtl = direction === "rtl";
  const reduceMotion = useReducedMotion();
  const brand = language === "en" ? BRAND_NAME_EN : BRAND_NAME_AR;
  const isEn = language === "en";

  return (
    <div className={isRtl ? "rtl" : ""}>
      <div className="marketing-section container mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {isEn ? "Terms of Service" : "شروط الخدمة"}
          </h1>
          <p className="text-muted-foreground">
            {isEn ? "Last updated: August 14, 2026" : "آخر تحديث: 14 أغسطس 2026"}
          </p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.1 }}
          className="card-surface section-glow mb-8 rounded-2xl border-primary/15 p-6 sm:p-8"
        >
          <div
            className={`prose prose-invert max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary ${isRtl ? "text-right" : ""}`}
          >
            <h2>{isEn ? "1. Introduction" : "1. مقدمة"}</h2>
            <p>
              {isEn
                ? `Welcome to ${brand}. These Terms of Service govern your use of the Blyzk website, rider app, and shared electric scooter service in Iraq.`
                : `مرحبًا بك في ${brand}. تحكم شروط الخدمة هذه استخدامك لموقع بلايزك وتطبيق الراكب وخدمة السكوتر الكهربائي المشترك في العراق.`}
            </p>
            <p>
              {isEn
                ? "By accessing or using the Service you agree to these Terms. If you disagree with any part of the terms, you may not use the Service."
                : "من خلال الوصول إلى الخدمة أو استخدامها، فإنك توافق على هذه الشروط. إذا كنت لا توافق على أي جزء منها، فلا تستخدم الخدمة."}
            </p>

            <h2>{isEn ? "2. The ride" : "2. الرحلة"}</h2>
            <p>
              {isEn
                ? "Blyzk provides shared electric scooters for short urban trips. You must follow local traffic rules, park in allowed zones, and ride at your own responsibility. Helmets are recommended."
                : "توفّر بلايزك سكوترات كهربائية مشتركة للمشاوير الحضرية القصيرة. يجب الالتزام بقوانين المرور المحلية، والوقوف في المناطق المسموحة، والركوب على مسؤوليتك. نوصي بارتداء خوذة."}
            </p>

            <h2>{isEn ? "3. Communications" : "3. الاتصالات"}</h2>
            <p>
              {isEn
                ? `If you create an account, we may send service messages about rides, receipts, and safety. You can opt out of marketing emails by writing to ${BRAND_EMAIL}.`
                : `إذا أنشأت حسابًا، قد نرسل رسائل خدمة عن الرحلات والإيصالات والسلامة. يمكنك إلغاء الرسائل التسويقية عبر مراسلتنا على ${BRAND_EMAIL}.`}
            </p>

            <h2>{isEn ? "4. Payments" : "4. المدفوعات"}</h2>
            <p>
              {isEn
                ? "Rides are billed per minute at the price shown in the app before you start. Unlock or parking fees, if any, are also shown before the trip begins."
                : "تُحتسب الرحلات بالدقيقة بالسعر الظاهر في التطبيق قبل البدء. أي رسوم فتح أو وقوف تظهر أيضًا قبل الرحلة."}
            </p>

            <h2>{isEn ? "5. Prohibited uses" : "5. الاستخدامات المحظورة"}</h2>
            <p>
              {isEn
                ? "Do not ride under the influence, carry extra passengers, tamper with the scooter, or use the Service for anything unlawful."
                : "لا تركب تحت تأثير مواد مسكرة، ولا تحمل ركابًا إضافيين، ولا تعبث بالسكوتر، ولا تستخدم الخدمة لأي غرض غير قانوني."}
            </p>

            <h2>{isEn ? "6. Changes" : "6. التغييرات"}</h2>
            <p>
              {isEn
                ? "We may update these Terms from time to time. Continued use of the Service after a change means you accept the new Terms."
                : "قد نحدّث هذه الشروط من وقت لآخر. استمرار استخدام الخدمة بعد التغيير يعني قبولك للشروط الجديدة."}
            </p>

            <h2>{isEn ? "7. Contact" : "7. اتصل بنا"}</h2>
            <p>
              {isEn
                ? `Questions about these Terms: ${BRAND_EMAIL}.`
                : `لأسئلة حول هذه الشروط: ${BRAND_EMAIL}.`}
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
