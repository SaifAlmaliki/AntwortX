"use client";

import { useState, useEffect, useId } from "react";
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
  const mobileNavMenuId = useId();
  const { t, direction } = useLanguage();
  const reduceMotion = useReducedMotion();

  const navigation: NavigationItem[] = [
    {
      name: t("nav.home"),
      href: "/",
      icon: <Home className="h-4 w-4 shrink-0" aria-hidden />,
      translationKey: "nav.home",
    },
    {
      name: t("nav.about"),
      href: "/about",
      icon: <Info className="h-4 w-4 shrink-0" aria-hidden />,
      translationKey: "nav.about",
    },
    {
      name: t("nav.contact"),
      href: "/contact",
      icon: <Mail className="h-4 w-4 shrink-0" aria-hidden />,
      translationKey: "nav.contact",
    },
    {
      name: t("nav.solutions"),
      href: "/solutions",
      icon: <Zap className="h-4 w-4 shrink-0" aria-hidden />,
      translationKey: "nav.solutions",
    },
  ];

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 10);
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  const navLinkClass =
    "rounded-full px-4 text-foreground/90 transition-colors duration-200 ease-out hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <motion.div
        className={cn(
          "mx-auto max-w-7xl rounded-full border border-primary/15 bg-card/60 backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-300 ease-out",
          scrolled && "border-primary/20 bg-card/80 shadow-signal"
        )}
        initial={reduceMotion ? false : { y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={
          reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 100, damping: 20 }
        }
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
            className="flex items-center space-x-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
              aria-controls={mobileNavMenuId}
              aria-label={mobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
              className="min-h-11 min-w-11 rounded-full text-foreground/90 transition-colors duration-200 ease-out hover:bg-primary/15 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 shrink-0" aria-hidden />
              ) : (
                <Menu className="h-6 w-6 shrink-0" aria-hidden />
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id={mobileNavMenuId}
            role="region"
            aria-label={t("nav.siteMenu")}
            className="absolute left-4 right-4 top-16 overflow-hidden rounded-2xl border border-primary/20 bg-popover/95 shadow-signal-lg backdrop-blur-xl md:hidden"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={
              reduceMotion
                ? { opacity: 0, transition: { duration: 0.12 } }
                : { opacity: 0, y: -8, transition: { duration: 0.2 } }
            }
            transition={
              reduceMotion
                ? { duration: 0.12 }
                : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <nav className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.translationKey}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <motion.div
                    className={cn(
                      "flex min-h-[44px] items-center rounded-xl px-3 py-2 text-base font-medium text-foreground/90 transition-colors duration-200 ease-out hover:bg-primary/10 hover:text-foreground",
                      direction === "rtl" ? "flex-row-reverse text-right" : ""
                    )}
                    whileHover={reduceMotion ? undefined : { x: direction === "rtl" ? -4 : 4 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
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
