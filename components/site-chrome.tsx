"use client";

import { usePathname } from "next/navigation";

import { FloatingHeader } from "@/components/ui/floating-header";
import { cn } from "@/lib/utils";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCinematicHome = pathname === "/";

  return (
    <>
      {!isCinematicHome ? <FloatingHeader /> : null}
      <main
        id="main-content"
        className={cn(!isCinematicHome && "pt-20")}
        tabIndex={-1}
      >
        {children}
      </main>
    </>
  );
}
