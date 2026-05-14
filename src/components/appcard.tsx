"use client";
import React, { useEffect, useRef, useState } from "react";
import { AppInfo } from "../types/app-types";
import Image from "next/image";
import { getColor } from "colorthief";

interface Props {
  app: AppInfo;
}

export default function AppCard({ app }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [tint, setTint] = useState<string | null>(null);
  const [textColor, setTextColor] = useState("#ffffff");
  const [tooltip, setTooltip] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    async function loadColor() {
      const color = await getColor(el!);
      if (color) {
        setTint(color.hex());
        setTextColor(color.textColor);
      }
    }
    if (el.complete) {
      loadColor();
    } else {
      el.addEventListener("load", loadColor);
      return () => el.removeEventListener("load", loadColor);
    }
  }, []);

  return (
    <div
      className="relative shrink-0"
      onMouseLeave={() => setTooltip(false)}
      onMouseEnter={() => setTooltip(true)}
    >
      <div className="relative w-32 h-32">
        <Image
          ref={imgRef}
          src={app.icon}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 200px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          alt={app.name}
          crossOrigin="anonymous"
          onTouchStart={() => setTooltip((v) => !v)}
        />
        {app.isNew && (
          <div className="absolute -top-2 right-0 bg-green-200 border border-green-400 px-2 py-1 rounded-full">
            <p className="relaxed text-sm">New</p>
          </div>
        )}
      </div>
      {tooltip && (
        <div
          className="absolute -top-5 left-1/2 -translate-x-1/2 w-80 rounded-2xl p-4 z-50 shadow-lg transition-all"
          style={{ backgroundColor: tint ?? undefined, color: textColor }}
        >
          <p className="text-md font-medium mb-1">{app.name}</p>
          <p className="text-xs leading-relaxed mb-2.5">{app.description}</p>
          <div className="flex justify-between items-center">
            <a href={app.appstoreLink} rel="noopener noreferrer">
              App Store ↗
            </a>
            {app.apkLink && (
              <a href={app.apkLink} rel="noopener noreferrer">
                APK ↗
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
