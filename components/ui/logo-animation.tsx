"use client";

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';

export function LogoAnimation() {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { language, direction } = useLanguage();
  const reduceMotion = useReducedMotion();

  // Trigger animation periodically even when not hovered
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
      {/* Animated circle behind logo */}
      <motion.div 
        className="absolute h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent opacity-80"
        animate={{ 
          scale: isHovered || isAnimating ? [1, 1.2, 1] : 1,
          opacity: isHovered || isAnimating ? [0.8, 0.6, 0.8] : 0.8,
        }}
        transition={{ 
          duration: 1.5,
          ease: "easeInOut"
        }}
      />
      
      {/* Animated particles */}
      {(isHovered || isAnimating) && (
        <>
          <motion.div 
            className="absolute h-2 w-2 rounded-full bg-primary/70"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ 
              x: [0, direction === 'rtl' ? -15 : 15, direction === 'rtl' ? -20 : 20], 
              y: [0, -15, -10], 
              opacity: [0, 1, 0] 
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute h-2 w-2 rounded-full bg-primary"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ 
              x: [0, direction === 'rtl' ? 15 : -15, direction === 'rtl' ? 20 : -20], 
              y: [0, -10, -15], 
              opacity: [0, 1, 0] 
            }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
          />
          <motion.div 
            className="absolute h-1.5 w-1.5 rounded-full bg-accent/80"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ 
              x: [0, direction === 'rtl' ? -10 : 10, direction === 'rtl' ? -15 : 15], 
              y: [0, 10, 15], 
              opacity: [0, 1, 0] 
            }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />
        </>
      )}
      
      {/* Logo text */}
      <motion.div 
        className={`relative z-10 flex items-center text-xl font-bold text-foreground ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}
      >
        <span className={direction === 'rtl' ? 'mr-2' : 'ml-2'}>
          Zem
        </span>
        <motion.span 
          className="text-primary"
          animate={{ 
            color: isHovered || isAnimating 
              ? ["#22d3ee", "#a78bfa", "#22d3ee"] 
              : "#22d3ee",
          }}
          transition={{ 
            duration: 1.5,
            ease: "easeInOut"
          }}
        >
          par
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
