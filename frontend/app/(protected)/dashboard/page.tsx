"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Clock, FileCheck, Target,
  Send, Flame, TrendingUp, CheckCircle2, ArrowRight
} from "lucide-react";
import axios from "axios";
import { Heatmap } from "@/components/ui/heatmap";
import { LearningEditor } from "@/components/ui/learning-editor";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; color: string }> = {
  applied:   { label: "Applied",   color: "#f97316" },
  interview: { label: "Interview", color: "#3b82f6" },
  offer:     { label: "Offer",     color: "#22c55e" },
  rejected:  { label: "Rejected",  color: "#94a3b8" },
  ghosted:   { label: "Ghosted",   color: "#64748b" },
  saved:     { label: "Saved",     color: "#fbbf24" },
  withdrawn: { label: "Withdrawn", color: "#e2e8f0" },
};

function statusCfg(s: string) {
  return STATUS_CFG[s?.toLowerCase()] ?? { label: s, color: "#f97316" };
}

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
function timeOfDay() {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/60 ${className}`} />;
}

// ─── Bar chart tooltip ────────────────────────────────────────────────────────
function BarTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="text-slate-400 mb-0.5">{label}</p>
      <p className="font-semibold text-slate-900 dark:text-white">{payload[0].value} applied</p>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, icon: Icon, highlight = false, delay
}: {
  label: string; value: number | string; sub?: string;
  icon: React.ElementType; highlight?: boolean; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-2xl p-5 flex flex-col gap-3 overflow-hidden
        ${highlight
          ? "bg-orange-500 text-white"
          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
        }
      `}
    >
      {highlight && (
        // subtle radial highlight at top-right
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.15) 0%, transparent 55%)" }}
        />
      )}

      <div className="flex items-center justify-between">
        <p className={`text-[11px] font-semibold uppercase tracking-widest ${highlight ? "text-orange-100" : "text-slate-400 dark:text-slate-500"}`}>
          {label}
        </p>
        <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${highlight ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800"}`}>
          <Icon className={`h-3.5 w-3.5 ${highlight ? "text-white" : "text-orange-500"}`} />
        </div>
      </div>

      <p className={`text-[2.2rem] font-black leading-none tracking-tight ${highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>
        {value}
      </p>

      {sub && (
        <p className={`text-xs ${highlight ? "text-orange-100/70" : "text-slate-400 dark:text-slate-500"}`}>{sub}</p>
      )}
    </motion.div>
  );
}

// ─── Card shell ───────────────────────────────────────────────────────────────
function Card({
  title, action, children, delay = 0, className = ""
}: {
  title: string; action?: React.ReactNode; children: React.ReactNode;
  delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/70">
        <h2 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function Empty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400 dark:text-slate-600">
      <Briefcase className="h-6 w-6 opacity-30" />
      <p className="text-xs text-center max-w-[180px]">{message}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.token) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/stats`, {
        headers: { Authorization: `Bearer ${session.token}` },
      })
      .then((r) => setStats(r.data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [session?.token]);

  const barData = stats?.applicationsPerDay?.map((d: { date: string; count: number }) => {
    const dt = new Date(d.date);
    return { name: `${dt.getMonth() + 1}/${dt.getDate()}`, count: d.count };
  }) ?? [];

  const pieData = stats?.byStatus?.map((s: { status: string; count: number }) => ({
    ...statusCfg(s.status),
    value: s.count,
  })) ?? [];

  const total: number = stats?.totalApplications ?? 0;
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  // ── Loading ──
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0,1,2,3].map(i => <Skeleton key={i} className="h-[130px]" />)}
        </div>
        <Skeleton className="h-56" />
        <div className="grid gap-5 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Good {timeOfDay()}, <span className="text-orange-500">{firstName}</span>
          </h1>
          <p className="mt-0.5 text-sm text-slate-400 dark:text-slate-500">
            Here&apos;s how your job search looks today.
          </p>
        </div>

        {(stats?.currentStreak ?? 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="hidden sm:flex items-center gap-2 bg-orange-50 dark:bg-orange-950/25 border border-orange-200/60 dark:border-orange-800/30 px-3 py-1.5 rounded-xl"
          >
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
              {stats.currentStreak} day streak
            </span>
          </motion.div>
        )}
      </motion.header>

      {/* ── Onboarding / Empty State ── */}
      {total === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto mt-12 shadow-sm"
        >
          <div className="h-16 w-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Target className="h-8 w-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome to Careora</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            Your personal job search tracker. Log applications, track interview rounds, and build a consistent daily habit.
          </p>
          
          <div className="space-y-4 max-w-sm mx-auto text-left">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">Add your first job</p>
                <p className="text-xs text-slate-500">Go to Pipeline and click Add Application.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">Set your daily goal</p>
                <p className="text-xs text-slate-500">Configure your target in Settings.</p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          {/* ── Stat row ── */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard delay={0.05} label="Total"       value={total}                          icon={Briefcase} />
            <StatCard 
              delay={0.10} 
              label="Today"       
              value={stats?.todayApplications ?? 0}  
              icon={Clock}     
              sub={`/ ${stats?.dailyGoal ?? 5} goal`} 
            />
            <StatCard delay={0.15} label="This week"   value={stats?.weekApplications ?? 0}   icon={FileCheck} sub="7-day window" />
            <StatCard delay={0.20} label="Active"      value={stats?.activePipeline ?? 0}     icon={Target}    sub="interviews & pending" highlight />
          </div>

      {/* ── Heatmap ── */}
      <Card
        title="Application Activity"
        action={
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            {stats?.heatmapData?.length > 0 ? "90 days" : "—"}
          </span>
        }
        delay={0.22}
      >
        {(stats?.heatmapData?.length ?? 0) > 0 ? (
          <Heatmap data={stats!.heatmapData} days={90} />
        ) : (
          <Empty message="No activity recorded yet. Start applying to see your heatmap." />
        )}
      </Card>

      {/* ── Charts row ── */}
      <div className="grid gap-5 lg:grid-cols-3">

        {/* Daily velocity — 2/3 */}
        <Card title="Daily Applications" action={
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            14 days
          </span>
        } delay={0.27} className="lg:col-span-2">
          {barData.length > 0 ? (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="og" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#f97316" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0.30} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="currentColor"
                    strokeDasharray="2 4"
                    className="text-slate-200 dark:text-slate-800"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false} tickLine={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    dy={6}
                  />
                  <YAxis
                    axisLine={false} tickLine={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    allowDecimals={false}
                    width={26}
                  />
                  <Tooltip content={<BarTip />} cursor={{ fill: "rgba(249,115,22,0.05)" }} />
                  <Bar dataKey="count" fill="url(#og)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Empty message="Apply to some jobs to see your daily velocity." />
          )}
        </Card>

        {/* Right column: referral + nudge */}
        <div className="space-y-4">
          {/* Referral card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.27, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 rounded-lg bg-orange-500 flex items-center justify-center">
                <Send className="h-3 w-3 text-white" />
              </div>
              <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">Referral Rate</p>
            </div>

            <p className="text-[3rem] font-black leading-none text-slate-900 dark:text-white">
              {stats?.referralStats?.percentage ?? 0}
              <span className="text-2xl text-slate-300 dark:text-slate-600">%</span>
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">via referral in last 30 days</p>

            <div className="mt-4 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(stats?.referralStats?.percentage ?? 0, 100)}%` }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </motion.div>

          {/* Momentum tips */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
              <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">This Week</p>
            </div>
            <ul className="space-y-2.5">
              {buildTips(stats).map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-orange-400 mt-px flex-shrink-0" />
                  <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom row: Status breakdown + Learning ── */}
      <div className="grid gap-5 lg:grid-cols-3">

        {/* Status breakdown — 2/3 */}
        {pieData.length > 0 ? (
          <Card title="Status Breakdown" delay={0.35} className="lg:col-span-2">
            <div className="grid grid-cols-[180px_1fr] gap-6 items-center">
              {/* Donut */}
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%" cy="50%"
                      innerRadius={52} outerRadius={76}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {pieData.map((d: any, i: number) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 shadow-lg text-xs">
                            <p className="font-semibold text-slate-800 dark:text-white">{d.label}</p>
                            <p className="text-slate-400">{d.value} jobs{total > 0 ? ` · ${Math.round(d.value / total * 100)}%` : ""}</p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend list */}
              <ul className="space-y-2">
                {pieData.map((d: any, i: number) => (
                  <li key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-slate-600 dark:text-slate-400">{d.label}</span>
                    </div>
                    <div className="flex items-center gap-2 tabular-nums">
                      <span className="font-semibold text-slate-900 dark:text-white">{d.value}</span>
                      {total > 0 && (
                        <span className="w-8 text-right text-slate-400">{Math.round(d.value / total * 100)}%</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ) : (
          <Card title="Status Breakdown" delay={0.35} className="lg:col-span-2">
            <Empty message="Your status breakdown will appear once you log applications." />
          </Card>
        )}

        {/* Learning journal — 1/3 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <LearningEditor />
        </motion.div>
      </div>
      </>
      )}
    </div>
  );
}

// ─── Dynamic tips based on real stats ────────────────────────────────────────
function buildTips(stats: Record<string, any> | null): string[] {
  const today  = stats?.todayApplications ?? 0;
  const week   = stats?.weekApplications  ?? 0;
  const active = stats?.activePipeline    ?? 0;

  const tips: string[] = [];

  if (today === 0)
    tips.push("Send at least one application today to keep momentum.");
  else
    tips.push(`${today} sent today — solid effort!`);

  if (week < 5)
    tips.push("Target 5+ per week for the best response rate.");
  else
    tips.push(`${week} this week — you're well above average.`);

  if (active > 0)
    tips.push(`Follow up on ${active} open pipeline item${active > 1 ? "s" : ""}.`);
  else
    tips.push("Focus on getting applications into the interview stage.");

  return tips;
}
