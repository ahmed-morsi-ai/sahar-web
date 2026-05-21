"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { resolveImageCandidates, resolveProductImage } from "@/lib/media-utils";

export function ProductImagePreview({
  src,
  alt,
  className = "h-16 w-16"
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const imageSrc = resolveProductImage(src);
  const candidates = useMemo(() => resolveImageCandidates(imageSrc), [imageSrc]);
  const candidatesKey = candidates.join("|");
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSrc = candidates[activeIndex] ?? imageSrc;

  useEffect(() => {
    setActiveIndex(0);
  }, [candidatesKey]);

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-2xl border border-gold/15 bg-luxury-radial ${className}`}>
      <Image
        src={activeSrc}
        alt={alt}
        fill
        sizes="96px"
        className="object-contain p-2"
        onError={() => {
          setActiveIndex((current) => (current + 1 < candidates.length ? current + 1 : current));
        }}
      />
    </div>
  );
}
