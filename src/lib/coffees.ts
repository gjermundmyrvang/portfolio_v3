import { supabase } from "../supabase/client";
import {
  ContributionData,
  ContributionDay,
  ContributionWeek,
} from "../types/graph-types";

export const revalidate = 3600; // revalidate every hour
export async function getCoffees(): Promise<ContributionData> {
  const { data, error } = await supabase
    .from("coffee_logs")
    .select("logged_at")
    .order("logged_at", { ascending: true });

  if (error) throw error;

  // Count per day
  const countsByDate: Record<string, number> = {};
  for (const row of data) {
    const date = row.logged_at.slice(0, 10);
    countsByDate[date] = (countsByDate[date] ?? 0) + 1;
  }

  // first log to today
  const dates = Object.keys(countsByDate);
  const start = dates.length > 0 ? new Date(dates[0]) : new Date();
  const end = new Date();

  // Rewind start to the nearest Sunday
  start.setDate(start.getDate() - start.getDay());

  const weeks: ContributionWeek[] = [];
  const current = new Date(start);

  while (current <= end) {
    const days: ContributionDay[] = [];
    for (let i = 0; i < 7; i++) {
      const dateStr = current.toISOString().slice(0, 10);
      days.push({
        date: dateStr,
        contributionCount: countsByDate[dateStr] ?? 0,
      });
      current.setDate(current.getDate() + 1);
    }
    weeks.push({ contributionDays: days });
  }

  const totalContributions = Object.values(countsByDate).reduce(
    (a, b) => a + b,
    0,
  );

  return { totalContributions, weeks, since: start };
}
