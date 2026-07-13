import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, LineChart, Mail, Map } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="px-6 h-16 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">Careora</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
          <ThemeToggle />
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl space-y-8 py-12">
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
            Take control of your job search journey.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Careora helps you track applications, prepare for interviews, and land your dream job with a beautiful Kanban board and daily email digests.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-lg font-medium">Start Tracking Now</Button>
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mt-16 mb-12">
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border text-left hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Map className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-2 text-foreground">Visual Kanban Board</h3>
            <p className="text-muted-foreground">Drag and drop your applications through different stages. Keep your pipeline organized and clear.</p>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border text-left hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <LineChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-2 text-foreground">Insightful Analytics</h3>
            <p className="text-muted-foreground">Understand your application velocity and conversion rates with simple, powerful charts.</p>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border text-left hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-2 text-foreground">Daily Digest Emails</h3>
            <p className="text-muted-foreground">Get a friendly nudge every evening with your daily progress to keep your momentum going.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
