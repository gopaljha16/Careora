"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
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
    <div className="space-y-4">
      {yesterdayMissed && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md shadow-sm">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-amber-800">Review from Yesterday</h4>
              <p className="text-sm text-amber-700 mt-1 whitespace-pre-wrap">{yesterdayMissed}</p>
            </div>
          </div>
        </div>
      )}

      <Card className="border-0 shadow-sm ring-1 ring-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Today&apos;s Learning Journal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">What did you learn today?</label>
            <Textarea 
              placeholder="e.g. Mastered Next.js App Router, read about System Design..."
              className="min-h-[120px] resize-y"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">What did you miss / need to review tomorrow?</label>
            <Textarea 
              placeholder="e.g. Need to revise React Hooks, missed the DP problem..."
              className="min-h-[80px] resize-y"
              value={missed}
              onChange={(e) => setMissed(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-xs text-slate-500 flex items-center min-h-[20px]">
            {saving ? (
              <span className="animate-pulse">Saving...</span>
            ) : saved ? (
              <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Saved</span>
            ) : (
              "Auto-saves as you type"
            )}
          </div>
          <Button onClick={saveEntry} disabled={saving} size="sm">
            Save Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
