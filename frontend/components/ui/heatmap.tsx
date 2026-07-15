"use client";

import React, { useMemo, useState } from "react";
import { format, subDays, startOfDay, getDay } from "date-fns";

interface HeatmapProps {
  data: { date: string; count: number }[];
  days?: number;
}

type Day = { date: Date; dateStr: string; count: number };
type MonthGroup = { label: string; weeks: (Day | null)[][] };

const CELL = 13;   // cell size in px
const CELL_GAP = 3; // gap between cells
const MONTH_GAP = 10; // gap between month blocks

// Returns inline style for a cell based on application count
function cellStyle(count: number, isDark = false): React.CSSProperties {
  if (count === 0) return {};
  const alpha = count === 1 ? 0.22 : count === 2 ? 0.48 : count <= 4 ? 0.75 : 1;
  return { backgroundColor: `rgba(249, 115, 22, ${alpha})` };
}

// Groups days into per-month blocks, each month aligned to Sunday columns
function buildMonthGroups(data: { date: string; count: number }[], days: number): MonthGroup[] {
  const today = startOfDay(new Date());
  const dataMap = new Map(data.map((d) => [d.date, d.count]));

  // Build flat day list oldest → newest
  const allDays: Day[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    allDays.push({ date, dateStr: format(date, "yyyy-MM-dd"), count: dataMap.get(format(date, "yyyy-MM-dd")) ?? 0 });
  }

  // Group by calendar month (key = "yyyy-MM")
  const monthMap = new Map<string, Day[]>();
  for (const day of allDays) {
    const key = format(day.date, "yyyy-MM");
    if (!monthMap.has(key)) monthMap.set(key, []);
    monthMap.get(key)!.push(day);
  }

  // For each month group: pad the start so first cell aligns to its DOW (Sunday=0),
  // then chunk into week columns of exactly 7 rows.
  const groups: MonthGroup[] = [];
  for (const [key, days] of monthMap) {
    const firstDOW = getDay(days[0].date); // 0=Sun … 6=Sat
    const padded: (Day | null)[] = [...Array(firstDOW).fill(null), ...days];

    // Chunk into columns of 7
    const weeks: (Day | null)[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
      const slice = padded.slice(i, i + 7);
      while (slice.length < 7) slice.push(null);
      weeks.push(slice);
    }

    groups.push({ label: format(days[0].date, "MMM"), weeks });
  }

  return groups;
}

// Only show Mon / Wed / Fri labels to keep it clean
const DOW_ROWS = [
  { label: "",    show: false }, // Sun
  { label: "Mon", show: true  },
  { label: "",    show: false }, // Tue
  { label: "Wed", show: true  },
  { label: "",    show: false }, // Thu
  { label: "Fri", show: true  },
  { label: "",    show: false }, // Sat
];

export function Heatmap({ data, days = 90 }: HeatmapProps) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const monthGroups = useMemo(() => buildMonthGroups(data, days), [data, days]);

  const rowHeight = CELL + CELL_GAP;
  const gridHeight = 7 * rowHeight - CELL_GAP;

  return (
    <div className="w-full select-none" style={{ position: "relative" }}>
      {/* Custom tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-slate-900 dark:bg-slate-950 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg shadow-xl pointer-events-none border border-slate-700"
          style={{ top: tooltip.y - 40, left: tooltip.x - 60, whiteSpace: "nowrap" }}
        >
          {tooltip.text}
        </div>
      )}

      <div className="flex overflow-x-auto pb-1" style={{ gap: 0 }}>
        {/* DOW labels column — fixed, not scrolling */}
        <div className="flex-shrink-0 mr-2" style={{ marginTop: 18 /* space for month label */ }}>
          {DOW_ROWS.map((row, i) => (
            <div
              key={i}
              style={{ height: i < 6 ? rowHeight : CELL }}
              className="flex items-center"
            >
              {row.show ? (
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-600 leading-none" style={{ width: 24 }}>
                  {row.label}
                </span>
              ) : (
                <span style={{ width: 24 }} />
              )}
            </div>
          ))}
        </div>

        {/* Month groups */}
        <div className="flex overflow-x-auto" style={{ gap: MONTH_GAP }}>
          {monthGroups.map((month, mi) => (
            <div key={mi} className="flex-shrink-0">
              {/* Month label */}
              <div
                className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 leading-none"
                style={{ height: 16 }}
              >
                {month.label}
              </div>

              {/* Week columns side by side */}
              <div className="flex" style={{ gap: CELL_GAP }}>
                {month.weeks.map((col, wi) => (
                  <div key={wi} className="flex flex-col" style={{ gap: CELL_GAP, flexShrink: 0 }}>
                    {col.map((day, di) =>
                      day ? (
                        <div
                          key={day.dateStr}
                          onMouseEnter={(e) => {
                            const label = day.count === 0
                              ? `No applications — ${format(day.date, "MMM d, yyyy")}`
                              : `${day.count} application${day.count !== 1 ? "s" : ""} — ${format(day.date, "MMM d, yyyy")}`;
                            setTooltip({ text: label, x: e.clientX, y: e.clientY });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                          className={`rounded-[3px] cursor-default transition-transform hover:scale-[1.3] hover:z-10 ${
                            day.count === 0 ? "bg-slate-100 dark:bg-slate-800" : ""
                          }`}
                          style={{ width: CELL, height: CELL, flexShrink: 0, ...cellStyle(day.count) }}
                        />
                      ) : (
                        <div key={`pad-${wi}-${di}`} style={{ width: CELL, height: CELL, flexShrink: 0 }} />
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-3">
        <span className="text-[10px] text-slate-400 dark:text-slate-600 mr-0.5">Less</span>
        {([0, 1, 2, 4, 5] as const).map((level, i) => (
          <div
            key={i}
            className={`rounded-[3px] ${level === 0 ? "bg-slate-100 dark:bg-slate-800" : ""}`}
            style={{ width: CELL, height: CELL, ...cellStyle(level) }}
          />
        ))}
        <span className="text-[10px] text-slate-400 dark:text-slate-600 ml-0.5">More</span>
      </div>
    </div>
  );
}
