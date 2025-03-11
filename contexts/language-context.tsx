"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Import locale files
import enLocale from '@/locales/en.json';
import arLocale from '@/locales/ar.json';

// Use a more flexible type definition that doesn't rely on exact structure matching
type LocaleData = Record<string, any>;

type Language = 'en' | 'ar';

interface LanguageContextType {
  locale: LocaleData;
  language: Language;
  direction: 'ltr' | 'rtl';
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const defaultContext: LanguageContextType = {
  locale: enLocale,
  language: 'en',
  direction: 'ltr',
  setLanguage: () => {},
  t: () => '',
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [locale, setLocale] = useState<LocaleData>(enLocale);
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    // Check if there's a saved language preference in localStorage
    const savedLanguage = localStorage.getItem('intelligentproxy-language') as Language | null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Update locale and direction when language changes
    if (language === 'ar') {
      // Use type assertion to avoid TypeScript errors
      setLocale(arLocale as LocaleData);
      setDirection('rtl');
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      setLocale(enLocale as LocaleData);
      setDirection('ltr');
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }

    // Save language preference to localStorage
    localStorage.setItem('intelligentproxy-language', language);
  }, [language]);

  // Function to set language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Translation function that handles nested keys like "nav.home"
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = locale;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ locale, language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
