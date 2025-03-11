"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { NewsletterSubscribe } from "./NewsletterSubscribe";

export function Footer() {
  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-[#0a0a0a] border-t border-[#222] py-8 ${isRtl ? 'rtl' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Logo and description */}
          <div className="col-span-1">
            <div className="text-2xl font-bold text-white mb-3">
              <span className="text-white">Intelligent</span><span className="text-blue-500">Proxy</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {t("footer.description") || "Comprehensive AI solutions from strategy to execution and implementation for businesses of all sizes."}
            </p>
            <div className={`flex ${isRtl ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <Link href="https://github.com" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Github size={20} />
              </Link>
              <Link href="https://twitter.com" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="https://linkedin.com" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">{t("footer.product")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-blue-500 transition-colors">{t("nav.home")}</Link></li>
              <li><Link href="/solutions" className="text-gray-400 hover:text-blue-500 transition-colors">{t("nav.solutions")}</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-blue-500 transition-colors">{t("footer.pricing")}</Link></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">{t("footer.company")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-blue-500 transition-colors">{t("footer.about")}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-blue-500 transition-colors">{t("footer.contact")}</Link></li>
              <li><Link href="/terms-of-service" className="text-gray-400 hover:text-blue-500 transition-colors">{t("footer.terms")}</Link></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="col-span-1">
            <NewsletterSubscribe />
          </div>
        </div>
        
        <div className={`mt-6 pt-4 border-t border-[#222] flex flex-col sm:flex-row ${isRtl ? 'sm:flex-row-reverse' : ''} justify-between items-center`}>
          <p className="text-gray-500 text-xs">
            {t("footer.copyright").replace("2025", currentYear.toString())}
          </p>
          <p className="mt-2 sm:mt-0 text-gray-500 text-xs">
            {isRtl ? "صُمم بـ ❤️ لخدمة عملاء استثنائية" : "Designed with ❤️ for exceptional customer service"}
          </p>
        </div>
      </div>
    </footer>
  );
}
