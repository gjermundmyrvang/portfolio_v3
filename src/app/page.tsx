import { Suspense } from "react";
import ContributionGraph from "../components/contribution-graph";
import PostsSection from "../components/post-section";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Gjermund Persson Myrvang
        </h1>
        <p className="text-sm text-neutral-500">
          Currently a master student at the department of informatics at
          University of Oslo
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-20 animate-pulse rounded-lg bg-neutral-800" />
        }
      >
        <ContributionGraph />
      </Suspense>

      <PostsSection />
    </div>
  );
}
