import { getGithubContributions } from "@/src/lib/github";
import ContributionGraphWrapper from "./graph-wrapper";

const githubPalette = [
  "bg-neutral-100 dark:bg-transparent border border-neutral-200 dark:border-neutral-700",
  "bg-emerald-900",
  "bg-emerald-700",
  "bg-emerald-500",
  "bg-emerald-300",
];

export default async function ContributionGraph() {
  const data = await getGithubContributions();
  return (
    <ContributionGraphWrapper
      weeks={data.weeks}
      palette={githubPalette}
      total={data.totalContributions ?? 0}
      title="GitHub Activity"
      totalLabel="contributions this year"
      autoScroll
    />
  );
}
