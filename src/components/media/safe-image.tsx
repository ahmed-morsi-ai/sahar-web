"use client";

import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ProgressiveImage } from "@/components/media/progressive-image";
import { isPlaceholderSrc } from "@/components/media/progressive-image";
import { PRODUCT_IMAGE_PLACEHOLDER } from "@/lib/media/constants";
import { resolveImageCandidates } from "@/lib/media/resolve";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  fallbackCandidates?: string[];
};

export const SafeImage = memo(function SafeImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
  fill = true,
  width,
  height,
  fallbackCandidates
}: Props) {
  const candidates = useMemo(
    () => (fallbackCandidates?.length ? fallbackCandidates : resolveImageCandidates(src)),
    [fallbackCandidates, src]
  );
  const candidatesKey = candidates.join("|");
  const [index, setIndex] = useState(0);
  const activeSrc = candidates[index] ?? PRODUCT_IMAGE_PLACEHOLDER;

  useEffect(() => {
    setIndex(0);
  }, [candidatesKey]);

  const handleError = useCallback(() => {
    setIndex((current) => (current + 1 < candidates.length ? current + 1 : current));
  }, [candidates.length]);

  if (!fill && width && height) {
    return (
      <Image
        src={activeSrc}
        alt={isPlaceholderSrc(activeSrc) ? `${alt} placeholder` : alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={className}
        onError={handleError}
      />
    );
  }

  if (isPlaceholderSrc(activeSrc)) {
    return (
      <Image
        src={activeSrc}
        alt={`${alt} placeholder`}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <div className="absolute inset-0">
      <ProgressiveImage
        src={activeSrc}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={className}
        onError={handleError}
      />
    </div>
  );
});
