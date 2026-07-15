"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { BookOpen, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function LearningEditor() {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [missed, setMissed] = useState("");
  const [yesterdayMissed, setYesterdayMissed] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      if (!session?.token) return;
      try {
        const [todayRes, yesterdayRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/learning/today`, {
            headers: { Authorization: `Bearer ${session.token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/learning/yesterday`, {
            headers: { Authorization: `Bearer ${session.token}` }
          })
        ]);

        if (todayRes.data) {
          setContent(todayRes.data.content || "");
          setMissed(todayRes.data.missed || "");
        }

        if (yesterdayRes.data && yesterdayRes.data.missed) {
          setYesterdayMissed(yesterdayRes.data.missed);
        }
      } catch (e) {
        console.error("Failed to fetch learning entries", e);
      } finally {
        setIsInitialLoad(false);
      }
    }
    fetchEntries();
  }, [session?.token]);

  const saveEntry = async () => {
    if (!session?.token || (!content && !missed)) return;
    setSaving(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/learning`,
        { content, missed },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error("Failed to save learning entry", e);
    } finally {
      setSaving(false);
    }
  };

  // Debounced save
  useEffect(() => {
    if (isInitialLoad) return;
    const timer = setTimeout(() => {
      saveEntry();
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, missed, isInitialLoad]);

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

      {/* Learning Card */}
      <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-md overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-sm">
              <BookOpen className="h-3.5 w-3.5 text-white" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Today&apos;s Learning</h3>
            <Sparkles className="h-3.5 w-3.5 text-amber-400 ml-auto" />
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">
              What did you learn today?
            </label>
            <Textarea
              placeholder="e.g. Mastered Next.js App Router, read about System Design..."
              className="min-h-[90px] resize-y text-sm bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60 rounded-xl focus:ring-orange-400/30 focus:border-orange-400/60"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">
              Need to review tomorrow?
            </label>
            <Textarea
              placeholder="e.g. Revise React Hooks, finish the DP problem..."
              className="min-h-[60px] resize-y text-sm bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60 rounded-xl focus:ring-orange-400/30 focus:border-orange-400/60"
              value={missed}
              onChange={(e) => setMissed(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center min-h-[20px]">
            {saving ? (
              <span className="animate-pulse text-orange-400">Saving...</span>
            ) : saved ? (
              <span className="text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Saved!
              </span>
            ) : (
              "Auto-saves as you type"
            )}
          </div>
          <Button
            onClick={saveEntry}
            disabled={saving}
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-md shadow-orange-500/20 rounded-xl font-semibold text-xs px-4 transition-all hover:scale-[1.02]"
          >
            Save Now
          </Button>
        </div>
      </div>
    </div>
  );
}
