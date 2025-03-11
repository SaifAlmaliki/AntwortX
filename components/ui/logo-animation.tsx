"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';

export function LogoAnimation() {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { language, direction } = useLanguage();

  // Trigger animation periodically even when not hovered
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="relative flex items-center"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
    >
      {/* Animated circle behind logo */}
      <motion.div 
        className="absolute w-10 h-10 bg-blue-500 rounded-full opacity-80"
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
            className="absolute w-2 h-2 bg-blue-300 rounded-full"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ 
              x: [0, direction === 'rtl' ? -15 : 15, direction === 'rtl' ? -20 : 20], 
              y: [0, -15, -10], 
              opacity: [0, 1, 0] 
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ 
              x: [0, direction === 'rtl' ? 15 : -15, direction === 'rtl' ? 20 : -20], 
              y: [0, -10, -15], 
              opacity: [0, 1, 0] 
            }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
          />
          <motion.div 
            className="absolute w-1.5 h-1.5 bg-blue-200 rounded-full"
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
        className={`relative z-10 text-white font-bold text-xl flex items-center ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}
      >
        <span className={direction === 'rtl' ? 'mr-2' : 'ml-2'}>
          Intelligent
        </span>
        <motion.span 
          className="text-blue-400"
          animate={{ 
            color: isHovered || isAnimating 
              ? ['#60a5fa', '#3b82f6', '#60a5fa'] 
              : '#60a5fa',
          }}
          transition={{ 
            duration: 1.5,
            ease: "easeInOut"
          }}
        >
          Proxy
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
