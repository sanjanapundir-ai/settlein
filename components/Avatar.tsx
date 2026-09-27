"use client";

import { useEffect, useRef, useState } from "react";
import { PersonMeta } from "@/lib/types";
import { COLOR_STYLES } from "@/lib/constants";

export default function Avatar({ person, size = 40, className = "" }: { person: PersonMeta; size?: number; className?: string }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  // an image can fail before React hydrates, so onError never fires — check once on mount
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  const c = COLOR_STYLES[person.color];
  const style = { width: size, height: size };
  if (failed) {
    return (
      <div style={style} className={`flex shrink-0 items-center justify-center rounded-full font-heading font-bold ring-4 ring-white ${c.chip} ${className}`}>
        {person.name[0]}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={person.avatarUrl}
      alt={person.name}
      width={size}
      height={size}
      style={style}
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-full ring-4 ring-white ${c.bg} ${className}`}
    />
  );
}
