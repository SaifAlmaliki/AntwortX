"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { useLanguage } from "@/contexts/language-context";
import { BRAND_NAME_AR, BRAND_NAME_EN } from "@/lib/brand";

export function LogoAnimation() {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const name = language === "ar" ? BRAND_NAME_AR : BRAND_NAME_EN;

  useEffect(() => {
    if (reduceMotion) return;
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }, 8000);

    return () => clearInterval(interval);
  }, [reduceMotion]);

  return (
    <motion.div
      className="relative flex items-center"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={reduceMotion ? undefined : { scale: 1.05 }}
    >
      <motion.div
        className="absolute size-10 rounded-full bg-gradient-to-br from-primary to-accent opacity-80"
        animate={{
          scale: isHovered || isAnimating ? [1, 1.2, 1] : 1,
          opacity: isHovered || isAnimating ? [0.8, 0.6, 0.8] : 0.8,
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
        }}
      />

      <motion.div className="relative z-10 ms-2 text-xl font-bold tracking-tight text-foreground">
        {name}
      </motion.div>
    </motion.div>
  );
}
