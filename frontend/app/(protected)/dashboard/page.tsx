"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Clock, FileCheck, Target, Send, Flame, TrendingUp, ArrowUpRight, Sparkles } from "lucide-react";
import axios from "axios";
import { Heatmap } from "@/components/ui/heatmap";
import { LearningEditor } from "@/components/ui/learning-editor";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#c2410c', '#ea580c', '#fed7aa', '#f59e0b'];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  gradient,
  delay,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  subtitle?: string;
  gradient?: boolean;
  delay: number;
}) {
  return (
    <motion.div
      custom={delay}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group ${
        gradient
          ? "bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 border-orange-400/30 shadow-lg shadow-orange-500/25 text-white"
          : "bg-white/70 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-700/60 shadow-md backdrop-blur-sm"
      }`}
    >
      {/* Glow blob */}
      {gradient && (
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      )}
      <div className="flex items-start justify-between mb-3">
        <p className={`text-xs font-semibold uppercase tracking-wider ${gradient ? "text-orange-100" : "text-slate-500 dark:text-slate-400"}`}>
          {title}
        </p>
        <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${
          gradient ? "bg-white/20" : "bg-orange-50 dark:bg-orange-950/40"
        }`}>
          <Icon className={`h-4 w-4 ${gradient ? "text-white" : "text-orange-500"}`} />
        </div>
      </div>
      <div className={`text-3xl font-black tracking-tight ${gradient ? "text-white" : "text-slate-900 dark:text-white"}`}>
        {value}
      </div>
      {subtitle && (
        <p className={`text-xs mt-1.5 ${gradient ? "text-orange-100" : "text-slate-500 dark:text-slate-400"}`}>
          {subtitle}
        </p>
      )}
      {gradient && (
        <div className="absolute bottom-3 right-4 opacity-30 group-hover:opacity-50 transition-opacity">
          <ArrowUpRight className="h-8 w-8 text-white" />
        </div>
      )}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 shadow-xl text-sm">
        <p className="font-semibold text-slate-900 dark:text-white mb-0.5">{label}</p>
        <p className="text-orange-500 font-bold">{payload[0].value} Applications</p>
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 shadow-xl text-sm">
        <p className="font-semibold text-slate-900 dark:text-white">{payload[0].name}</p>
        <p className="text-orange-500 font-bold">{payload[0].value} jobs</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (session?.token) {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/stats`, {
            headers: { Authorization: `Bearer ${session.token}` }
          });
          setStats(res.data);
        } catch (error) {
          console.error("Failed to fetch stats", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchStats();
  }, [session?.token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center animate-pulse shadow-lg shadow-orange-500/30">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  const barData = stats?.applicationsPerDay?.map((d: { date: string; count: number }) => {
    const date = new Date(d.date);
    return {
      name: `${date.getMonth() + 1}/${date.getDate()}`,
      Applications: d.count,
    };
  }) || [];

  const heatmapData = stats?.heatmapData || [];

  const pieData = stats?.byStatus?.map((s: { status: string; count: number }) => ({
    name: s.status,
    value: s.count,
  })) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/30">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Dashboard
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm pl-10.5">
            Welcome back,{" "}
            <span className="font-semibold text-orange-500">
              {session?.user?.name?.split(" ")[0] || "there"}
            </span>{" "}
            — here's your job search at a glance.
          </p>
        </div>
        {/* Streak Badge */}
        {stats?.currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="hidden md:flex items-center gap-2 bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-800/30 rounded-2xl px-4 py-2 shadow-sm"
          >
            <Flame className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">{stats?.currentStreak}-day streak</p>
              <p className="text-[10px] text-orange-500/70">Keep it up! 🎯</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Applications"
          value={stats?.totalApplications || 0}
          icon={Briefcase}
          delay={0}
        />
        <StatCard
          title="Applied Today"
          value={stats?.todayApplications || 0}
          icon={Clock}
          subtitle="Keep up the momentum"
          delay={1}
        />
        <StatCard
          title="Applied This Week"
          value={stats?.weekApplications || 0}
          icon={FileCheck}
          delay={2}
        />
        <StatCard
          title="Active Pipeline"
          value={stats?.activePipeline || 0}
          icon={Target}
          subtitle="Interviews & pending"
          gradient
          delay={3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left — Heatmap + Velocity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Heatmap */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-md p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Application Heatmap
              </h2>
              <span className="ml-auto text-xs text-slate-400 dark:text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                90 Days
              </span>
            </div>
            {heatmapData.length > 0 ? (
              <Heatmap data={heatmapData} days={90} />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Briefcase className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">No application data yet. Start applying!</p>
              </div>
            )}
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-md p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Application Velocity
              </h2>
              <span className="ml-auto text-xs text-slate-400 dark:text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                14 Days
              </span>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
                      <stop offset="100%" stopColor="#fb923c" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(249,115,22,0.06)', radius: 8 }} />
                  <Bar dataKey="Applications" fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Right — Referral + Learning */}
        <div className="lg:col-span-1 space-y-5">
          {/* Referral Card */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden rounded-2xl border border-amber-200/60 dark:border-amber-800/30 bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-transparent dark:from-amber-950/30 dark:via-orange-950/20 dark:to-transparent shadow-md p-5"
          >
            <div className="absolute -top-6 -right-6 w-28 h-28 bg-amber-300/20 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                <Send className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">Referral Success</h3>
            </div>
            <div className="text-5xl font-black text-orange-600 dark:text-orange-400 tracking-tight">
              {stats?.referralStats?.percentage || 0}
              <span className="text-2xl font-bold text-orange-400">%</span>
            </div>
            <p className="text-xs text-amber-700/70 dark:text-amber-400/60 mt-1.5">
              of your applications are referrals (30d)
            </p>
            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-amber-100 dark:bg-amber-900/40 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats?.referralStats?.percentage || 0}%` }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
              />
            </div>
          </motion.div>

          {/* Learning Journal */}
          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="[&_label]:text-slate-600 [&_label]:dark:text-slate-400"
          >
            <LearningEditor />
          </motion.div>
        </div>
      </div>

      {/* Status Distribution Pie */}
      <motion.div
        custom={7}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-md p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-2 rounded-full bg-orange-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Status Distribution
          </h2>
        </div>
        <div className="h-[280px] w-full flex items-center justify-center">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry: { name: string; value: number }, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={40}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ color: 'var(--muted-foreground)', fontSize: '12px', fontWeight: 500 }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Target className="h-7 w-7 opacity-40" />
              </div>
              <p className="text-sm">No applications yet — start building your pipeline!</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
