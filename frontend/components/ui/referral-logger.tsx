"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Plus, Minus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

const PLATFORMS = ["LinkedIn", "Naukri", "Instahyre", "AngelList", "Indeed", "Direct", "Other"];

export function ReferralLogger() {
  const { data: session } = useSession();
  const [platform, setPlatform] = useState("LinkedIn");
  const [logs, setLogs] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchLogs() {
      if (session?.token) {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/referrals/today`, {
            headers: { Authorization: `Bearer ${session.token}` }
          });
          const newLogs: Record<string, number> = {};
          res.data.forEach((log: {platform: string, count: number}) => {
            newLogs[log.platform] = log.count;
          });
          setLogs(newLogs);
        } catch (e) {
          console.error("Failed to fetch referral logs", e);
        }
      }
    }
    fetchLogs();
  }, [session?.token]);

  const updateCount = async (increment: number) => {
    if (!session?.token) return;
    const currentCount = logs[platform] || 0;
    const newCount = Math.max(0, currentCount + increment);
    
    // Optimistic update
    setLogs(prev => ({ ...prev, [platform]: newCount }));

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/referrals`,
        { platform, count: newCount },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
    } catch (e) {
      console.error("Failed to update referral count", e);
      // Revert on failure
      setLogs(prev => ({ ...prev, [platform]: currentCount }));
    }
  };

  return (
    <Card className="shadow-sm border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
          <Send className="w-5 h-5 text-indigo-500" />
          Referral Messages Today
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Select value={platform} onValueChange={(val) => val && setPlatform(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-3 bg-muted p-1.5 rounded-lg border border-border">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-md"
              onClick={() => updateCount(-1)}
              disabled={!logs[platform]}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <div className="w-8 text-center font-bold text-lg text-foreground relative h-7 overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={logs[platform] || 0}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {logs[platform] || 0}
                </motion.span>
              </AnimatePresence>
            </div>
            
            <Button 
              variant="default" 
              size="icon" 
              className="h-8 w-8 rounded-md bg-primary hover:bg-primary/95 text-primary-foreground"
              onClick={() => updateCount(1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
