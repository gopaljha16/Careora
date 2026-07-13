"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { LearningEditor } from "@/components/ui/learning-editor";
import { StreakBadge } from "@/components/ui/streak-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";

export default function LearnPage() {
  const { data: session } = useSession();
  const [history, setHistory] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (session?.token) {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/learning`, {
            headers: { Authorization: `Bearer ${session.token}` }
          });
          setHistory(res.data);
        } catch (error) {
          console.error("Failed to fetch learning history", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchHistory();
  }, [session?.token]);

  // Calculate streak based on history dates
  const streak = useMemo(() => {
    let currentStreak = 0;
    if (history.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      const firstDate = history[0].date.split('T')[0];
      if (firstDate === today || firstDate === yesterday) {
        currentStreak = 1;
        for (let i = 1; i < history.length; i++) {
          const curr = new Date(history[i].date).getTime();
          const prev = new Date(history[i-1].date).getTime();
          if (prev - curr === 86400000) { // Exactly 1 day diff
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }
    return currentStreak;
  }, [history]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Learning Journal</h2>
          <p className="text-muted-foreground mt-1">Track your daily knowledge and things to review.</p>
        </div>
        <StreakBadge count={streak} />
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <LearningEditor />
        </div>
        
        <div className="md:col-span-1 space-y-6">
          <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2">History</h3>
          {loading ? (
            <div className="text-muted-foreground text-sm">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-muted-foreground text-sm">No entries yet. Start logging your learning today!</div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {history.map((entry) => (
                <Card key={entry.id} className="shadow-sm border border-border">
                  <CardHeader className="pb-2 bg-muted/40">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {format(parseISO(entry.date), "EEEE, MMM d, yyyy")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    {entry.content && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Learned</h4>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{entry.content}</p>
                      </div>
                    )}
                    {entry.missed && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Missed/Review</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entry.missed}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
