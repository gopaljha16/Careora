"use client";

import React, { useMemo, useState } from "react";
import { format, subDays, startOfDay, getDay, addDays } from "date-fns";

interface RatingHeatmapProps {
  data: { date: string; rating: number | null }[];
  days?: number;
}

const CELL = 13;
const CELL_GAP = 3;
const COL_GAP = 3;
const MONTH_SEP = 8; // extra gap before the first column of a new month

function ratingColor(rating: number): React.CSSProperties {
  // red(0°) → amber(45°) → lime(100°) → emerald(160°)
  const hue = Math.round(((rating - 1) / 9) * 160);
  return { backgroundColor: `hsl(${hue}, 72%, 44%)` };
}

interface Cell {
  date: Date;
  dateStr: string;
  rating: number | null;
  inWindow: boolean;
  isToday: boolean;
}

interface Column {
  cells: Cell[];
  monthLabel?: string; // shown if this column is the first of a new calendar month
}

/**
 * LeetCode-style: build a continuous grid of week-columns.
 * Each column = 7 rows (Sunday top → Saturday bottom).
 * Today is always in the rightmost column.
 * Month labels appear on the first column whose window-visible cells
 * contain the first occurrence of a new month.
 */
function buildWeekGrid(
  data: { date: string; rating: number | null }[],
  days: number
): Column[] {
  const today    = startOfDay(new Date());
  const winStart = subDays(today, days - 1);
  const dataMap  = new Map(data.map((d) => [d.date, d.rating]));

  // Start grid from the Sunday at-or-before winStart
  const dow       = getDay(winStart); // 0=Sun … 6=Sat
  const gridStart = subDays(winStart, dow);

  const columns: Column[]   = [];
  const seenMonths = new Set<string>();
  let   cursor     = gridStart;

  while (cursor <= today) {
    const cells: Cell[]      = [];
    let   monthLabel: string | undefined;

    for (let row = 0; row < 7; row++) {
      const d       = addDays(cursor, row);
      const dateStr = format(d, "yyyy-MM-dd");
      const inWin   = d >= winStart && d <= today;
      const isToday = dateStr === format(today, "yyyy-MM-dd");

      if (inWin) {
        const mk = format(d, "yyyy-MM");
        if (!seenMonths.has(mk)) {
          seenMonths.add(mk);
          monthLabel = format(d, "MMM");
        }
      }

      cells.push({
        date: d,
        dateStr,
        rating: dataMap.get(dateStr) ?? null,
        inWindow: inWin,
        isToday,
      });
    }

    columns.push({ cells, monthLabel });
    cursor = addDays(cursor, 7);
  }

  return columns;
}

const DOW_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const LEGEND = [
  { rating: null, label: "No entry" },
  { rating: 2,   label: "1–3 Bad"   },
  { rating: 5,   label: "4–6 OK"    },
  { rating: 7,   label: "7–8 Good"  },
  { rating: 10,  label: "9–10 Great"},
];

export function RatingHeatmap({ data, days = 365 }: RatingHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const columns   = useMemo(() => buildWeekGrid(data, days), [data, days]);
  const rowHeight = CELL + CELL_GAP;

  return (
    <div className="w-full select-none relative">

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-slate-900 dark:bg-slate-950 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg shadow-xl pointer-events-none border border-slate-700"
          style={{ top: tooltip.y - 44, left: tooltip.x - 70, whiteSpace: "nowrap" }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Scroll container — hidden scrollbar, still scrollable */}
      <div
        className="flex overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {/* Day-of-week labels column */}
        <div className="flex-shrink-0 mr-2" style={{ marginTop: 20 }}>
          {DOW_LABELS.map((label, i) => (
            <div
              key={i}
              style={{ height: i < 6 ? rowHeight : CELL }}
              className="flex items-center"
            >
              <span
                className="text-[10px] font-medium text-slate-400 dark:text-slate-600 leading-none"
                style={{ width: 26 }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Week columns */}
        <div className="flex" style={{ gap: COL_GAP }}>
          {columns.map((col, ci) => (
            <div
              key={ci}
              className="flex-shrink-0"
              style={{
                width: CELL,
                // Extra gap before the start of a new month
                marginLeft: col.monthLabel && ci > 0 ? MONTH_SEP : 0,
              }}
            >

              {/* Month label */}
              <div
                className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-none mb-1"
                style={{ height: 16, whiteSpace: "nowrap" }}
              >
                {col.monthLabel ?? ""}
              </div>

              {/* Day cells */}
              <div className="flex flex-col" style={{ gap: CELL_GAP }}>
                {col.cells.map((cell, ri) => {
                  if (!cell.inWindow) {
                    // Invisible placeholder keeps the column height consistent
                    return (
                      <div
                        key={ri}
                        style={{ width: CELL, height: CELL }}
                      />
                    );
                  }

                  return (
                    <div
                      key={ri}
                      className={[
                        "rounded-[3px] cursor-default transition-transform hover:scale-[1.3] hover:z-10",
                        cell.rating == null
                          ? "bg-slate-100 dark:bg-slate-800"
                          : "",
                        // today gets a subtle ring
                        cell.isToday
                          ? "ring-1 ring-offset-[1px] ring-orange-400 dark:ring-orange-500"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={{
                        width: CELL,
                        height: CELL,
                        ...(cell.rating != null ? ratingColor(cell.rating) : {}),
                      }}
                      onMouseEnter={(e) => {
                        const label =
                          cell.rating == null
                            ? `No entry — ${format(cell.date, "MMM d, yyyy")}`
                            : `Rating ${cell.rating}/10 — ${format(cell.date, "MMM d, yyyy")}`;
                        setTooltip({ text: label, x: e.clientX, y: e.clientY });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        {LEGEND.map(({ rating, label }, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className={`rounded-[3px] ${rating == null ? "bg-slate-100 dark:bg-slate-800" : ""}`}
              style={{
                width: CELL,
                height: CELL,
                ...(rating != null ? ratingColor(rating) : {}),
              }}
            />
            <span className="text-[10px] text-slate-400 dark:text-slate-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
