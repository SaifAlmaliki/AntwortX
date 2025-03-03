"use client";

import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";

interface BrandNameProps {
  className?: string;
  linkClassName?: string;
  showLink?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function BrandName({ 
  className = "", 
  linkClassName = "", 
  showLink = true,
  size
}: BrandNameProps) {
  const { } = useLanguage();
  
  // Determine size class based on size prop
  const sizeClass = size ? {
    "sm": "text-sm",
    "md": "text-base",
    "lg": "text-lg",
    "xl": "text-xl"
  }[size] : "";
  
  // The brand name component with styling
  const brandNameContent = (
    <span className={`font-bold ${sizeClass} ${className}`}>
      {/* Use same "AntwortX" brand name for both languages */}
      <span className="text-white">antwort</span>
      <span className="text-blue-500">X</span>
    </span>
  );

  // Return with or without link wrapper based on prop
  if (showLink) {
    return (
      <Link href="/" className={`text-2xl ${linkClassName}`}>
        {brandNameContent}
      </Link>
    );
  }
  
  return brandNameContent;
}
