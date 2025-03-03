"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { Footer } from "@/components/Footer";

export default function TermsOfServicePage() {
  const { direction, language } = useLanguage();
  const isRtl = direction === 'rtl';

  return (
    <div className={isRtl ? 'rtl' : ''}>
      <main className="container mx-auto px-4 sm:px-6 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            {language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}
          </h1>
          <p className="text-gray-400">
            {language === 'en' 
              ? 'Last updated: March 2, 2025' 
              : '2 مارس 2025 :آخر تحديث'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#111] border border-[#222] rounded-lg p-6 sm:p-8 mb-8"
        >
          <div className={`prose prose-invert max-w-none ${isRtl ? 'text-right' : ''}`}>
            <h2>{language === 'en' ? '1. Introduction' : '1. مقدمة'}</h2>
            <p>
              {language === 'en' 
                ? 'Welcome to antwortX ("Company", "we", "our", "us")! These Terms of Service ("Terms", "Terms of Service") govern your use of our website and AI agent platform (together or individually "Service") operated by antwortX.' 
                : 'مرحبًا بك في antwortX ("الشركة"، "نحن"، "لنا")! تحكم شروط الخدمة هذه ("الشروط"، "شروط الخدمة") استخدامك لموقعنا الإلكتروني ومنصة وكيل الذكاء الاصطناعي (معًا أو بشكل فردي "الخدمة") التي تديرها antwortX.'}
            </p>
            <p>
              {language === 'en' 
                ? 'Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages. Please read it here: Privacy Policy.' 
                : 'تحكم سياسة الخصوصية الخاصة بنا أيضًا استخدامك لخدمتنا وتوضح كيفية جمعنا وحماية والكشف عن المعلومات الناتجة عن استخدامك لصفحات الويب الخاصة بنا. يرجى قراءتها هنا: سياسة الخصوصية.'}
            </p>
            <p>
              {language === 'en' 
                ? 'By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.' 
                : 'من خلال الوصول إلى الخدمة أو استخدامها، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على أي جزء من الشروط، فقد لا تتمكن من الوصول إلى الخدمة.'}
            </p>

            <h2>{language === 'en' ? '2. Communications' : '2. الاتصالات'}</h2>
            <p>
              {language === 'en' 
                ? 'By creating an Account on our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by emailing us at contact@antwortx.com.' 
                : 'من خلال إنشاء حساب على خدمتنا، فإنك توافق على الاشتراك في النشرات الإخبارية أو المواد التسويقية أو الترويجية وغيرها من المعلومات التي قد نرسلها. ومع ذلك، يمكنك إلغاء الاشتراك في أي من هذه الاتصالات أو جميعها منا باتباع رابط إلغاء الاشتراك أو عن طريق مراسلتنا عبر البريد الإلكتروني على contact@antwortx.com.'}
            </p>

            <h2>{language === 'en' ? '3. Subscriptions' : '3. الاشتراكات'}</h2>
            <p>
              {language === 'en' 
                ? 'Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis, depending on the type of subscription plan you select. Billing cycles are set on a monthly or annual basis.' 
                : 'يتم فوترة بعض أجزاء الخدمة على أساس الاشتراك. سيتم محاسبتك مقدمًا على أساس متكرر ودوري، اعتمادًا على نوع خطة الاشتراك التي تختارها. يتم تعيين دورات الفوترة على أساس شهري أو سنوي.'}
            </p>
            <p>
              {language === 'en' 
                ? 'At the end of each billing period, your subscription will automatically renew under the exact same conditions unless you cancel it or antwortX cancels it. You may cancel your subscription renewal either through your online account management page or by contacting our customer support team.' 
                : 'في نهاية كل فترة فوترة، سيتم تجديد اشتراكك تلقائيًا بنفس الشروط تمامًا ما لم تقم بإلغائه أو تقوم antwortX بإلغائه. يمكنك إلغاء تجديد اشتراكك إما من خلال صفحة إدارة حسابك عبر الإنترنت أو عن طريق الاتصال بفريق دعم العملاء لدينا.'}
            </p>

            <h2>{language === 'en' ? '4. Content' : '4. المحتوى'}</h2>
            <p>
              {language === 'en' 
                ? 'Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.' 
                : 'تتيح لك خدمتنا نشر معلومات معينة أو نصوص أو رسومات أو مقاطع فيديو أو مواد أخرى ("المحتوى") أو ربطها أو تخزينها أو مشاركتها وإتاحتها بطريقة أخرى. أنت مسؤول عن المحتوى الذي تنشره على الخدمة أو من خلالها، بما في ذلك قانونيته وموثوقيته وملاءمته.'}
            </p>
            <p>
              {language === 'en' 
                ? 'By posting Content on or through our Service, you represent and warrant that: (i) the Content is yours and/or you have the right to use it and the right to grant us the rights and license as provided in these Terms, and (ii) that the posting of your Content on or through our Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person or entity.' 
                : 'من خلال نشر المحتوى على خدمتنا أو من خلالها، فإنك تقر وتضمن أن: (1) المحتوى ملك لك و/أو لديك الحق في استخدامه والحق في منحنا الحقوق والترخيص كما هو منصوص عليه في هذه الشروط، و (2) أن نشر المحتوى الخاص بك على خدمتنا أو من خلالها لا ينتهك حقوق الخصوصية أو حقوق الدعاية أو حقوق النشر أو حقوق العقد أو أي حقوق أخرى لأي شخص أو كيان.'}
            </p>

            <h2>{language === 'en' ? '5. Prohibited Uses' : '5. الاستخدامات المحظورة'}</h2>
            <p>
              {language === 'en' 
                ? 'You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use our Service for any purpose that is unlawful or prohibited by these Terms.' 
                : 'يجوز لك استخدام خدمتنا فقط للأغراض القانونية ووفقًا لهذه الشروط. أنت توافق على عدم استخدام خدمتنا لأي غرض غير قانوني أو محظور بموجب هذه الشروط.'}
            </p>

            <h2>{language === 'en' ? '6. Changes to Terms' : '6. التغييرات في الشروط'}</h2>
            <p>
              {language === 'en' 
                ? 'We reserve the right to modify these terms from time to time at our sole discretion. Therefore, you should review these pages periodically. When we change the Terms in a material manner, we will notify you that material changes have been made to the Terms. Your continued use of the Website or our Service after any such change constitutes your acceptance of the new Terms.' 
                : 'نحتفظ بالحق في تعديل هذه الشروط من وقت لآخر وفقًا لتقديرنا الخاص. لذلك، يجب عليك مراجعة هذه الصفحات بشكل دوري. عندما نغير الشروط بطريقة جوهرية، سنخطرك بأنه تم إجراء تغييرات جوهرية على الشروط. استمرار استخدامك للموقع الإلكتروني أو خدمتنا بعد أي تغيير من هذا القبيل يشكل قبولك للشروط الجديدة.'}
            </p>

            <h2>{language === 'en' ? '7. Contact Us' : '7. اتصل بنا'}</h2>
            <p>
              {language === 'en' 
                ? 'If you have any questions about these Terms, please contact us at contact@antwortx.com.' 
                : 'إذا كانت لديك أي أسئلة حول هذه الشروط، يرجى الاتصال بنا على contact@antwortx.com.'}
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
