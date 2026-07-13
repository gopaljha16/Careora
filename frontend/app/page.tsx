"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { GeometricLines } from "@/components/geometric-lines";
import {
  Briefcase,
  LineChart,
  Mail,
  Map,
  Plus,
  CheckCircle2,
  Star,
  ArrowRight,
  ChevronRight,
  Send,
  BookOpen,
  Flame,
  Users,
  Sparkles,
  Shield,
  TrendingUp,
  Calendar,
  Paperclip,
  Share2,
  Lightbulb,
  Check
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("kanban");
  const [learningInput, setLearningInput] = useState("Mastered Next.js App Router and dynamic route configurations!");
  const [learningStreak, setLearningStreak] = useState(12);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col font-sans overflow-x-hidden transition-colors duration-300">
      
      {/* 1. Glassmorphism Header */}
      <header className="px-6 md:px-12 h-20 flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20 text-white">
            <Logo className="h-6 w-6 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-950 to-slate-700 dark:from-white dark:to-slate-350">
            Careora
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">How It Works</a>
          <a href="#testimonials" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Testimonials</a>
          <a href="#blog" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Blog</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-semibold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400">
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-orange-600 hover:bg-orange-500 text-white font-semibold shadow-lg shadow-orange-600/10 px-5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
              Get Started
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-1 flex flex-col items-center">
        <section className="relative w-full max-w-7xl px-6 md:px-12 pt-12 pb-24 md:py-24 grid lg:grid-cols-12 gap-16 items-center">
          <GeometricLines className="text-orange-500/10 dark:text-orange-500/5" />
          
          {/* Hero Left Column */}
          <div className="lg:col-span-6 space-y-8 text-left">
            {/* Rating Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-950/40 border border-orange-100/50 dark:border-orange-900/30 px-3.5 py-1.5 rounded-full">
              <div className="flex items-center gap-0.5 text-emerald-500">
                <Star className="h-4 w-4 fill-emerald-500" />
                <Star className="h-4 w-4 fill-emerald-500" />
                <Star className="h-4 w-4 fill-emerald-500" />
                <Star className="h-4 w-4 fill-emerald-500" />
                <Star className="h-4 w-4 fill-emerald-500" />
              </div>
              <span className="text-xs font-semibold text-orange-950 dark:text-orange-200">
                Trustpilot <span className="font-bold text-slate-900 dark:text-white">4.8</span>
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                Maximize Your <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 dark:from-orange-400 dark:via-amber-400 dark:to-orange-300">
                  Job Search Success
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Conquer your applications, master interview preparation, and land your dream job with Careora's visually stunning job tracker.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 items-center">
              <Link href="/register">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-500 text-white font-semibold shadow-xl shadow-orange-600/20 px-8 py-6 text-base rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97]">
                  Start Tracking Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-8 py-6 text-base rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all">
                  Learn More
                </Button>
              </a>
            </div>

            {/* Extra micro features */}
            <div className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-200/55 dark:border-slate-800/40">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-orange-50 dark:bg-orange-950/30 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-orange-50 dark:bg-orange-950/30 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Auto-saves data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-orange-50 dark:bg-orange-950/30 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Daily digests</span>
              </div>
            </div>
          </div>

          {/* Hero Right Column (CSS Mockup matching Mutmiz layout) */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Background Blob decoration */}
            <div className="absolute -top-12 -left-12 w-72 h-72 bg-amber-300/30 dark:bg-amber-900/10 rounded-full filter blur-3xl opacity-70 pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-orange-300/20 dark:bg-orange-900/10 rounded-full filter blur-3xl opacity-70 pointer-events-none" />

            {/* Mobile App Frame */}
            <div className="relative z-10 w-[280px] h-[560px] bg-slate-900 dark:bg-slate-950 rounded-[40px] p-3 shadow-2xl border-[6px] border-slate-800 dark:border-slate-900 transition-all hover:scale-[1.01]">
              {/* Speaker Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-800 dark:bg-slate-900 rounded-full z-20" />
              
              {/* Screen Content */}
              <div className="h-full w-full bg-slate-50 dark:bg-slate-900 rounded-[30px] overflow-hidden p-4 pt-8 flex flex-col gap-4 text-left">
                {/* Header inside phone */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold">Hello, Sarah Chen 👋</p>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Dream Job Tracker</h3>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">SC</span>
                  </div>
                </div>

                {/* Dashboard Stats */}
                <div className="bg-orange-600 text-white p-3.5 rounded-2xl space-y-1 shadow-lg shadow-orange-600/20">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-orange-200">Active Applications</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xl font-extrabold">24 Applications</span>
                    <span className="text-[10px] bg-orange-500 px-2 py-0.5 rounded-full font-bold">+12%</span>
                  </div>
                </div>

                {/* Status Column preview */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interview (3)</span>
                    <Plus className="h-3 w-3 text-slate-400 cursor-pointer" />
                  </div>

                  {/* Card 1 */}
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Google</span>
                      <span className="text-[8px] bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">Referral 🤝</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Senior UX Designer</p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Stripe</span>
                      <span className="text-[8px] bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">Applied</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Frontend Engineer</p>
                  </div>
                </div>

                {/* Interactive Learning streak */}
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 p-3 rounded-2xl flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 bg-amber-500 rounded-lg flex items-center justify-center text-white">
                      <Flame className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold">Learning Streak</p>
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-400">{learningStreak} Days Active</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Desktop Mock Overlay Card 1: Project Overview (Right side) */}
            <div className="absolute right-[-40px] top-[80px] z-20 w-[240px] bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700/65 hidden md:block text-left transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/50 dark:text-orange-400 px-2 py-0.5 rounded-full">Interview Prep</span>
                <span className="text-[10px] text-slate-400 font-medium">Updated 2m ago</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Today's Study Checklist</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-350">
                  <div className="h-3.5 w-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                    <Check className="h-2 w-2" />
                  </div>
                  <span>Practice 2 Dynamic Programming questions</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-350">
                  <div className="h-3.5 w-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                    <Check className="h-2 w-2" />
                  </div>
                  <span>Revise System Design: Rate Limiter</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 line-through">
                  <div className="h-3.5 w-3.5 border border-slate-300 dark:border-slate-600 rounded-full" />
                  <span>Draft answers to behavioral questions</span>
                </div>
              </div>
            </div>

            {/* Desktop Mock Overlay Card 2: Analytics Overview (Left side) */}
            <div className="absolute left-[-50px] bottom-[100px] z-20 w-[220px] bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700/65 hidden md:block text-left transition-all hover:translate-y-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center">
                  <Send className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Referral Rate</h4>
                  <p className="text-[9px] text-slate-400">Networking Tracker</p>
                </div>
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white flex items-baseline gap-1">
                <span>38.4%</span>
                <span className="text-[9px] text-emerald-500 font-bold">▲ +4.2%</span>
              </div>
              
              {/* Mini SVG graph simulating referral conversions */}
              <div className="w-full h-8 mt-2">
                <svg viewBox="0 0 100 30" className="w-full h-full text-orange-500">
                  <path
                    d="M0,25 Q15,10 30,18 T60,5 T90,12 T100,2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0,25 Q15,10 30,18 T60,5 T90,12 T100,2 L100,30 L0,30 Z"
                    fill="url(#grad)"
                    opacity="0.15"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="currentColor" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Hero Bottom Success Stats Banner */}
        <section className="w-full max-w-7xl px-6 md:px-12 pb-24">
          <div className="bg-gradient-to-r from-orange-600/90 to-amber-700/90 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center text-center md:text-left">
              <div>
                <div className="flex justify-center md:justify-start -space-x-2.5 mb-3">
                  <div className="h-8 w-8 rounded-full border-2 border-orange-700 bg-slate-200 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="user" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-8 w-8 rounded-full border-2 border-orange-700 bg-slate-200 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="user" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-8 w-8 rounded-full border-2 border-orange-700 bg-slate-200 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="user" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-8 w-8 rounded-full border-2 border-orange-700 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                    +50k
                  </div>
                </div>
                <h4 className="text-lg font-bold">Tracked by Top Talent</h4>
                <p className="text-xs text-orange-200 mt-1">Candidates matching into Google, Stripe, Meta, and Netflix.</p>
              </div>

              <div className="border-y border-white/10 md:border-y-0 md:border-x md:px-8 py-6 md:py-0 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-200">Total Progress</span>
                <h3 className="text-3xl font-black">100K+</h3>
                <p className="text-xs text-orange-200">Job applications tracked worldwide since launch.</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-200">Preparation Rate</span>
                <h3 className="text-3xl font-black">84.2%</h3>
                <p className="text-xs text-orange-200">Of users complete daily learning journal reviews.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Interactive Features Section (Three Columns matching Mutmiz Layout) */}
        <section id="features" className="w-full bg-slate-100/50 dark:bg-slate-900/30 py-24 border-y border-slate-200/40 dark:border-slate-800/40">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center space-y-16">
            
            <div className="space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Everything You Need to <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400">
                  Land Your Next Role
                </span>
              </h2>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                No more messy spreadsheets. Track jobs in real-time, log daily learnings, and see referral trends to stand out from other candidates.
              </p>
            </div>

            {/* Tab Navigation for Interactive Previews */}
            <div className="flex justify-center gap-2 p-1.5 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl max-w-lg mx-auto shadow-sm">
              <button
                onClick={() => setActiveTab("kanban")}
                className={`flex-1 py-3 px-4 text-xs font-bold rounded-xl transition-all ${
                  activeTab === "kanban"
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/10"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Kanban Tracking
              </button>
              <button
                onClick={() => setActiveTab("journal")}
                className={`flex-1 py-3 px-4 text-xs font-bold rounded-xl transition-all ${
                  activeTab === "journal"
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/10"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Learning Journal
              </button>
              <button
                onClick={() => setActiveTab("referrals")}
                className={`flex-1 py-3 px-4 text-xs font-bold rounded-xl transition-all ${
                  activeTab === "referrals"
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/10"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Referral Analytics
              </button>
            </div>

            {/* Interactive Tab Content Display */}
            <div className="grid lg:grid-cols-12 gap-12 items-center bg-white dark:bg-slate-900/60 p-8 md:p-12 rounded-[32px] border border-slate-200/40 dark:border-slate-800/40 shadow-xl min-h-[460px]">
              
              {/* Tab Display Graphics (Left Col) */}
              <div className="lg:col-span-6 flex justify-center relative min-h-[300px] items-center">
                <AnimatePresence mode="wait">
                  {activeTab === "kanban" && (
                    <motion.div
                      key="kanban-graphics"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="w-full space-y-4"
                    >
                      {/* Fake board view */}
                      <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        {/* Column WISHLIST */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">Wishlist (1)</span>
                          <div className="bg-white dark:bg-slate-700/60 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-700 shadow-sm text-left">
                            <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200">Notion</span>
                            <p className="text-[8px] text-slate-400">Product Manager</p>
                          </div>
                        </div>

                        {/* Column APPLIED */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">Applied (2)</span>
                          <div className="bg-white dark:bg-slate-700/60 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-700 shadow-sm text-left relative overflow-hidden group">
                            <div className="absolute top-0 left-0 h-full w-1 bg-blue-500" />
                            <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200">Airbnb</span>
                            <p className="text-[8px] text-slate-400">iOS Engineer</p>
                          </div>
                          <div className="bg-white dark:bg-slate-700/60 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-700 shadow-sm text-left relative overflow-hidden">
                            <div className="absolute top-0 left-0 h-full w-1 bg-blue-500" />
                            <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200">Figma 🤝</span>
                            <p className="text-[8px] text-slate-400">Design Engineer</p>
                          </div>
                        </div>

                        {/* Column INTERVIEW */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">Interview (1)</span>
                          <div className="bg-white dark:bg-slate-700/60 p-2.5 rounded-lg border border-orange-200 dark:border-orange-900 shadow-md text-left relative overflow-hidden animate-pulse">
                            <div className="absolute top-0 left-0 h-full w-1 bg-amber-500" />
                            <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200">Netflix</span>
                            <p className="text-[8px] text-slate-400">Core Infrastructure</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 italic">Drag and drop applications between pipeline columns instantly.</p>
                    </motion.div>
                  )}

                  {activeTab === "journal" && (
                    <motion.div
                      key="journal-graphics"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="w-full max-w-sm bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 text-left space-y-4"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-700">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-orange-500" /> Today's Learning
                        </h4>
                        <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">Auto-saved</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-[9px] font-semibold text-slate-400 block mb-1">WHAT DID YOU LEARN TODAY?</label>
                          <textarea
                            className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded-lg resize-none focus:outline-none"
                            rows={2}
                            value={learningInput}
                            onChange={(e) => setLearningInput(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-semibold text-slate-400 block mb-1">YESTERDAY'S MISSED / NEED TO REVIEW</label>
                          <div className="bg-amber-50 dark:bg-amber-950/20 border-l-2 border-amber-500 p-2 rounded-r-lg">
                            <p className="text-[10px] text-amber-700 dark:text-amber-400">Revise Binary Tree DFS traversals (In-order vs Post-order)</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "referrals" && (
                    <motion.div
                      key="referrals-graphics"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="w-full max-w-sm bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 text-left space-y-4"
                    >
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5 pb-2 border-b border-slate-200/60 dark:border-slate-700">
                        <Share2 className="h-4 w-4 text-orange-500" /> Referral vs. Cold Applications
                      </h4>

                      <div className="space-y-4 pt-2">
                        {/* Bar 1 */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                            <span>Referred Applications</span>
                            <span className="text-orange-600 dark:text-orange-400">45% Callback Rate</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: "45%" }} transition={{ duration: 0.8 }} className="bg-orange-600 h-full rounded-full" />
                          </div>
                        </div>
                        
                        {/* Bar 2 */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                            <span>Cold / Direct Apply</span>
                            <span className="text-slate-500">12% Callback Rate</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: "12%" }} transition={{ duration: 0.8 }} className="bg-slate-400 h-full rounded-full" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 dark:bg-orange-950/20 p-2.5 rounded-lg border border-orange-100/50 dark:border-orange-900/30">
                        <p className="text-[10px] text-orange-700 dark:text-orange-300 font-medium">💡 Pro-Tip: Tagging job applications as referrals generates critical conversion analytics to improve your strategy.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tab Text Description (Right Col) */}
              <div className="lg:col-span-6 space-y-6 text-left">
                <AnimatePresence mode="wait">
                  {activeTab === "kanban" && (
                    <motion.div
                      key="kanban-text"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="h-10 w-10 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center">
                        <Map className="h-5 w-5" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">A Visual Pipeline for Applications</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Say goodbye to spreadsheets. Track application states across columns custom-tailored to tech and career hiring flows—from Wishlist to Phone Screen, Technical interviews, Offer, and Rejected. Drag, drop, and keep everything in complete focus.
                      </p>
                      <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-350">
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Mark applications as referral to track network influence.</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Monitor application creation times & deadlines.</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Filter by location, job type, and target salary instantly.</li>
                      </ul>
                    </motion.div>
                  )}

                  {activeTab === "journal" && (
                    <motion.div
                      key="journal-text"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="h-10 w-10 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Daily Learning & Interview Prep Journal</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Job searching is 90% preparation. Careora contains a daily learning journal directly built-in. Prompt yourself daily: What concepts did you master today? What algorithmic questions or review points do you need to look at tomorrow?
                      </p>
                      <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-350">
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Daily reminder prompt showing yesterday's missed targets.</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Keep active study streaks to build consistent prep habits.</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Auto-saves learning summaries every night.</li>
                      </ul>
                    </motion.div>
                  )}

                  {activeTab === "referrals" && (
                    <motion.div
                      key="referrals-text"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="h-10 w-10 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center">
                        <Share2 className="h-5 w-5" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Networking & Referral Conversion Rate</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Cold applying has a 2% callback rate. Referrals increase this by over 300%. Tag each job card as a referral and watch Careora automatically report your referral success rate so you know where to invest your networking efforts.
                      </p>
                      <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-350">
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Visual dashboard reporting referral vs. cold success rates.</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Track networking contacts associated with each company card.</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Make informed choices on where to look for advocates.</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="pt-4">
                  <Link href="/register">
                    <Button className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-5 rounded-xl transition-all shadow-md shadow-orange-600/10">
                      Try This Feature Now
                    </Button>
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 5. Comprehensive Feature Set Grid */}
        <section className="w-full max-w-7xl px-6 md:px-12 py-24 text-left">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Feature Description Left Col */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Comprehensive Feature Set <br />
                <span className="text-orange-600 dark:text-orange-400">of Careora App</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                We designed Careora to serve as the ultimate cockpit for your career progression. Every feature is architected to keep you organized, prepared, and ahead of the curve.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-10 w-10 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Secure Data Sync & Backup</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your applications are stored securely, synced in real-time across your devices, and backed up hourly.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Paperclip className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Resume & Document Attachments</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Link specific resumes, cover letters, and notes directly to each application card so you never get confused.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Detail Right Col: Floating layouts of components */}
            <div className="lg:col-span-7 relative flex justify-center items-center">
              
              <div className="bg-gradient-to-tr from-amber-50 to-orange-50 dark:from-slate-900/60 dark:to-slate-800/40 p-8 rounded-[36px] w-full border border-slate-200/40 dark:border-slate-800/40 flex justify-center relative min-h-[380px]">
                
                {/* Floating card 1: Create Application */}
                <div className="absolute left-6 top-6 w-[200px] bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-lg z-10 hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-5 w-5 bg-orange-500 text-white rounded-md flex items-center justify-center">
                      <Plus className="h-3 w-3" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 dark:text-white">Track New Job</span>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-4/5" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-full" />
                    <div className="h-4 bg-orange-50 dark:bg-orange-950 rounded w-1/2 mt-1.5" />
                  </div>
                </div>

                {/* Floating card 2: Project Overview (Middle/Right) */}
                <div className="absolute right-6 top-16 w-[260px] bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xl z-20 hover:scale-[1.02] transition-transform text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-700">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Senior Frontend Dev</h4>
                      <p className="text-[9px] text-orange-600 dark:text-orange-400 font-semibold">Vercel Inc.</p>
                    </div>
                    <span className="text-[8px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">Interview Scheduled</span>
                  </div>
                  <div className="space-y-3 pt-3">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Next Round:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">System Design (July 15)</span>
                    </div>
                    <div className="flex justify-between items-center bg-orange-50/50 dark:bg-orange-950/30 p-2 rounded-lg">
                      <span className="text-[9px] text-orange-900 dark:text-orange-300 font-medium">Referred by Alex Rivera</span>
                      <span className="text-[8px] text-slate-400">1d ago</span>
                    </div>
                  </div>
                </div>

                {/* Floating card 3: Working details */}
                <div className="absolute bottom-6 left-12 w-[220px] bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-lg z-30 hover:translate-y-1 transition-transform text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Velocity Track</span>
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-slate-900 dark:text-white">8 App/Week</span>
                    <span className="text-[8px] text-emerald-500 font-bold">Optimal Rate</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[85%] rounded-full" />
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* 6. CTA Banner Section (Ready? Let's Start) */}
        <section className="w-full max-w-7xl px-6 md:px-12 py-12">
          <div className="bg-gradient-to-tr from-[#1d0b04] via-[#3a1507] to-[#e65e1e] rounded-[40px] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <GeometricLines className="text-white/10" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full pointer-events-none filter blur-2xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/10 rounded-full pointer-events-none filter blur-2xl" />
            
            <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center text-left">
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                  Ready? Let's Start with Careora <br />
                  and Land Your Dream Job
                </h2>
                <p className="text-base text-orange-100 leading-relaxed max-w-lg">
                  Define your targeted applications, monitor your networking referrals, and build a consistent study schedule that guarantees visual success in your career.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <Link href="/register">
                    <Button size="lg" className="bg-white text-orange-600 hover:bg-slate-100 font-bold px-8 py-6 rounded-xl shadow-lg transition-transform hover:scale-[1.02]">
                      Get Started Now
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 font-bold px-6 py-6 rounded-xl">
                      Log in to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Tilted Graphic of phone or board */}
              <div className="lg:col-span-5 hidden lg:flex justify-center relative">
                <div className="w-[240px] h-[360px] bg-slate-900 rounded-[32px] p-2.5 shadow-2xl border-4 border-slate-800 rotate-[8deg] transition-all hover:rotate-[4deg] duration-300">
                  <div className="h-full w-full bg-slate-50 dark:bg-slate-900 rounded-[24px] overflow-hidden p-3.5 text-slate-800 dark:text-slate-200 text-[10px] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Wishlist (4)</span>
                      <Plus className="h-3 w-3" />
                    </div>
                    <div className="bg-white dark:bg-slate-805 p-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700/60 font-semibold space-y-1">
                      <p className="text-slate-900 dark:text-white">Linear Finance</p>
                      <p className="text-[8px] text-slate-400">React Architect</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700/60 font-semibold space-y-1">
                      <p className="text-slate-900 dark:text-white">Vercel</p>
                      <p className="text-[8px] text-slate-400">Developer Relations 🤝</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Social Proof & Testimonials Section */}
        <section id="testimonials" className="w-full max-w-7xl px-6 md:px-12 py-24 text-left">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 dark:text-orange-400">TESTIMONIALS</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">What Our Members Say</h2>
            </div>

            {/* Quote Block layout */}
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[32px] border border-slate-200/40 dark:border-slate-800/40 shadow-xl space-y-6 relative">
              {/* Quote icon mark */}
              <span className="absolute top-6 left-6 text-orange-600/10 text-8xl font-serif pointer-events-none select-none">“</span>
              
              <div className="flex items-center gap-1 text-amber-500 relative z-10">
                <Star className="h-4 w-4 fill-amber-500" />
                <Star className="h-4 w-4 fill-amber-500" />
                <Star className="h-4 w-4 fill-amber-500" />
                <Star className="h-4 w-4 fill-amber-500" />
                <Star className="h-4 w-4 fill-amber-500" />
              </div>

              <blockquote className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium relative z-10">
                "We had an excellent experience transitioning our entire engineering job search tracker to Careora. The combination of visual Kanban board tracking, tagging referrals 🤝, and the daily learning journal kept our bootcamp students 3x more engaged and accountable. Our conversion to interview offers exceeded all expectations."
              </blockquote>

              <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-6">
                <div>
                  <cite className="not-italic font-bold text-slate-900 dark:text-white block text-sm">Alan Walker</cite>
                  <span className="text-xs text-slate-400">Senior Director of Careers, TechAcad Bootcamps</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Verified User</span>
                  <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Blog Section */}
        <section id="blog" className="w-full bg-slate-100/50 dark:bg-slate-900/30 py-24 border-y border-slate-200/40 dark:border-slate-800/40 text-left">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
            <div className="flex justify-between items-end">
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 dark:text-orange-400">OUR BLOG</span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Things about The Job Search</h2>
              </div>
              <a href="#" className="text-xs font-bold text-orange-600 hover:text-orange-500 flex items-center gap-1 transition-colors">
                View All Articles <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Blog Card 1 */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/40 dark:border-slate-800/40 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <div className="h-48 bg-slate-100 overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80" alt="blog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute bottom-3 left-3 text-[9px] font-extrabold uppercase tracking-widest bg-orange-600 text-white px-2 py-0.5 rounded-md">PRODUCTIVITY</span>
                </div>
                <div className="p-5 space-y-3">
                  <span className="text-[10px] text-slate-400 font-semibold">July 10, 2026</span>
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors text-base line-clamp-2">Latest Released Interesting Features for tracking referrals in 2026!</h4>
                  <p className="text-xs text-slate-550 dark:text-slate-400 line-clamp-2">We added brand-new analytics that compare your cold applications against your referral success rate to land interviews.</p>
                </div>
              </div>

              {/* Blog Card 2 */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/40 dark:border-slate-800/40 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <div className="h-48 bg-slate-100 overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80" alt="blog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute bottom-3 left-3 text-[9px] font-extrabold uppercase tracking-widest bg-orange-600 text-white px-2 py-0.5 rounded-md">NETWORKING</span>
                </div>
                <div className="p-5 space-y-3">
                  <span className="text-[10px] text-slate-400 font-semibold">June 28, 2026</span>
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors text-base line-clamp-2">How to ask for a Job Referral on LinkedIn (With Templates)</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">Discover our templates and strategies to connect with advocates and get referred into top companies.</p>
                </div>
              </div>

              {/* Blog Card 3 */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/40 dark:border-slate-800/40 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <div className="h-48 bg-slate-100 overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" alt="blog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute bottom-3 left-3 text-[9px] font-extrabold uppercase tracking-widest bg-orange-600 text-white px-2 py-0.5 rounded-md">INTERVIEWS</span>
                </div>
                <div className="p-5 space-y-3">
                  <span className="text-[10px] text-slate-400 font-semibold">June 15, 2026</span>
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors text-base line-clamp-2">The Power of Keeping a Daily Technical Learning Journal</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">Why tracking what you missed is more important than tracking what you completed. Master algorithm and design prep.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* 9. Footer Section */}
      <footer className="w-full border-t border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid md:grid-cols-12 gap-12 text-left">
          
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                <Logo className="h-5 w-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-950 to-slate-700 dark:from-white dark:to-slate-350">
                Careora
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              We build tools to empower candidates, developers, and career changers to track, prepare, and succeed in the modern tech hiring landscape.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" className="hover:text-orange-600 transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
              </a>
              <a href="#" className="hover:text-orange-600 transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.31 2c-5.52 0-10 4.48-10 10 0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
              </a>
              <a href="#" className="hover:text-orange-600 transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200">Company</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-orange-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">Press Kit</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">Trust & Safety</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200">Get Notified & Updates</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Subscribe to our monthly newsletter to receive interview templates and productivity features.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-xs rounded-xl focus:outline-none w-full shadow-inner"
              />
              <Button className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl px-4 py-2">
                Join Now
              </Button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 border-t border-slate-200/40 dark:border-slate-800/40 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
          <span>&copy; {isClient ? new Date().getFullYear() : "2026"} Careora. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-orange-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Cookie settings</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
