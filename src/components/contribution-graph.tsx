import { getGithubContributions } from "@/src/lib/github";
import ContributionGrid from "./contribution-grid";

export default async function ContributionGraph() {
  const data = await getGithubContributions();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-400">
          GitHub Activity
        </h3>
        <p className="text-sm text-neutral-400">
          {data.totalContributions} contributions this year
        </p>
      </div>
      <ContributionGrid weeks={data.weeks} />
    </div>
  );
}
