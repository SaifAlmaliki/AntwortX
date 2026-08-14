"use client";

import Link from "next/link";

import { useLanguage } from "@/contexts/language-context";
import { BRAND_NAME_AR, BRAND_NAME_EN } from "@/lib/brand";
import { cn } from "@/lib/utils";

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
  size,
}: BrandNameProps) {
  const { language } = useLanguage();
  const name = language === "ar" ? BRAND_NAME_AR : BRAND_NAME_EN;

  const sizeClass = size
    ? {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      }[size]
    : "";

  const brandNameContent = (
    <span className={cn("font-bold tracking-tight", sizeClass, className)}>
      {name}
    </span>
  );

  if (showLink) {
    return (
      <Link href="/" className={cn("text-2xl", linkClassName)}>
        {brandNameContent}
      </Link>
    );
  }

  return brandNameContent;
}
