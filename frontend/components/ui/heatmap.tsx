"use client";

import React, { useMemo } from "react";
import { format, subDays, startOfDay } from "date-fns";
import { motion } from "framer-motion";

interface HeatmapProps {
  data: { date: string; count: number }[];
  days?: number;
}

export function Heatmap({ data, days = 365 }: HeatmapProps) {
  // Generate last N days
  const grid = useMemo(() => {
    const today = startOfDay(new Date());
    const daysArray = [];
    
    // Create a map for quick lookup
    const dataMap = new Map(data.map(d => [d.date, d.count]));

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, "yyyy-MM-dd");
      const count = dataMap.get(dateStr) || 0;
      daysArray.push({ date, dateStr, count });
    }
    return daysArray;
  }, [data, days]);

  const getColor = (count: number) => {
    if (count === 0) return "bg-slate-100 dark:bg-slate-800";
    if (count === 1) return "bg-emerald-200 dark:bg-emerald-900/40";
    if (count === 2) return "bg-emerald-400 dark:bg-emerald-700/60";
    if (count <= 4) return "bg-emerald-600 dark:bg-emerald-500/80";
    return "bg-emerald-800 dark:bg-emerald-400";
  };

  // Group into columns of 7 days (weeks)
  const weeks: any[][] = [];
  let currentWeek: any[] = [];

  // Pad the first week so it aligns correctly with the day of week (0 is Sunday)
  if (grid.length > 0) {
    const firstDayOfWeek = grid[0].date.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }
  }

  grid.forEach((day, i) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    // Pad the last week
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-1 p-2 min-w-max">
        {weeks.map((week, wIndex) => (
          <div key={wIndex} className="flex flex-col gap-1">
            {week.map((day, dIndex) => {
              if (!day) {
                return <div key={`empty-${wIndex}-${dIndex}`} className="w-3 h-3 bg-transparent rounded-sm" />;
              }
              return (
                <motion.div
                  key={day.dateStr}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (wIndex % 10) * 0.02, duration: 0.2 }}
                  className={`w-3 h-3 rounded-sm ${getColor(day.count)} hover:ring-2 hover:ring-slate-400 dark:hover:ring-slate-300 hover:scale-125 transition-all cursor-pointer z-10 hover:z-20`}
                  title={`${day.count} applications on ${format(day.date, "MMM d, yyyy")}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex justify-end items-center gap-2 text-xs text-slate-500 mt-2 px-2">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800" />
        <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/40" />
        <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-700/60" />
        <div className="w-3 h-3 rounded-sm bg-emerald-600 dark:bg-emerald-500/80" />
        <div className="w-3 h-3 rounded-sm bg-emerald-800 dark:bg-emerald-400" />
        <span>More</span>
      </div>
    </div>
  );
}
