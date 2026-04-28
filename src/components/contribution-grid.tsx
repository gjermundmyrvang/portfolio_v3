"use client";

import { useState } from "react";
import { formatDate } from "../lib/utils";
import { ContributionWeek, GraphLabel } from "../types/graph-types";
import CustomMarquee from "./custom-marquee";

const LEGEND_DATA: Record<GraphLabel, number[]> = {
  contributions: [0, 1, 4, 7, 10],
  coffees: [0, 1, 2, 3, 4],
};

function getColor(count: number, palette: string[], mode: GraphLabel): string {
  if (count === 0) return palette[0];

  if (mode === "coffees") {
    if (count <= 1) return palette[1];
    if (count <= 2) return palette[2];
    if (count <= 3) return palette[3];
    return palette[4];
  }

  // contributions
  if (count <= 3) return palette[1];
  if (count <= 6) return palette[2];
  if (count <= 9) return palette[3];
  return palette[4];
}

type Props = {
  palette: string[];
  marquee?: boolean;
  weeks: ContributionWeek[];
  label: GraphLabel;
};

export default function ContributionGrid({
  palette,
  marquee = false,
  weeks,
  label,
}: Props) {
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const isToday = (date: string): boolean =>
    formatDate(date) === formatDate(today);
  const max = Math.max(
    ...weeks.flatMap((week) =>
      week.contributionDays.map((d) => d.contributionCount),
    ),
  );

  const grid = (
    <div className={`flex gap-0.75 ${!marquee && "overflow-x-auto"}`}>
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-0.75">
          {week.contributionDays.map((day) => (
            <div
              key={day.date}
              className={`h-4 w-4 ${getColor(day.contributionCount, palette, label)} ${isToday(day.date) && "animate-wiggle shadow-lg"} cursor-pointer transition-opacity hover:opacity-75`}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const parent = e.currentTarget
                  .closest(".relative")!
                  .getBoundingClientRect();
                setTooltip({
                  text:
                    day.contributionCount === 0
                      ? `No ${label} ${formatDate(day.date)}`
                      : `${day.contributionCount} ${label} ${formatDate(day.date)}`,
                  x: rect.left - parent.left + rect.width / 2,
                  y: rect.top - parent.top,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative">
      {marquee ? <CustomMarquee>{grid}</CustomMarquee> : <div>{grid}</div>}

      <div className="sm:flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400">
            Less
          </span>
          {LEGEND_DATA[label].map((count) => (
            <div
              key={count}
              className={`h-2.5 w-2.5 ${getColor(count, palette, label)}`}
            />
          ))}
          <span className="text-[10px] uppercase tracking-widest text-neutral-400">
            More
          </span>
        </div>
        <p className="text-[8px] uppercase tracking-widest text-neutral-400">
          Max {max} {label} in one day
        </p>
      </div>
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-neutral-900 px-2 py-1 text-xs text-white shadow-lg border border-neutral-700"
          style={{ left: tooltip.x, top: tooltip.y - 6 }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
