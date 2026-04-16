"use client";

import { usePathname } from "next/navigation";

import { FloatingHeader } from "@/components/ui/floating-header";
import { cn } from "@/lib/utils";

/**
 * Marketing header and main top padding apply only outside `/admin`.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute ? <FloatingHeader /> : null}
      <main
        id="main-content"
        className={cn(!isAdminRoute && "pt-20")}
        tabIndex={-1}
      >
        {children}
      </main>
    </>
  );
}
