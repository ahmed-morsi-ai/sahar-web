"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  PRODUCT_IMAGE_PLACEHOLDER,
  isRenderableImagePath,
  isVideoPath,
  resolveProductImage
} from "@/lib/media-utils";
import { useInViewport } from "@/lib/use-in-viewport";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/use-media-query";

type MediaRendererProps = {
  src?: string | null;
  fallbackSrc?: string | null;
  alt: string;
  fallbackLabel: string;
  className?: string;
  mediaClassName?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  preload?: "none" | "metadata" | "auto";
  autoPlay?: boolean;
  loop?: boolean;
  lazyVideo?: boolean;
  allowMobileAutoPlay?: boolean;
  disableVideoOnMobile?: boolean;
  controlsOnMobile?: boolean;
};

function ProductMediaFallback({
  label,
  imageClassName,
  sizes
}: {
  label: string;
  imageClassName: string;
  sizes?: string;
}) {
  return (
    <Image
      src={PRODUCT_IMAGE_PLACEHOLDER}
      alt={`${label} placeholder`}
      fill
      sizes={sizes}
      className={imageClassName}
    />
  );
}

export function MediaRenderer({
  src,
  fallbackSrc,
  alt,
  fallbackLabel,
  className = "relative h-full w-full overflow-hidden",
  mediaClassName = "h-full w-full object-cover",
  imageClassName = "object-contain p-8",
  sizes,
  priority = false,
  preload = "metadata",
  autoPlay = true,
  loop = true,
  lazyVideo = true,
  allowMobileAutoPlay = false,
  disableVideoOnMobile = false,
  controlsOnMobile = false
}: MediaRendererProps) {
  const normalizedSrc = src?.trim() ?? "";
  const normalizedFallbackSrc = fallbackSrc?.trim() ?? "";
  const wrapperClassName = `${/\b(relative|absolute|fixed|sticky)\b/.test(className) ? "" : "relative"} overflow-hidden ${className}`;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [activeSrc, setActiveSrc] = useState(normalizedSrc);
  const [failed, setFailed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const prefersReducedMotion = usePrefersReducedMotion();
  const isInView = useInViewport(wrapperRef, "260px", 0.05);

  useEffect(() => {
    setActiveSrc(normalizedSrc);
    setFailed(false);
  }, [normalizedSrc]);

  function handleMediaError() {
    const canUseFallback =
      normalizedFallbackSrc &&
      activeSrc !== normalizedFallbackSrc &&
      isRenderableImagePath(normalizedFallbackSrc);

    if (canUseFallback) {
      setActiveSrc(normalizedFallbackSrc);
      return;
    }

    if (activeSrc !== PRODUCT_IMAGE_PLACEHOLDER) {
      setActiveSrc(PRODUCT_IMAGE_PLACEHOLDER);
      return;
    }

    setFailed(true);
  }

  if (!activeSrc || failed) {
    return (
      <div className={wrapperClassName}>
        <ProductMediaFallback label={fallbackLabel} imageClassName={imageClassName} sizes={sizes} />
      </div>
    );
  }

  if (isVideoPath(activeSrc)) {
    const fallbackImage = resolveProductImage(normalizedFallbackSrc);
    const shouldUseFallbackImage = (disableVideoOnMobile && isMobile) || prefersReducedMotion;
    const shouldRenderVideo = !lazyVideo || isInView;
    const shouldAutoPlay =
      shouldRenderVideo &&
      autoPlay &&
      !prefersReducedMotion &&
      (!isMobile || allowMobileAutoPlay);

    if (shouldUseFallbackImage || !shouldRenderVideo) {
      return (
        <div ref={wrapperRef} className={wrapperClassName}>
          <Image
            src={fallbackImage}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={imageClassName}
            onError={handleMediaError}
          />
        </div>
      );
    }

    return (
      <div ref={wrapperRef} className={wrapperClassName}>
        <video
          src={activeSrc}
          className={`${mediaClassName} rounded-[inherit]`}
          autoPlay={shouldAutoPlay}
          muted
          loop={loop}
          playsInline
          controls={controlsOnMobile && isMobile}
          preload={shouldAutoPlay ? preload : "metadata"}
          onError={handleMediaError}
          onEnded={(event) => {
            if (!loop) return;
            event.currentTarget.currentTime = 0;
            if (shouldAutoPlay) {
              void event.currentTarget.play();
            }
          }}
        />
      </div>
    );
  }

  if (!isRenderableImagePath(activeSrc)) {
    const fallbackImage = resolveProductImage(normalizedFallbackSrc);

    return (
      <div ref={wrapperRef} className={wrapperClassName}>
        <Image
          src={fallbackImage}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={imageClassName}
          onError={handleMediaError}
        />
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={wrapperClassName}>
      <Image
        src={activeSrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={imageClassName}
        onError={handleMediaError}
      />
    </div>
  );
}
