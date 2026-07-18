"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { LearningEditor } from "@/components/ui/learning-editor";
import { RatingHeatmap } from "@/components/ui/rating-heatmap";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, subDays } from "date-fns";
import {
  BookOpen,
  Flame,
  CalendarDays,
  Star,
  SunMedium,
  Smartphone,
  AlignLeft,
  Moon,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function getRatingColor(r: number): string {
  if (r <= 3) return "#ef4444";
  if (r <= 5) return "#f59e0b";
  if (r <= 7) return "#84cc16";
  return "#10b981";
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800 ${className}`} />
  );
}

/** Convert "HH:MM" → decimal hours (e.g. "07:30" → 7.5) */
function timeToHours(t: string | null): number | null {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return h + m / 60;
}

/**
 * Sleep time converter — maps times after midnight (0–5 h) to 24–29 h
 * so the Y-axis stays continuous (e.g. 00:30 → 24.5, 01:00 → 25)
 */
function sleepToHours(t: string | null): number | null {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  const hours = h + m / 60;
  return hours < 6 ? hours + 24 : hours; // past-midnight wrap
}

/** Format decimal hours to "7:30 AM" / "11:30 PM" / "12:30 AM" */
function hoursToLabel(val: number): string {
  const wrapped = val >= 24 ? val - 24 : val; // unwrap for display
  const h = Math.floor(wrapped);
  const m = Math.round((wrapped - h) * 60);
  const ampm = h < 12 ? "AM" : "PM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${m.toString().padStart(2, "0")} ${ampm}`;
}

/** Build evenly-spaced ticks for a given [min,max] domain with step=0.5 */
function buildTicks(min: number, max: number, step = 0.5): number[] {
  const ticks: number[] = [];
  let t = Math.ceil(min / step) * step;
  while (t <= max + 0.001) { ticks.push(parseFloat(t.toFixed(2))); t += step; }
  return ticks;
}

/* ─── Custom Tooltip ─────────────────────────────────────────────────────── */
function SleepTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 text-white text-[11px] px-2.5 py-2 rounded-lg shadow-xl">
      <p className="font-semibold text-slate-300 mb-0.5">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey === "wakeHours" ? "⏰" : "🌙"} {hoursToLabel(p.value)}
        </p>
      ))}
    </div>
  );
}

function InstaTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 text-white text-[11px] px-2.5 py-2 rounded-lg shadow-xl">
      <p className="font-semibold text-slate-300 mb-0.5">{label}</p>
      <p className="text-pink-400">📱 {payload[0].value} min</p>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function LearnPage() {
  const { data: session } = useSession();
  const [history, setHistory] = useState<Record<string, any>[]>([]);
  const [heatmapData, setHeatmapData] = useState<{
    date: string;
    rating: number | null;
    wakeUpTime: string | null;
    sleepTime: string | null;
    instaScreenTime: number | null;
  }[]>([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    if (!session?.token) return;
    const headers = { Authorization: `Bearer ${session.token}` };

    Promise.allSettled([
      axios.get(`${API}/api/learning`, { headers }),
      axios.get(`${API}/api/learning/heatmap?days=365`, { headers }),
    ]).then(([historyRes, heatmapRes]) => {
      if (historyRes.status === "fulfilled") setHistory(historyRes.value.data);
      if (heatmapRes.status === "fulfilled") setHeatmapData(heatmapRes.value.data);
      setLoading(false);
    });
  }, [session?.token]);

  /* ── When the editor saves → refresh history + heatmap ── */
  const handleSave = useCallback(
    (saved: Record<string, any>) => {
      setHistory((prev) => {
        const idx = prev.findIndex((e) => e.id === saved.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [saved, ...prev];
      });
      if (session?.token) {
        axios
          .get(`${API}/api/learning/heatmap?days=365`, {
            headers: { Authorization: `Bearer ${session.token}` },
          })
          .then((r) => setHeatmapData(r.data))
          .catch(() => {});
      }
    },
    [session?.token]
  );

  /* ── Entry date set ── */
  const entryDateSet = useMemo(() => {
    const s = new Set<string>();
    history.forEach((e) => s.add(e.date.split("T")[0]));
    return s;
  }, [history]);

  /* ── Current streak ── */
  const streak = useMemo(() => {
    const today     = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (!entryDateSet.has(today) && !entryDateSet.has(yesterday)) return 0;
    let count = 0;
    let cursor = new Date();
    while (true) {
      const d = cursor.toISOString().split("T")[0];
      if (entryDateSet.has(d)) { count++; cursor = new Date(cursor.getTime() - 86400000); }
      else break;
    }
    return count;
  }, [entryDateSet]);

  /* ── Longest ever streak ── */
  const longestStreak = useMemo(() => {
    if (!history.length) return 0;
    const sorted = [...history].map((e) => e.date.split("T")[0]).sort();
    let max = 1, cur = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diff = (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime()) / 86400000;
      if (diff === 1) { cur++; max = Math.max(max, cur); } else cur = 1;
    }
    return max;
  }, [history]);

  /* ── Avg rating last 7 days ── */
  const avgRating7 = useMemo(() => {
    const cutoff = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    const rated = heatmapData.filter((d) => d.date >= cutoff && d.rating != null);
    if (!rated.length) return null;
    return Math.round((rated.reduce((s, d) => s + d.rating!, 0) / rated.length) * 10) / 10;
  }, [heatmapData]);

  /* ── Graph data: last 30 days ── */
  const graphData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = subDays(new Date(), 29 - i);
      const dateStr = d.toISOString().split("T")[0];
      const entry = heatmapData.find((h) => h.date === dateStr);
      return {
        date: format(d, "MMM d"),
        wakeHours:  timeToHours(entry?.wakeUpTime ?? null),
        sleepHours: sleepToHours(entry?.sleepTime ?? null),
        insta:      entry?.instaScreenTime ?? null,
      };
    });
  }, [heatmapData]);

  /* ── Y-axis domain + explicit ticks for wake/sleep chart ── */
  const sleepWakeDomain = useMemo(() => {
    const wakeVals  = graphData.map((d) => d.wakeHours).filter((v): v is number => v !== null);
    const sleepVals = graphData.map((d) => d.sleepHours).filter((v): v is number => v !== null);
    const allVals   = [...wakeVals, ...sleepVals];
    if (!allVals.length) return { domain: [5, 26] as [number,number], ticks: buildTicks(5, 26, 1) };
    const raw_min = Math.min(...allVals);
    const raw_max = Math.max(...allVals);
    // At least a 4-hour window so ticks don't crowd
    const min = Math.floor(raw_min) - 1;
    const max = Math.ceil(raw_max)  + 1;
    const span = max - min < 4 ? 4 : max - min;
    const adjMax = min + span;
    return { domain: [min, adjMax] as [number,number], ticks: buildTicks(min, adjMax, 1) };
  }, [graphData]);

  /* ─────────────────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-start justify-between flex-wrap gap-2"
      >
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-orange-500" />
            Life Journal
          </h1>
          <p className="mt-0.5 text-sm text-slate-400 dark:text-slate-500">
            Track your day, your growth, and your habits.
          </p>
        </div>
        {avgRating7 != null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl"
          >
            <Star className="h-3.5 w-3.5" style={{ color: getRatingColor(Math.round(avgRating7)) }} />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {avgRating7}/10 avg (7d)
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* ── Heatmap Card (365 days, streak top-right) ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
      >
        {/* Card header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            <h2 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">
              Day Rating — Last Year
            </h2>
          </div>

          {/* Streak summary — top right of heatmap card */}
          {!loading && (
            <div className="flex items-center gap-3">
              {streak > 0 && (
                <motion.div
                  key={streak}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/25 border border-orange-200/60 dark:border-orange-800/30 px-3 py-1.5 rounded-xl"
                >
                  <span className="text-base">🔥</span>
                  <div className="flex flex-col leading-none">
                    <span className="text-sm font-black text-orange-500">{streak}</span>
                    <span className="text-[9px] font-semibold text-orange-400 uppercase tracking-wider">day streak</span>
                  </div>
                </motion.div>
              )}
              <div className="flex flex-col items-end leading-none">
                <span className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-wider">Best</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <Flame className="h-3 w-3 text-orange-400" />{longestStreak}d
                </span>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <RatingHeatmap data={heatmapData} days={365} />
        )}
      </motion.div>

      {/* ── Habit Graphs (Sleep schedule + Insta screen time) ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-4 md:grid-cols-2"
      >
        {/* Sleep & Wake schedule graph */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-5 rounded-md bg-amber-400/20 flex items-center justify-center">
              <SunMedium className="h-3 w-3 text-amber-500" />
            </div>
            <h2 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">
              Sleep &amp; Wake Schedule
            </h2>
            <span className="ml-auto text-[11px] text-slate-400 dark:text-slate-600">Last 30 days</span>
          </div>
          {/* legend */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 rounded-full bg-amber-400" />
              <span className="text-[10px] text-slate-400">⏰ Woke up</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 rounded-full bg-indigo-400" />
              <span className="text-[10px] text-slate-400">🌙 Slept at</span>
            </div>
          </div>

          {loading ? (
            <Skeleton className="h-36 w-full" />
          ) : graphData.every((d) => d.wakeHours === null && d.sleepHours === null) ? (
            <div className="h-36 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-600">
              <SunMedium className="h-6 w-6 opacity-30" />
              <p className="text-xs">No sleep/wake times logged yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={graphData} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
                <defs>
                  <linearGradient id="wakeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  interval={6}
                />
                <YAxis
                  domain={sleepWakeDomain.domain}
                  ticks={sleepWakeDomain.ticks}
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={hoursToLabel}
                  width={58}
                />
                <Tooltip content={<SleepTooltip />} cursor={{ stroke: "#94a3b833", strokeWidth: 2 }} />
                {/* Wake-up line */}
                <Area
                  type="monotone"
                  dataKey="wakeHours"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#wakeGrad)"
                  dot={(p: any) =>
                    p.payload.wakeHours !== null ? (
                      <circle cx={p.cx} cy={p.cy} r={2.5} fill="#f59e0b" key={`w-${p.index}`} />
                    ) : <g key={`w-${p.index}`} />
                  }
                  connectNulls={false}
                />
                {/* Sleep line */}
                <Area
                  type="monotone"
                  dataKey="sleepHours"
                  stroke="#818cf8"
                  strokeWidth={2}
                  fill="url(#sleepGrad)"
                  dot={(p: any) =>
                    p.payload.sleepHours !== null ? (
                      <circle cx={p.cx} cy={p.cy} r={2.5} fill="#818cf8" key={`s-${p.index}`} />
                    ) : <g key={`s-${p.index}`} />
                  }
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Instagram screen time graph */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 rounded-md bg-pink-400/20 flex items-center justify-center">
              <Smartphone className="h-3 w-3 text-pink-500" />
            </div>
            <h2 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">
              Instagram Screen Time
            </h2>
            <span className="ml-auto text-[11px] text-slate-400 dark:text-slate-600">Last 30 days</span>
          </div>

          {loading ? (
            <Skeleton className="h-36 w-full" />
          ) : graphData.every((d) => d.insta === null) ? (
            <div className="h-36 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-600">
              <Smartphone className="h-6 w-6 opacity-30" />
              <p className="text-xs">No screen time logged yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={graphData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="instaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  interval={6}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}m`}
                  width={36}
                />
                <Tooltip content={<InstaTooltip />} cursor={{ stroke: "#ec489933", strokeWidth: 2 }} />
                {/* Reference line at 30 min — suggested limit */}
                <ReferenceLine y={30} stroke="#ec489944" strokeDasharray="4 4" label={{ value: "30m limit", position: "insideTopRight", fontSize: 9, fill: "#ec4899aa" }} />
                <Area
                  type="monotone"
                  dataKey="insta"
                  stroke="#ec4899"
                  strokeWidth={2}
                  fill="url(#instaGrad)"
                  dot={(p: any) => p.payload.insta !== null ? (
                    <circle cx={p.cx} cy={p.cy} r={2.5} fill="#ec4899" key={p.index} />
                  ) : <g key={p.index} />}
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      {/* ── Body: Editor + History ── */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* Editor — 2/3 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-2"
        >
          <LearningEditor onSave={handleSave} />
        </motion.div>

        {/* History — 1/3 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-1"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-800/70">
              <CalendarDays className="h-4 w-4 text-orange-500" />
              <h2 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">History</h2>
              {history.length > 0 && (
                <span className="ml-auto text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {history.length} entries
                </span>
              )}
            </div>

            <div className="px-4 py-3 max-h-[620px] overflow-y-auto space-y-2" style={{ scrollbarWidth: "thin" }}>
              {loading ? (
                <div className="space-y-2 py-1">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                  <Skeleton className="h-18" />
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400 dark:text-slate-600">
                  <BookOpen className="h-6 w-6 opacity-30" />
                  <p className="text-xs text-center">No entries yet.<br />Start writing today!</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {history.map((entry, i) => {
                    const rc = entry.dayRating ? getRatingColor(entry.dayRating) : null;
                    return (
                      <motion.div
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                        className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-3.5 py-3 space-y-2"
                        style={rc ? { borderLeftColor: rc, borderLeftWidth: 3 } : {}}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {format(parseISO(entry.date), "EEE, MMM d")}
                          </p>
                          {entry.dayRating && (
                            <span
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                              style={{ color: rc!, backgroundColor: `${rc}22` }}
                            >
                              ★ {entry.dayRating}/10
                            </span>
                          )}
                        </div>

                        {(entry.wakeUpTime || entry.instaScreenTime != null) && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {entry.wakeUpTime && (
                              <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-md">
                                <SunMedium className="h-2.5 w-2.5" />
                                {entry.wakeUpTime}
                              </span>
                            )}
                            {entry.instaScreenTime != null && (
                              <span className="flex items-center gap-1 text-[10px] text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 px-1.5 py-0.5 rounded-md">
                                <Smartphone className="h-2.5 w-2.5" />
                                {entry.instaScreenTime}m
                              </span>
                            )}
                          </div>
                        )}

                        {entry.daySummary && (
                          <div>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                              <AlignLeft className="h-2.5 w-2.5" /> Summary
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-2">
                              {entry.daySummary}
                            </p>
                          </div>
                        )}

                        {entry.content && (
                          <div>
                            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-0.5">Learned</p>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-3">
                              {entry.content}
                            </p>
                          </div>
                        )}

                        {entry.missed && (
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Review →</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap line-clamp-2">
                              {entry.missed}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
