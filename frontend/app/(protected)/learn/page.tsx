"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { LearningEditor } from "@/components/ui/learning-editor";
import { StreakBadge } from "@/components/ui/streak-badge";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { BookOpen, Flame, CalendarDays, ArrowRight } from "lucide-react";

export default function LearnPage() {
  const { data: session } = useSession();
  const [history, setHistory] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.token) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/learning`, {
        headers: { Authorization: `Bearer ${session.token}` },
      })
      .then((r) => setHistory(r.data))
      .catch((e) => console.error("Failed to fetch learning history", e))
      .finally(() => setLoading(false));
  }, [session?.token]);

  // When the editor saves, upsert the entry into local history immediately
  const handleSave = useCallback((saved: Record<string, any>) => {
    setHistory((prev) => {
      const idx = prev.findIndex((e) => e.id === saved.id);
      if (idx >= 0) {
        // Update existing entry in-place
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      // New entry — prepend (history is ordered newest-first)
      return [saved, ...prev];
    });
  }, []);

  // Streak calculation
  const streak = useMemo(() => {
    if (!history.length) return 0;
    const today     = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const first     = history[0].date.split("T")[0];
    if (first !== today && first !== yesterday) return 0;
    let count = 1;
    for (let i = 1; i < history.length; i++) {
      const diff = new Date(history[i - 1].date).getTime() - new Date(history[i].date).getTime();
      if (diff === 86400000) count++;
      else break;
    }
    return count;
  }, [history]);

  function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800 ${className}`} />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-orange-500" />
            Learning Journal
          </h1>
          <p className="mt-0.5 text-sm text-slate-400 dark:text-slate-500">
            Track what you learn and what to review tomorrow.
          </p>
        </div>

        {streak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 200 }}
            className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950/25 border border-orange-200/60 dark:border-orange-800/30 px-3 py-1.5 rounded-xl"
          >
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
              {streak} day streak
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Body */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* Editor — 2/3 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-2"
        >
          {/* Pass onSave so history updates immediately without reload */}
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
            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-800/70">
              <CalendarDays className="h-4 w-4 text-orange-500" />
              <h2 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">History</h2>
              {history.length > 0 && (
                <span className="ml-auto text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {history.length} entries
                </span>
              )}
            </div>

            {/* List */}
            <div className="px-4 py-3 max-h-[520px] overflow-y-auto space-y-2">
              {loading ? (
                <div className="space-y-2 py-1">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                  <Skeleton className="h-16" />
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400 dark:text-slate-600">
                  <BookOpen className="h-6 w-6 opacity-30" />
                  <p className="text-xs text-center">No entries yet.<br />Start writing today!</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {history.map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-3.5 py-3 space-y-2"
                    >
                      {/* Date */}
                      <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {format(parseISO(entry.date), "EEE, MMM d")}
                      </p>

                      {/* Content */}
                      {entry.content && (
                        <div>
                          <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-0.5">Learned</p>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-3">
                            {entry.content}
                          </p>
                        </div>
                      )}

                      {/* Missed */}
                      {entry.missed && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                            Review →
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap line-clamp-2">
                            {entry.missed}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
