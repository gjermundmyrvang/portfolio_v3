"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

type Props = {
  children: ReactNode;
  speed?: number; // this is in px per second
  pauseOnHover?: boolean;
  className?: string;
};

export default function CustomMarquee({
  children,
  speed = 30,
  pauseOnHover = true,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let lastTime = performance.now();

    const animate = (time: number) => {
      if (!paused) {
        const delta = time - lastTime;
        lastTime = time;

        offsetRef.current -= (speed * delta) / 1000;

        const half = el.scrollWidth / 2;

        if (Math.abs(offsetRef.current) >= half) {
          offsetRef.current += half;
        }

        el.style.transform = `translateX(${offsetRef.current}px)`;
      } else {
        lastTime = time;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [paused, speed]);

  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div ref={containerRef} className="flex gap-1 will-change-transform">
        {children}
        {children}
      </div>
    </div>
  );
}
