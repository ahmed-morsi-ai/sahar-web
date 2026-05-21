"use client";

import { useMemo } from "react";
import { SafeImage } from "@/components/media/safe-image";
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

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-2xl border border-gold/15 bg-luxury-radial ${className}`}>
      <SafeImage
        src={imageSrc}
        alt={alt}
        sizes="96px"
        fallbackCandidates={candidates}
        className="object-contain p-2"
      />
    </div>
  );
}
