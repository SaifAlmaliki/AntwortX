"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { BrandName } from "@/components/ui/BrandName";
import { useLanguage } from "@/contexts/language-context";

export function Header() {
  const { direction } = useLanguage();
  const isRtl = direction === 'rtl';
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-6">
      <motion.div 
        className="mx-auto max-w-5xl bg-[#0a0a0a]/70 backdrop-blur-md border border-[#333] rounded-full px-6 py-3 shadow-lg"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <div className={`flex justify-center items-center ${isRtl ? 'flex-row-reverse' : ''}`}>
          <BrandName className="text-2xl" />
        </div>
      </motion.div>
    </header>
  );
}
