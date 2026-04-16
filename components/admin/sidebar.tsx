"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { logoutAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Audit Leads", icon: Users },
];

export interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      id="admin-sidebar"
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-zinc-800 bg-zinc-950 transition-[transform,width] duration-200 ease-out",
        "w-64 max-w-[min(100vw-3rem,20rem)]",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0",
        collapsed ? "md:w-16 md:max-w-none" : "md:w-64 md:max-w-none"
      )}
    >
      <div className="flex h-14 shrink-0 items-center border-b border-zinc-800 px-3 md:px-4">
        {collapsed ? (
          <div className="flex w-full items-center justify-end md:justify-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden text-zinc-400 hover:text-zinc-100 md:inline-flex"
              onClick={onToggleCollapsed}
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-zinc-100 md:hidden"
              onClick={onMobileClose}
              aria-label="Close navigation menu"
            >
              <X className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        ) : (
          <>
            <Link
              href="/admin"
              className="min-w-0 flex-1 truncate text-lg font-bold text-zinc-100"
              onClick={onMobileClose}
            >
              Zempar Admin
            </Link>
            <div className="ml-auto flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hidden text-zinc-400 hover:text-zinc-100 md:inline-flex"
                onClick={onToggleCollapsed}
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-zinc-100 md:hidden"
                onClick={onMobileClose}
                aria-label="Close navigation menu"
              >
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2" aria-label="Admin">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100",
                collapsed && "md:justify-center md:px-2"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className={cn(collapsed && "md:sr-only")}>{item.label}</span>
            </Link>
          );
        })}

        <div className="mt-2 border-t border-zinc-800/80 pt-2">
          <Link
            href="/"
            onClick={onMobileClose}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-100",
              collapsed && "md:justify-center md:px-2"
            )}
          >
            <Home className="h-4 w-4 shrink-0" aria-hidden />
            <span className={cn(collapsed && "md:sr-only")}>Back to website</span>
          </Link>
        </div>
      </nav>

      <div className="border-t border-zinc-800 p-2">
        <form action={logoutAction}>
          <button
            type="submit"
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-100",
              collapsed && "md:justify-center md:px-2"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden />
            <span className={cn(collapsed && "md:sr-only")}>Sign out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
