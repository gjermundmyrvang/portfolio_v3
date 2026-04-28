"use client";

import { ContributionWeek, GraphLabel } from "@/src/types/graph-types";
import { PlayCircle, StopCircle } from "lucide-react";
import { useState } from "react";
import ContributionGrid from "./contribution-grid";

interface Props {
  weeks: ContributionWeek[];
  palette: string[];
  total: number;
  title: string;
  totalLabel?: string;
  autoScroll?: boolean;
  since?: Date;
  label?: GraphLabel;
}

export default function ContributionGraphWrapper({
  weeks,
  palette,
  total,
  title,
  totalLabel = "contributions",
  autoScroll = false,
  since,
  label = "contributions",
}: Props) {
  const [marquee, setMarquee] = useState(autoScroll);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xs sm:text-sm uppercase tracking-widest text-neutral-400">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMarquee((m) => !m)}
            className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-neutral-600 transition-colors hover:cursor-pointer"
          >
            <span>{marquee ? <StopCircle /> : <PlayCircle />}</span>
          </button>
          <p className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-600 bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-md w-fit">
            <span className="font-bold">{total}</span> {totalLabel}{" "}
            {since && (
              <span className="text-neutral-400 text-[8px]">
                since{" "}
                {since.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </p>
        </div>
      </div>
      <ContributionGrid
        weeks={weeks}
        palette={palette}
        marquee={marquee}
        label={label}
      />
    </div>
  );
}
