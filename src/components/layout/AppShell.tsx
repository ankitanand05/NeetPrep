"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Search, Bookmark, User } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/db";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subjects/physics", label: "Subjects", icon: BookOpen },
  { href: "/search", label: "Search", icon: Search },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Load user name dynamically from Dexie DB settings
  const settings = useLiveQuery(() => db.settings.get("settings"));
  const userName = settings?.name || "NEET Aspirant";

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground antialiased">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border/60 bg-sidebar px-4 py-6 fixed inset-y-0 z-40">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-sm">
            N
          </div>
          <span className="font-semibold tracking-tight text-sm">NEET Practice</span>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href) || (item.href.startsWith("/subjects") && pathname.startsWith("/subjects"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent/15 text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile details at the bottom of the sidebar */}
        <div className="mt-auto border-t border-border/60 pt-4 flex items-center gap-3 px-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
            {userName.slice(0, 2)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold truncate text-foreground leading-tight">{userName}</span>
            <span className="text-[10px] text-muted-foreground">Aspirant</span>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col md:ml-60">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 glass px-4 py-3 md:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              N
            </div>
            <span className="font-bold text-sm">NEET Practice</span>
          </Link>
          <div className="hidden md:block text-xs font-medium text-muted-foreground">
            Practice smarter, build confidence, master NEET.
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>

        {/* Mobile Navigation bar */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 flex items-center justify-around border-t border-border/40 bg-background/95 backdrop-blur-md py-2 px-1 shadow-lg shadow-black/10">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href) || (item.href.startsWith("/subjects") && pathname.startsWith("/subjects"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[10px] font-semibold transition-all",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="size-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="h-16 md:hidden" />
      </div>
    </div>
  );
}


