import fs from "fs";
import Image from "next/image";
import path from "path";
import { Suspense } from "react";
import CoffeeGraph from "../components/coffee-graph";
import ContributionGraph from "../components/contribution-graph";
import Markdown from "../components/markdown";
import PostsSection from "../components/post-section";

export default function Home() {
  const filePath = path.join(process.cwd(), "public", "markdown", "about.md");
  const aboutMd = fs.readFileSync(filePath, "utf-8");
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-12">
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div className="flex flex-col gap-2 sm:gap-2">
          <div className="flex flex-row sm:flex-col gap-4 sm:gap-2 items-center sm:items-start">
            <div className="relative group sm:hidden">
              <Image
                src={"/pb.jpeg"}
                width={120}
                height={120}
                alt="Profile Picture"
                className="shadow-2xl"
              />
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-black text-sm px-3 py-2 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Hi! Have a nice day 🤙
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold">
              Gjermund Persson Myrvang
            </h1>
          </div>
          <Markdown content="> Surviving a Master's degree, shipping hobby projects nobody asked for, and somehow enjoying every bit of it." />
        </div>
        <div className="relative group w-full hidden sm:block">
          <Image
            src={"/pb.jpeg"}
            width={200}
            height={200}
            alt="Profile Picture"
            className="shadow-2xl"
          />
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-black text-sm px-3 py-2 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Hi! Have a nice day 🤙
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45" />
          </div>
        </div>
      </div>
      <Markdown content={aboutMd} />

      <Suspense
        fallback={
          <div className="h-20 animate-pulse rounded-lg bg-neutral-800" />
        }
      >
        <CoffeeGraph />
      </Suspense>

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
