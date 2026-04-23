import { Suspense } from "react";
import ContributionGraph from "../components/contribution-graph";
import PostsSection from "../components/post-section";
import Markdown from "../components/markdown";

const HEADER_TEXT = `
# Gjermund Persson Myrvang

> Currently completing a Master's degree in Informatics at the University of Oslo's Department of Informatics

## About Me

Master's student in Informatics at the University of Oslo, with a focus on
human-computer interaction and a soft spot for making technology feel intuitive
and hands-on.

Currently working as a teaching assistant in [IN1060](https://www.uio.no/studier/emner/matnat/ifi/IN1060/), where I help students get to grips with Arduino and physical prototyping. I also spend time at [Sonen Makerspace](https://www.mn.uio.no/ifi/tjenester/publikum/sonen/index.html) --> a creative space where curiosity and making things meet.

This summer, I'm joining [SINTEF](https://www.sintef.no/en/) part-time to work on data visualization of energy systems --> turning complex model outputs into something people can actually understand and use.
`;

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-12">
      <Markdown content={HEADER_TEXT} />

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
