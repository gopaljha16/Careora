"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Briefcase, 
  User, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Star, 
  Sparkles, 
  LayoutDashboard, 
  LineChart, 
  BookOpen, 
  Flame,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { GeometricLines } from "@/components/geometric-lines";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import axios from "axios";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setError(null);
    try {
      // Create user via API
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/register`,
        {
          name: values.name,
          email: values.email,
          password: values.password,
        },
      );

      // Login immediately
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          "Account created, but automatic login failed. Please log in manually.",
        );
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (e: any) {
      if (e.response?.data?.error) {
        setError(e.response.data.error);
      } else {
        setError("Failed to create account. Please try again.");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr from-slate-50 via-orange-50/20 to-amber-50/30 dark:from-slate-950 dark:via-orange-950/15 dark:to-amber-950/20 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300 relative overflow-hidden">
      <GeometricLines className="text-orange-500/10 dark:text-orange-500/5" />
      
      {/* Background ambient blurs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-300/20 dark:bg-amber-900/10 rounded-full filter blur-3xl opacity-75 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-300/20 dark:bg-orange-900/10 rounded-full filter blur-3xl opacity-75 pointer-events-none" />

      {/* Back to Home Button (Top Left) */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-50 flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-orange-655 dark:text-slate-400 dark:hover:text-orange-400 transition-colors bg-white/80 dark:bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-200/50 dark:border-slate-800/40 backdrop-blur-sm shadow-sm"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
      </Link>

      {/* Wide Glassmorphism Auth Card */}
      <div className="w-full max-w-5xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-2xl overflow-hidden min-h-[600px] grid lg:grid-cols-12 relative z-10 transition-colors duration-300">
        
        {/* Left Column: Proper UI Product Mockup */}
        <div className="lg:col-span-6 bg-slate-50/50 dark:bg-slate-950/30 p-12 flex flex-col justify-between border-r border-slate-200/40 dark:border-slate-800/40 hidden lg:flex text-left">
          
          {/* Header section of UI Mock */}
          <div className="flex justify-between items-center pb-6 border-b border-slate-200/40 dark:border-slate-800/40">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-orange-600/15">
                <Logo className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-350">
                Careora
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
              <Star className="h-3.5 w-3.5 fill-amber-500" />
              <span>4.8 Trustpilot</span>
            </div>
          </div>

          {/* Actual UI Mockup Area */}
          <div className="my-auto space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 bg-orange-50 dark:bg-orange-950/40 border border-orange-100/50 dark:border-orange-900/30 px-3 py-1 rounded-full text-[10px] font-bold text-orange-600 dark:text-orange-400">
                <Sparkles className="h-3 w-3" /> Core Application Mockup
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Track applications in one dashboard</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                A clean layout constructed to visualize your pipeline columns, track networking referrals, and log study guides.
              </p>
            </div>

            {/* Inner Dashboard UI Frame Mockup */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg overflow-hidden grid grid-cols-12 min-h-[260px] text-[10px] text-slate-800 dark:text-slate-200">
              
              {/* Sidebar Mock */}
              <div className="col-span-3 bg-slate-50 dark:bg-slate-950 p-2 border-r border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded mb-1" />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 p-1 rounded font-bold">
                    <LayoutDashboard className="h-3 w-3" /> Dashboard
                  </div>
                  <div className="flex items-center gap-1.5 p-1 text-slate-400 dark:text-slate-500">
                    <Briefcase className="h-3 w-3" /> Jobs
                  </div>
                  <div className="flex items-center gap-1.5 p-1 text-slate-400 dark:text-slate-500">
                    <LineChart className="h-3 w-3" /> Analytics
                  </div>
                  <div className="flex items-center gap-1.5 p-1 text-slate-400 dark:text-slate-500">
                    <BookOpen className="h-3 w-3" /> Prep Journal
                  </div>
                </div>
              </div>

              {/* Main Panel Mock */}
              <div className="col-span-9 p-3 flex flex-col gap-3">
                {/* Metric banner */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p className="text-[8px] text-slate-400">Total applications</p>
                    <p className="font-extrabold text-sm text-orange-600 dark:text-orange-400">24</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p className="text-[8px] text-slate-400">Referral Rate</p>
                    <p className="font-extrabold text-sm text-amber-600 dark:text-amber-400">38% 🤝</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[8px] text-slate-400">Daily Prep</p>
                      <p className="font-extrabold text-[10px] text-amber-600 dark:text-amber-400">12 Days</p>
                    </div>
                    <Flame className="h-3 w-3 text-amber-500 fill-amber-500" />
                  </div>
                </div>

                {/* Simulated Kanban Columns */}
                <div className="grid grid-cols-3 gap-2 flex-1">
                  <div className="bg-slate-50/50 dark:bg-slate-950/20 p-2 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-[8px] text-slate-400 uppercase">Wishlist (1)</span>
                    <div className="bg-white dark:bg-slate-800 p-1.5 rounded border border-slate-200/50 dark:border-slate-700/50 shadow-sm text-left">
                      <p className="font-bold text-[9px] line-clamp-1">Notion</p>
                      <p className="text-[7px] text-slate-400">PM</p>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 dark:bg-slate-950/20 p-2 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-[8px] text-slate-400 uppercase">Applied (1)</span>
                    <div className="bg-white dark:bg-slate-800 p-1.5 rounded border border-slate-200/50 dark:border-slate-700/50 shadow-sm text-left relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-[2px] bg-blue-500" />
                      <p className="font-bold text-[9px] line-clamp-1">Stripe 🤝</p>
                      <p className="text-[7px] text-slate-400">Software Eng</p>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 dark:bg-slate-950/20 p-2 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-[8px] text-slate-400 uppercase">Interview (1)</span>
                    <div className="bg-white dark:bg-slate-800 p-1.5 rounded border border-orange-200 dark:border-orange-900 shadow-sm text-left relative overflow-hidden animate-pulse">
                      <div className="absolute top-0 left-0 h-full w-[2px] bg-amber-500" />
                      <p className="font-bold text-[9px] line-clamp-1">Airbnb</p>
                      <p className="text-[7px] text-slate-400">iOS Dev</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Bottom text */}
          <div className="text-[10px] text-slate-400 border-t border-slate-200/40 dark:border-slate-800/40 pt-4 flex justify-between items-center">
            <span>&copy; {new Date().getFullYear()} Careora Inc. All rights reserved.</span>
            <div className="flex gap-3">
              <a href="#" className="hover:text-orange-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-orange-600 transition-colors">Terms</a>
            </div>
          </div>

        </div>

        {/* Right Column: Form Container */}
        <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-slate-900 relative">
          <div className="w-full max-w-sm mx-auto space-y-6">
            
            <div className="text-center lg:text-left space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Sign up
              </h1>
              <p className="text-xs text-slate-505 dark:text-slate-400 leading-relaxed">
                Start tracking for free. Create your job hunt account in seconds.
              </p>
            </div>

            <div className="space-y-5 pt-2">
              <Form form={form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="text-left space-y-1.5">
                        <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-350">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                              placeholder="John Doe" 
                              className="pl-10 h-11 border-slate-200 dark:border-slate-800 focus-visible:ring-orange-505/50 focus-visible:border-orange-500 rounded-xl bg-slate-50/30 dark:bg-slate-950/20"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="text-left space-y-1.5">
                        <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-350">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                              placeholder="name@example.com" 
                              className="pl-10 h-11 border-slate-200 dark:border-slate-805 focus-visible:ring-orange-505/50 focus-visible:border-orange-500 rounded-xl bg-slate-50/30 dark:bg-slate-950/20"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="text-left space-y-1.5">
                        <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="pl-10 h-11 border-slate-200 dark:border-slate-800 focus-visible:ring-orange-505/50 focus-visible:border-orange-500 rounded-xl bg-slate-50/30 dark:bg-slate-950/20"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <div className="text-xs font-bold text-destructive text-left bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-100 dark:border-red-950/50">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-orange-600 hover:text-orange-555 dark:text-orange-400"
                >
                  Sign in
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
