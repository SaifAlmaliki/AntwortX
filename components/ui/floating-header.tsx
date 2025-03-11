"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Info, Mail, Home, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoAnimation } from '@/components/ui/logo-animation';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useLanguage } from '@/contexts/language-context';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  translationKey: string;
}

export function FloatingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, direction } = useLanguage();

  const navigation: NavigationItem[] = [
    { name: t('nav.home'), href: '/', icon: <Home className="h-4 w-4" />, translationKey: 'nav.home' },
    { name: t('nav.about'), href: '/about', icon: <Info className="h-4 w-4" />, translationKey: 'nav.about' },
    { name: t('nav.contact'), href: '/contact', icon: <Mail className="h-4 w-4" />, translationKey: 'nav.contact' },
    { name: 'Solutions', href: '/solutions', icon: <Zap className="h-4 w-4" />, translationKey: 'nav.solutions' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <motion.div 
        className={`mx-auto max-w-7xl rounded-full backdrop-blur-lg transition-all duration-300 ${
          scrolled 
            ? 'bg-gradient-to-r from-[#0a1a2e]/80 to-[#0d2a4a]/80 border-[#1e3a5a]/50' 
            : 'bg-gradient-to-r from-[#0a1a2e] to-[#0d2a4a] border border-[#1e3a5a]'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        whileHover={{ 
          boxShadow: "0 8px 32px rgba(0, 112, 243, 0.2)",
          borderColor: "rgba(59, 130, 246, 0.5)"
        }}
      >
        <div className={`flex items-center justify-between px-4 py-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <LogoAnimation />
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center space-x-1 ${direction === 'rtl' ? 'flex-row-reverse space-x-reverse' : ''}`}>
            {navigation.map((item) => (
              <Link key={item.translationKey} href={item.href}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-200 hover:text-white hover:bg-[#1e3a5a]/80 rounded-full px-4 transition-all duration-200"
                  >
                    <span className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      {item.icon}
                      {t(item.translationKey)}
                    </span>
                  </Button>
                </motion.div>
              </Link>
            ))}
            
            {/* Language Selector */}
            <LanguageSelector />
          </nav>

          {/* Mobile menu button and language selector */}
          <div className={`flex md:hidden items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <LanguageSelector />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-200 hover:text-white hover:bg-[#1e3a5a]/80 rounded-full transition-all duration-200"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden absolute top-16 left-4 right-4 rounded-xl bg-gradient-to-r from-[#0a1a2e]/95 to-[#0d2a4a]/95 backdrop-blur-lg border border-[#1e3a5a]/50 shadow-lg overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link 
                  key={item.translationKey} 
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <motion.div 
                    className={`flex items-center px-3 py-2 text-base font-medium rounded-lg text-gray-200 hover:bg-[#1e3a5a]/80 hover:text-white ${
                      direction === 'rtl' ? 'flex-row-reverse text-right' : ''
                    }`}
                    whileHover={{ x: direction === 'rtl' ? -5 : 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className={direction === 'rtl' ? 'ml-3' : 'mr-3'}>{item.icon}</span>
                    {t(item.translationKey)}
                  </motion.div>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
