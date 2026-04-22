import { getGithubContributions } from "@/src/lib/github";
import ContributionGrid from "./contribution-grid";

export default async function ContributionGraph() {
  const data = await getGithubContributions();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xs sm:text-sm uppercase tracking-widest text-neutral-400">
          GitHub Activity
        </h3>

        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-emerald-600 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md w-fit">
          <span className="font-bold">{data.totalContributions}</span>{" "}
          contributions this year
        </p>
      </div>
      <ContributionGrid weeks={data.weeks} />
    </div>
  );
}
