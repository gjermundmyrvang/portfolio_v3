import Link from "next/link";
import React from "react";

type PageComponent = {
  title: string;
  link: string;
};

const PAGES: PageComponent[] = [
  {
    title: "Arduino Resources",
    link: "https://arduino.gjermundmyrvang.com",
  },
  {
    title: "Next Seven (web version)",
    link: "https://thisweek.gjermundmyrvang.com",
  },
  {
    title: "Tangible Project - Disturbia",
    link: "https://disturbia.gjermundmyrvang.com",
  },
  {
    title: "Aiborn Landing Page",
    link: "https://airborn-landingpage.vercel.app/",
  },
  {
    title: "SVG to TSX",
    link: "https://svgtailwind.gjermundmyrvang.com/",
  },
  {
    title: "Themegenerator for Next.js",
    link: "https://themegenerator.gjermundmyrvang.com/",
  },
  {
    title: "Hidden Beasts",
    link: "https://hiddenbeasts.vercel.app/",
  },
];

export default function Webpages() {
  return (
    <div className="scroll-container transform-[scaleY(-1)] w-full flex gap-4 h-125 py-2 px-1 overflow-x-auto overflow-y-visible scroll-smooth snap-x snap-mandatoryr">
      {PAGES.map((p) => (
        <Page key={p.title} {...p} />
      ))}
    </div>
  );
}

function Page({ title, link }: PageComponent) {
  return (
    <div className="snap-center transform-[scaleY(-1)] w-80 sm:w-90 shrink-0 h-full flex flex-col border-3 border-blac dark:border-neutral-700 shadow-[6px_6px_0px_0px_#000] dark:shadow-none">
      <div className="px-2 py-4 border-b-3 border-black bg-neutral-100 dark:border-neutral-700 dark:bg-black">
        <Link href={link}>
          <h3 className="text-center">{title}</h3>
        </Link>
      </div>
      <div className="flex-1 min-h-0">
        <iframe src={link} className="w-full h-full" />
      </div>
    </div>
  );
}
