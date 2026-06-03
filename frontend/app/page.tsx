import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, LineChart, Mail, Map } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="px-6 h-16 flex items-center justify-between border-b bg-white">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">Careora</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Take control of your job search journey.
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Careora helps you track applications, prepare for interviews, and land your dream job with a beautiful Kanban board and daily email digests.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-lg font-medium">Start Tracking Now</Button>
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mt-24">
          <div className="bg-white p-6 rounded-2xl shadow-sm border text-left">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Map className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Visual Kanban Board</h3>
            <p className="text-slate-600">Drag and drop your applications through different stages. Keep your pipeline organized and clear.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border text-left">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <LineChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Insightful Analytics</h3>
            <p className="text-slate-600">Understand your application velocity and conversion rates with simple, powerful charts.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border text-left">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Daily Digest Emails</h3>
            <p className="text-slate-600">Get a friendly nudge every evening with your daily progress to keep your momentum going.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
