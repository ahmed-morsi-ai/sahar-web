"use client";

import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";
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
  const [displaySrc, setDisplaySrc] = useState(src);
  const [pendingSrc, setPendingSrc] = useState<string | null>(null);
  const [pendingVisible, setPendingVisible] = useState(false);
  const loadedRef = useRef<Set<string>>(new Set());
  const blurDataURL = getImageBlurDataURL(src);

  useEffect(() => {
    if (src === displaySrc) return;

    if (loadedRef.current.has(src)) {
      setDisplaySrc(src);
      setPendingSrc(null);
      setPendingVisible(false);
      return;
    }

    setPendingSrc(src);
    setPendingVisible(false);
  }, [displaySrc, src]);

  const showPending = pendingSrc && pendingSrc !== displaySrc;

  return (
    <div className="absolute inset-0">
      {displaySrc ? (
        <Image
          src={displaySrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={className}
          aria-hidden={showPending ? true : undefined}
        />
      ) : null}

      {showPending ? (
        <>
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 bg-[#08100d] transition-opacity duration-300",
              pendingVisible ? "opacity-0" : "opacity-100"
            )}
          />
          <Image
            key={pendingSrc}
            src={pendingSrc}
            alt={alt}
            fill
            sizes={sizes}
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
            className={cn(
              "transition-opacity duration-300",
              pendingVisible ? "opacity-100" : "opacity-0",
              className
            )}
            onLoad={() => {
              loadedRef.current.add(pendingSrc);
              setPendingVisible(true);
              setDisplaySrc(pendingSrc);
              setPendingSrc(null);
              onReady?.();
            }}
            onError={() => {
              setPendingSrc(null);
              setPendingVisible(false);
              onError?.();
            }}
          />
        </>
      ) : null}

      {!displaySrc && !showPending ? (
        <div className="absolute inset-0 bg-[#08100d]" aria-hidden />
      ) : null}
    </div>
  );
});

export function isPlaceholderSrc(src: string) {
  return src === PRODUCT_IMAGE_PLACEHOLDER;
}
