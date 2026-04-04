"use client";

import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

export function SkipToMain() {
  const { t, direction } = useLanguage();
  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:rounded-lg focus:px-4 focus:py-3 focus:font-semibold",
        "focus:bg-cyan-400 focus:text-[#060606] focus:shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-[#060606]",
        direction === "rtl" ? "focus:right-4 focus:top-4" : "focus:left-4 focus:top-4"
      )}
    >
      {t("common.skipToMain")}
    </a>
  );
}
