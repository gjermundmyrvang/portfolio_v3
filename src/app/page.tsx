import { Suspense } from "react";
import ContributionGraph from "../components/contribution-graph";
import PostsSection from "../components/post-section";
import Markdown from "../components/markdown";
import fs from "fs";
import path from "path";

export default function Home() {
  const filePath = path.join(process.cwd(), "public", "markdown", "about.md");
  const aboutMd = fs.readFileSync(filePath, "utf-8");
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-12">
      <Markdown content={aboutMd} />

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
