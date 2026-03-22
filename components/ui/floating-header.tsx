"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, Info, Mail, Home, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoAnimation } from "@/components/ui/logo-animation";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

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
  const reduceMotion = useReducedMotion();

  const navigation: NavigationItem[] = [
    { name: t("nav.home"), href: "/", icon: <Home className="h-4 w-4" />, translationKey: "nav.home" },
    { name: t("nav.about"), href: "/about", icon: <Info className="h-4 w-4" />, translationKey: "nav.about" },
    { name: t("nav.contact"), href: "/contact", icon: <Mail className="h-4 w-4" />, translationKey: "nav.contact" },
    { name: "Solutions", href: "/solutions", icon: <Zap className="h-4 w-4" />, translationKey: "nav.solutions" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass =
    "text-slate-200 hover:text-white hover:bg-cyan-500/10 rounded-full px-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060606]";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <motion.div
        className={cn(
          "mx-auto max-w-7xl rounded-full border backdrop-blur-xl transition-all duration-300",
          scrolled
            ? "border-cyan-500/20 bg-[rgba(8,12,18,0.72)] shadow-[0_0_40px_-12px_rgba(34,211,238,0.2)]"
            : "border-cyan-500/15 bg-[rgba(10,14,22,0.55)]"
        )}
        initial={reduceMotion ? false : { y: -100, opacity: 0 }}
        animate={reduceMotion ? undefined : { y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        whileHover={
          reduceMotion
            ? undefined
            : {
                boxShadow: "0 12px 40px -8px rgba(34, 211, 238, 0.18)",
                borderColor: "rgba(34, 211, 238, 0.35)",
              }
        }
      >
        <div
          className={cn(
            "flex items-center justify-between px-4 py-2",
            direction === "rtl" ? "flex-row-reverse" : ""
          )}
        >
          <Link
            href="/"
            className="flex items-center space-x-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060606]"
          >
            <LogoAnimation />
          </Link>

          <nav
            className={cn(
              "hidden md:flex items-center space-x-1",
              direction === "rtl" ? "flex-row-reverse space-x-reverse" : ""
            )}
          >
            {navigation.map((item) => (
              <Link key={item.translationKey} href={item.href}>
                <motion.div whileHover={reduceMotion ? undefined : { scale: 1.03 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
                  <Button variant="ghost" size="sm" className={navLinkClass}>
                    <span
                      className={cn(
                        "flex items-center gap-2",
                        direction === "rtl" ? "flex-row-reverse" : ""
                      )}
                    >
                      {item.icon}
                      {t(item.translationKey)}
                    </span>
                  </Button>
                </motion.div>
              </Link>
            ))}

            <LanguageSelector />
          </nav>

          <div
            className={cn(
              "flex md:hidden items-center gap-2",
              direction === "rtl" ? "flex-row-reverse" : ""
            )}
          >
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="text-slate-200 hover:text-white hover:bg-cyan-500/15 rounded-full focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060606]"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-16 left-4 right-4 rounded-2xl border border-cyan-500/20 bg-[rgba(8,12,18,0.92)] backdrop-blur-xl shadow-[0_0_48px_-12px_rgba(34,211,238,0.25)] overflow-hidden"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1, height: "auto" }}
            exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.translationKey}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-inset"
                >
                  <motion.div
                    className={cn(
                      "flex items-center px-3 py-2 text-base font-medium rounded-xl text-slate-200 hover:bg-cyan-500/10 hover:text-white",
                      direction === "rtl" ? "flex-row-reverse text-right" : ""
                    )}
                    whileHover={reduceMotion ? undefined : { x: direction === "rtl" ? -4 : 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className={direction === "rtl" ? "ml-3" : "mr-3"}>{item.icon}</span>
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
