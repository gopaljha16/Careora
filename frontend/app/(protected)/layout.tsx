"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/jobs", label: "Job Pipeline", icon: Briefcase },
  { href: "/learn", label: "Learning Journal", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card text-card-foreground border-r border-border transition-all duration-300 flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">Careora</span>
          </Link>
        </div>

        <div className="p-4 mb-4 border-b border-border bg-muted/30">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Signed in as</p>
          <p className="text-sm font-medium text-foreground truncate">{session?.user?.name || session?.user?.email}</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border flex items-center justify-between gap-2">
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary">
          <Briefcase className="h-6 w-6" />
          <span className="font-bold text-xl tracking-tight text-foreground">Careora</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-card z-40 p-4 border-b border-border overflow-y-auto">
          <div className="p-4 mb-4 bg-muted rounded-lg">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Signed in as</p>
            <p className="text-sm font-medium text-foreground truncate">{session?.user?.name || session?.user?.email}</p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground font-medium" 
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-16 md:pt-0 overflow-y-auto bg-background">
        <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
