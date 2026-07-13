import Link from "next/link";
import { BookOpen, LayoutDashboard, Search, Bookmark, User } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subjects/physics", label: "Subjects", icon: BookOpen },
  { href: "/search", label: "Search", icon: Search },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden md:flex w-60 flex-col border-r border-border/60 bg-sidebar px-4 py-6 fixed inset-y-0">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
            N
          </div>
          <span className="font-semibold tracking-tight">NEET Practice</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col md:ml-60">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 glass px-4 py-3 md:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              N
            </div>
          </Link>
          <div className="hidden md:block text-sm text-muted-foreground">Practice smarter, not longer.</div>
          <ThemeToggle />
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>

        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 flex items-center justify-around border-t border-border/60 glass py-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1 text-[11px] text-muted-foreground hover:text-foreground"
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="h-16 md:hidden" />
      </div>
    </div>
  );
}
