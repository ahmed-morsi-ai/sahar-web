"use client";

import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { getImageBlurDataURL } from "@/lib/media/blur";
import { PRODUCT_IMAGE_PLACEHOLDER } from "@/lib/media/constants";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  onError?: () => void;
  onReady?: () => void;
};

export const ProgressiveImage = memo(function ProgressiveImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
  onError,
  onReady
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const blurDataURL = getImageBlurDataURL(src);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-[#08100d] transition-opacity duration-300",
          loaded ? "opacity-0" : "opacity-100"
        )}
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        className={cn("transition-opacity duration-300", loaded ? "opacity-100" : "opacity-0", className)}
        onLoad={() => {
          setLoaded(true);
          onReady?.();
        }}
        onError={() => {
          onError?.();
        }}
      />
    </>
  );
});

export function isPlaceholderSrc(src: string) {
  return src === PRODUCT_IMAGE_PLACEHOLDER;
}
