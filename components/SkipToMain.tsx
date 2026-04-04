"use client";

import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

export function SkipToMain() {
  const { t, direction } = useLanguage();
  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only transition-shadow duration-200 ease-out focus:not-sr-only focus:fixed focus:z-[100] focus:rounded-lg focus:px-4 focus:py-3 focus:font-semibold",
        "focus:bg-primary focus:text-primary-foreground focus:shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
        direction === "rtl" ? "focus:right-4 focus:top-4" : "focus:left-4 focus:top-4"
      )}
    >
      {t("common.skipToMain")}
    </a>
  );
}
