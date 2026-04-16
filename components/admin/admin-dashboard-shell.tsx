"use client";

import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";

import { AdminSidebar } from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      if (mq.matches) setMobileOpen(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  function closeMobileNav() {
    setMobileOpen(false);
    queueMicrotask(() => menuButtonRef.current?.focus());
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 md:flex-row">
      {mobileOpen ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 cursor-pointer bg-black/60 md:hidden"
          onClick={closeMobileNav}
        />
      ) : null}

      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobileNav}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-950/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80 md:hidden">
          <Button
            ref={menuButtonRef}
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-zinc-300"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="admin-sidebar"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </Button>
          <span className="truncate text-lg font-bold text-zinc-100">
            Zempar Admin
          </span>
        </header>

        <div
          className={cn(
            "min-h-0 flex-1",
            collapsed ? "md:pl-16" : "md:pl-64"
          )}
        >
          <div className="p-4 md:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
