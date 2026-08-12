"use client";

import { useMemo } from "react";

import { useLanguage } from "@/contexts/language-context";
import { getCinematicContent } from "@/lib/cinematic-content";
import type arLocale from "@/locales/ar.json";

export function useCinematicContent() {
  const { locale } = useLanguage();
  return useMemo(
    () => getCinematicContent(locale.cinematic as (typeof arLocale)["cinematic"]),
    [locale]
  );
}
