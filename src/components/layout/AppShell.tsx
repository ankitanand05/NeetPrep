"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  LayoutDashboard,
  Search,
  Bookmark,
  User,
  ClipboardList,
  BookPlus,
  CalendarClock,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/db";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { ROLE_LABELS, type Role } from "@/constants/auth";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const STUDENT_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/exams", label: "Exams", icon: CalendarClock },
  { href: "/search", label: "Search", icon: Search },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/profile", label: "Profile", icon: User },
];

const TEACHER_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/manage/questions", label: "Manage Questions", icon: BookPlus },
  { href: "/manage/exams", label: "Manage Exams", icon: ClipboardList },
  { href: "/exams", label: "Exams", icon: CalendarClock },
  { href: "/profile", label: "Profile", icon: User },
];

const ADMIN_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/manage/questions", label: "Manage Questions", icon: BookPlus },
  { href: "/manage/exams", label: "Manage Exams", icon: ClipboardList },
  { href: "/exams", label: "Exams", icon: CalendarClock },
  { href: "/search", label: "Search", icon: Search },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/profile", label: "Profile", icon: User },
];

function getNavItems(role: Role | undefined): NavItem[] {
  if (role === "teacher") return TEACHER_ITEMS;
  if (role === "admin") return ADMIN_ITEMS;
  return STUDENT_ITEMS;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navItems = getNavItems(user?.role);

  // Load user name dynamically from Dexie DB settings
  const settings = useLiveQuery(() => db.settings.get("settings"));
  const userName = settings?.name || user?.name || "NEET Aspirant";

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground antialiased">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border/60 bg-sidebar px-4 py-6 fixed inset-y-0 z-40">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2.5 px-2 hover:opacity-90 transition-opacity">
          <div className="size-8 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-extrabold text-xs shadow-sm ring-1 ring-primary/10">
            N
          </div>
          <span className="font-bold tracking-tight text-sm text-foreground">NEETPREP</span>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href) || (item.href.startsWith("/subjects") && pathname.startsWith("/subjects"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 select-none",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarNav"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  <item.icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User profile details at the bottom of the sidebar */}
        <div className="mt-auto border-t border-border/60 pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
              {userName.slice(0, 2)}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-xs font-semibold truncate text-foreground leading-tight">{userName}</span>
              <span className="text-[10px] text-muted-foreground">
                {user ? ROLE_LABELS[user.role] : "Aspirant"}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col md:ml-60">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 glass px-4 py-3 md:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
            <div className="size-7 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-extrabold text-xs">
              N
            </div>
            <span className="font-bold text-sm tracking-tight">NEETPREP</span>
          </Link>
          <div className="hidden md:block text-xs font-medium text-muted-foreground">
            Practice smarter, build confidence, master NEET.
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="md:hidden" onClick={handleLogout} aria-label="Log out">
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>

        {/* Mobile Navigation bar */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 flex items-center justify-around border-t border-border/40 bg-background/95 backdrop-blur-md py-2 px-1 shadow-lg shadow-black/10 overflow-x-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href) || (item.href.startsWith("/subjects") && pathname.startsWith("/subjects"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex shrink-0 flex-col items-center gap-0.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-all duration-200 select-none",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMobileNav"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                  />
                )}
                <span className="relative z-10 flex flex-col items-center gap-0.5">
                  <item.icon className="size-5" />
                  <span>{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="h-16 md:hidden" />
      </div>
    </div>
  );
}
