"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  PRODUCT_IMAGE_PLACEHOLDER,
  isRenderableImagePath,
  isVideoPath,
  resolveProductImage
} from "@/lib/media-utils";

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
  preload = "metadata"
}: MediaRendererProps) {
  const normalizedSrc = src?.trim() ?? "";
  const normalizedFallbackSrc = fallbackSrc?.trim() ?? "";
  const wrapperClassName = `${/\b(relative|absolute|fixed|sticky)\b/.test(className) ? "" : "relative"} overflow-hidden ${className}`;
  const [activeSrc, setActiveSrc] = useState(normalizedSrc);
  const [failed, setFailed] = useState(false);

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
    return (
      <div className={wrapperClassName}>
        <video
          src={activeSrc}
          className={`${mediaClassName} rounded-[inherit]`}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          preload={preload}
          onError={handleMediaError}
          onEnded={(event) => {
            event.currentTarget.currentTime = 0;
            void event.currentTarget.play();
          }}
        />
      </div>
    );
  }

  if (!isRenderableImagePath(activeSrc)) {
    const fallbackImage = resolveProductImage(normalizedFallbackSrc);

    return (
      <div className={wrapperClassName}>
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
    <div className={wrapperClassName}>
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
