"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { BookOpen, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function LearningEditor({ onSave }: { onSave?: (entry: Record<string, any>) => void }) {
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

      // Use allSettled so a 404/500 on one endpoint doesn't kill the other
      const [todayResult, yesterdayResult] = await Promise.allSettled([
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/learning/today`,
          { headers: { Authorization: `Bearer ${session.token}` } }
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/learning/yesterday`,
          { headers: { Authorization: `Bearer ${session.token}` } }
        ),
      ]);

      if (todayResult.status === 'fulfilled' && todayResult.value.data) {
        setContent(todayResult.value.data.content || "");
        setMissed(todayResult.value.data.missed || "");
      }

      if (yesterdayResult.status === 'fulfilled' && yesterdayResult.value.data?.missed) {
        setYesterdayMissed(yesterdayResult.value.data.missed);
      }

      setIsInitialLoad(false);
    }
    fetchEntries();
  }, [session?.token]);

  const saveEntry = async () => {
    // Don't save if there's nothing to write, or no auth token
    if (!session?.token || (!content.trim() && !missed.trim())) return;
    setSaving(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/learning`,
        { content: content.trim(), missed: missed.trim() },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      // Notify parent so it can update the history list immediately
      if (onSave && res.data) onSave(res.data);
    } catch (e: any) {
      console.error("Failed to save learning entry:", e?.response?.data ?? e);
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

      {/* Learning Card — identical chrome to Card component */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header strip */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/70">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-md bg-orange-500 flex items-center justify-center">
              <BookOpen className="h-3 w-3 text-white" />
            </div>
            <h2 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">Today&apos;s Learning</h2>
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
