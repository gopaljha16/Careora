"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Star,
  Clock,
  Smartphone,
  SunMedium,
  Moon,
  AlignLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/* ─── Rating colour helpers ──────────────────────────────────────────────── */

function getRatingColor(r: number): string {
  if (r <= 3) return "#ef4444"; // red
  if (r <= 5) return "#f59e0b"; // amber
  if (r <= 7) return "#84cc16"; // lime
  return "#10b981";             // emerald
}

function getRatingLabel(r: number): string {
  if (r === 0)  return "Not rated";
  if (r <= 2)   return "Terrible";
  if (r === 3)  return "Bad";
  if (r === 4)  return "Below Average";
  if (r === 5)  return "Average";
  if (r === 6)  return "Decent";
  if (r === 7)  return "Good";
  if (r === 8)  return "Great";
  if (r === 9)  return "Excellent";
  return "Perfect Day!";
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export function LearningEditor({
  onSave,
}: {
  onSave?: (entry: Record<string, any>) => void;
}) {
  const { data: session } = useSession();

  // Learning fields
  const [content, setContent] = useState("");
  const [missed, setMissed] = useState("");
  const [yesterdayMissed, setYesterdayMissed] = useState("");

  // Life-tracking fields
  const [dayRating, setDayRating] = useState(0);
  const [wakeUpTime, setWakeUpTime] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [instaScreenTime, setInstaScreenTime] = useState("");
  const [daySummary, setDaySummary] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  /* ── Fetch today & yesterday ─────────────────────────────────────────── */
  useEffect(() => {
    async function fetchEntries() {
      if (!session?.token) return;

      const [todayResult, yesterdayResult] = await Promise.allSettled([
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/learning/today`,
          { headers: { Authorization: `Bearer ${session.token}` } }
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/learning/yesterday`,
          { headers: { Authorization: `Bearer ${session.token}` } }
        ),
      ]);

      if (todayResult.status === "fulfilled" && todayResult.value.data) {
        const d = todayResult.value.data;
        setContent(d.content || "");
        setMissed(d.missed || "");
        setDayRating(d.dayRating ?? 0);
        setWakeUpTime(d.wakeUpTime || "");
        setSleepTime(d.sleepTime || "");
        setInstaScreenTime(d.instaScreenTime != null ? String(d.instaScreenTime) : "");
        setDaySummary(d.daySummary || "");
      }

      if (
        yesterdayResult.status === "fulfilled" &&
        yesterdayResult.value.data?.missed
      ) {
        setYesterdayMissed(yesterdayResult.value.data.missed);
      }

      setIsInitialLoad(false);
    }
    fetchEntries();
  }, [session?.token]);

  /* ── Save ─────────────────────────────────────────────────────────────── */
  const saveEntry = async () => {
    if (!session?.token) return;
    // Need at least one field to save
    if (
      !content.trim() &&
      !missed.trim() &&
      !dayRating &&
      !wakeUpTime.trim() &&
      !sleepTime.trim() &&
      !instaScreenTime.trim() &&
      !daySummary.trim()
    )
      return;

    setSaving(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/learning`,
        {
          content: content.trim(),
          missed: missed.trim(),
          dayRating: dayRating || null,
          wakeUpTime: wakeUpTime.trim() || null,
          sleepTime: sleepTime.trim() || null,
          instaScreenTime: instaScreenTime !== "" ? parseInt(instaScreenTime, 10) : null,
          daySummary: daySummary.trim() || null,
        },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (onSave && res.data) onSave(res.data);
    } catch (e: any) {
      console.error("Failed to save learning entry:", e?.response?.data ?? e);
    } finally {
      setSaving(false);
    }
  };

  /* ── Debounced auto-save ─────────────────────────────────────────────── */
  useEffect(() => {
    if (isInitialLoad) return;
    const timer = setTimeout(() => {
      saveEntry();
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, missed, dayRating, wakeUpTime, sleepTime, instaScreenTime, daySummary, isInitialLoad]);

  /* ── Render ──────────────────────────────────────────────────────────── */
  const ratingColor = dayRating > 0 ? getRatingColor(dayRating) : undefined;

  return (
    <div className="space-y-3">
      {/* Yesterday's missed review */}
      {yesterdayMissed && (
        <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 rounded-xl p-3.5">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1">
                Review from Yesterday
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-400/80 whitespace-pre-wrap leading-relaxed">
                {yesterdayMissed}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Day Rating Card ─────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/70">
          <div className="flex items-center gap-2">
            <div
              className="h-5 w-5 rounded-md flex items-center justify-center transition-colors duration-300"
              style={{ backgroundColor: ratingColor ?? "#6b7280" }}
            >
              <Star className="h-3 w-3 text-white" />
            </div>
            <h2 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">
              Rate Your Day
            </h2>
          </div>
          {dayRating > 0 && (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                color: ratingColor,
                backgroundColor: ratingColor ? `${ratingColor}1a` : undefined,
              }}
            >
              {dayRating}/10 — {getRatingLabel(dayRating)}
            </span>
          )}
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Slider */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block mb-3 uppercase tracking-wider">
              Overall Day Rating (1 = Terrible, 10 = Perfect)
            </label>
            <div className="relative">
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={dayRating || 1}
                onChange={(e) => setDayRating(parseInt(e.target.value, 10))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: dayRating > 0
                    ? `linear-gradient(to right, ${ratingColor} 0%, ${ratingColor} ${((dayRating - 1) / 9) * 100}%, #e2e8f0 ${((dayRating - 1) / 9) * 100}%, #e2e8f0 100%)`
                    : "#e2e8f0",
                  accentColor: ratingColor,
                }}
              />
              {/* Tick marks */}
              <div className="flex justify-between mt-1.5 px-0.5">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <span
                    key={n}
                    className="text-[9px] font-semibold cursor-pointer select-none transition-colors"
                    style={{
                      color: n === dayRating ? ratingColor : "#94a3b8",
                    }}
                    onClick={() => setDayRating(n)}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Wake up time | Sleep time | Insta screen time — 3 cols */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                <SunMedium className="h-3 w-3 text-amber-400" />
                Woke Up
              </label>
              <input
                type="time"
                value={wakeUpTime}
                onChange={(e) => setWakeUpTime(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                <Moon className="h-3 w-3 text-indigo-400" />
                Slept At
              </label>
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                <Smartphone className="h-3 w-3 text-pink-400" />
                Insta (min)
              </label>
              <input
                type="number"
                min={0}
                max={1440}
                placeholder="e.g. 45"
                value={instaScreenTime}
                onChange={(e) => setInstaScreenTime(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition"
              />
            </div>
          </div>

          {/* Day Summary */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
              <AlignLeft className="h-3 w-3 text-indigo-400" />
              Day Summary
            </label>
            <Textarea
              placeholder="How did the day go? Any wins, struggles, or moments worth remembering..."
              className="min-h-[70px] resize-y text-sm rounded-xl"
              value={daySummary}
              onChange={(e) => setDaySummary(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Learning Card ────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header strip */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/70">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-md bg-orange-500 flex items-center justify-center">
              <BookOpen className="h-3 w-3 text-white" />
            </div>
            <h2 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">
              Today&apos;s Learning
            </h2>
          </div>
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block mb-1.5 uppercase tracking-wider">
              What did you learn?
            </label>
            <Textarea
              placeholder="e.g. Mastered Next.js App Router, studied System Design..."
              className="min-h-[90px] resize-y text-sm rounded-xl"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block mb-1.5 uppercase tracking-wider">
              Review tomorrow?
            </label>
            <Textarea
              placeholder="e.g. Finish the DP problem, revise React Hooks..."
              className="min-h-[60px] resize-y text-sm rounded-xl"
              value={missed}
              onChange={(e) => setMissed(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              {saving ? (
                <span className="animate-pulse text-orange-400">Saving…</span>
              ) : saved ? (
                <span className="text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Saved
                </span>
              ) : (
                "Auto-saves as you type"
              )}
            </span>
            <Button
              onClick={saveEntry}
              disabled={saving}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-xs px-3.5 h-7"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
