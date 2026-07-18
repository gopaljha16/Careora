"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart2,
  BookOpen
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/jobs", label: "Job Pipeline", icon: Briefcase },
  { href: "/learn", label: "Life Journal", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      // Check for command/ctrl key
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            router.push('/dashboard');
            break;
          case 'j':
            e.preventDefault();
            router.push('/jobs');
            break;
          case 'l':
            e.preventDefault();
            router.push('/learn');
            break;
        }
      } else {
        // Quick add shortcut (without modifier, just 'n' if not typing)
        if (e.key.toLowerCase() === 'n') {
          e.preventDefault();
          router.push('/jobs/new');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : (session?.user?.email?.[0] ?? "?").toUpperCase();

  return (
    <div className="h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white flex overflow-hidden transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-r border-slate-200/60 dark:border-slate-800/60 flex-shrink-0 shadow-sm">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-slate-200/60 dark:border-slate-800/60">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/25 transition-transform group-hover:scale-105">
              <Logo className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
              Careora
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div className="mx-3 mt-3 mb-2 p-3 rounded-xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-100/60 dark:border-orange-900/30">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-orange-500 uppercase tracking-wider">Signed in as</p>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {session?.user?.name || session?.user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-orange-500 transition-colors"}`} />
                  {item.label}
                </div>
                {!isActive && item.label === "Dashboard" && <span className="hidden group-hover:block text-[10px] text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono border border-slate-300 dark:border-slate-700">⌘D</span>}
                {!isActive && item.label === "Job Pipeline" && <span className="hidden group-hover:block text-[10px] text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono border border-slate-300 dark:border-slate-700">⌘J</span>}
                {!isActive && item.label === "Learning Journal" && <span className="hidden group-hover:block text-[10px] text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono border border-slate-300 dark:border-slate-700">⌘L</span>}
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 transition-all duration-200 text-sm font-medium cursor-pointer group flex-1"
          >
            <LogOut className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
            Sign out
          </button>
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 z-50 flex items-center justify-between px-4 shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20">
            <Logo className="h-4 w-4 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
            Careora
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-xl">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-40 p-4 overflow-y-auto">
          <div className="mb-4 p-3 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <div>
                <p className="text-[10px] font-semibold text-orange-500 uppercase tracking-wider">Signed in as</p>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {session?.user?.name || session?.user?.email}
                </p>
              </div>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer text-sm font-medium"
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-16 md:pt-0 overflow-y-auto bg-slate-50/50 dark:bg-slate-950">
        <div className="flex-1 p-5 lg:p-7 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
