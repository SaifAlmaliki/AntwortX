"use client";

import { useState, useEffect, useId, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleLanguageChange = (langCode: 'en' | 'ar') => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="sm"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-label={t("common.chooseLanguage")}
        className="rounded-full px-3 text-muted-foreground transition-colors duration-200 ease-out hover:bg-primary/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Globe className="h-4 w-4 mr-2 shrink-0" aria-hidden />
        <span className="mr-1" aria-hidden>
          {currentLanguage.flag}
        </span>
        <span className="mx-1 hidden sm:inline">{currentLanguage.name}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={listId}
            role="listbox"
            aria-label={t("common.languageMenuLabel")}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full z-50 mt-2 min-w-[150px] overflow-hidden rounded-xl border border-primary/20 bg-popover/95 shadow-signal-menu backdrop-blur-xl"
          >
            <div className="py-1" role="presentation">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={language === lang.code}
                  onClick={() => handleLanguageChange(lang.code as "en" | "ar")}
                  className={`mx-1 flex min-h-[44px] w-full items-center justify-start rounded-lg px-4 py-2 text-sm transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    language === lang.code
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                  } text-start`}
                >
                  <span className="mr-2" aria-hidden>
                    {lang.flag}
                  </span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
