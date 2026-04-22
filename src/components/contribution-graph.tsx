import { getGithubContributions } from "@/src/lib/github";
import ContributionGrid from "./contribution-grid";

export default async function ContributionGraph() {
  const data = await getGithubContributions();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-widest text-neutral-400">
          GitHub Activity
        </h3>
        <p className="text-[10px] uppercase tracking-widest text-neutral-100 bg-neutral-800 px-2 py-0.5 w-fit">
          {data.totalContributions} contributions this year
        </p>
      </div>
      <ContributionGrid weeks={data.weeks} />
    </div>
  );
}
