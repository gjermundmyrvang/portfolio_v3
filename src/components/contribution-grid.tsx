"use client";

import { useState } from "react";

interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface Props {
  weeks: ContributionWeek[];
}

function getColor(count: number): string {
  if (count === 0) return "bg-transparent border border-neutral-400";
  if (count <= 3) return "bg-emerald-900";
  if (count <= 6) return "bg-emerald-700";
  if (count <= 9) return "bg-emerald-500";
  return "bg-emerald-400";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ContributionGrid({ weeks }: Props) {
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div className="relative">
      <div className="flex gap-0.75">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-0.75">
            {week.contributionDays.map((day) => (
              <div
                key={day.date}
                className={`h-2.5 w-2.5 rounded-sm ${getColor(day.contributionCount)} cursor-pointer transition-opacity hover:opacity-75`}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const parent = e.currentTarget
                    .closest(".relative")!
                    .getBoundingClientRect();
                  setTooltip({
                    text:
                      day.contributionCount === 0
                        ? `Ingen bidrag – ${formatDate(day.date)}`
                        : `${day.contributionCount} bidrag – ${formatDate(day.date)}`,
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
