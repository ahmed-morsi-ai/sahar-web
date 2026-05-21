"use client";

import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MediaFrame } from "@/components/media/media-frame";
import { isPlaceholderSrc, ProgressiveImage } from "@/components/media/progressive-image";
import { getImageBlurDataURL } from "@/lib/media/blur";
import { PRODUCT_IMAGE_PLACEHOLDER } from "@/lib/media/constants";
import {
  resolveImageCandidates,
  resolveMediaCandidates
} from "@/lib/media/resolve";
import { useInViewport } from "@/hooks/use-in-viewport";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import type { MediaRendererProps } from "@/types/media";

function withPositioning(className: string) {
  return cn(!/\b(relative|absolute|fixed|sticky)\b/.test(className) && "relative", "overflow-hidden", className);
}

function CandidateImage({
  candidates,
  alt,
  fallbackLabel,
  imageClassName,
  sizes,
  priority,
  onExhausted
}: {
  candidates: string[];
  alt: string;
  fallbackLabel: string;
  imageClassName: string;
  sizes?: string;
  priority?: boolean;
  onExhausted?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const candidatesKey = candidates.join("|");
  const src = candidates[index] ?? PRODUCT_IMAGE_PLACEHOLDER;

  useEffect(() => {
    setIndex(0);
  }, [candidatesKey]);

  const handleError = useCallback(() => {
    setIndex((current) => {
      const next = current + 1;
      if (next < candidates.length) return next;
      onExhausted?.();
      return current;
    });
  }, [candidates.length, onExhausted]);

  if (isPlaceholderSrc(src)) {
    return (
      <Image
        src={src}
        alt={`${fallbackLabel} placeholder`}
        fill
        sizes={sizes}
        priority={priority}
        className={imageClassName}
      />
    );
  }

  return (
    <ProgressiveImage
      src={src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      className={imageClassName}
      onError={handleError}
    />
  );
}

export const MediaRenderer = memo(function MediaRenderer({
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
  controlsOnMobile = false,
  aspectRatio = "none"
}: MediaRendererProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperClassName = withPositioning(className);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isInView = useInViewport(wrapperRef, "120px", 0.08);

  const candidates = useMemo(() => {
    const resolved = resolveMediaCandidates(src, fallbackSrc);
    if (disableVideoOnMobile && isMobile) {
      const imagesOnly = resolved.filter((candidate) => candidate.kind !== "video");
      return imagesOnly.length ? imagesOnly : resolveMediaCandidates(fallbackSrc ?? PRODUCT_IMAGE_PLACEHOLDER);
    }
    return resolved;
  }, [disableVideoOnMobile, fallbackSrc, isMobile, src]);

  const fallbackImageCandidates = useMemo(
    () => resolveImageCandidates(fallbackSrc, src),
    [fallbackSrc, src]
  );

  const [candidateIndex, setCandidateIndex] = useState(0);
  const [exhausted, setExhausted] = useState(false);
  const candidatesKey = candidates.map((candidate) => `${candidate.kind}:${candidate.src}`).join("|");

  useEffect(() => {
    setCandidateIndex(0);
    setExhausted(false);
  }, [candidatesKey]);

  const advanceCandidate = useCallback(() => {
    setCandidateIndex((current) => {
      const next = current + 1;
      if (next < candidates.length) return next;
      setExhausted(true);
      return current;
    });
  }, [candidates.length]);

  const current = exhausted ? undefined : candidates[candidateIndex];
  const isVideo = current?.kind === "video";
  const videoDisabled = prefersReducedMotion;
  const videoInView = !lazyVideo || isInView;
  const shouldRenderVideo = Boolean(isVideo && !videoDisabled && videoInView && current);
  const shouldPlay =
    shouldRenderVideo && autoPlay && isInView && (!isMobile || allowMobileAutoPlay);
  const showNativeControls = controlsOnMobile && isMobile && shouldRenderVideo;
  const videoPreload = shouldPlay ? preload : "none";
  const poster = fallbackImageCandidates[0] ?? PRODUCT_IMAGE_PLACEHOLDER;
  const posterBlur = getImageBlurDataURL(poster);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldRenderVideo) return;

    if (shouldPlay && !showNativeControls) {
      void video.play().catch(() => undefined);
      return;
    }

    video.pause();
  }, [current?.src, shouldPlay, shouldRenderVideo, showNativeControls]);

  const imageCandidates = useMemo(() => {
    if (!current) return [PRODUCT_IMAGE_PLACEHOLDER];
    if (current.kind === "image") {
      return candidates.slice(candidateIndex).map((item) => item.src);
    }
    return fallbackImageCandidates;
  }, [candidateIndex, candidates, current, fallbackImageCandidates]);

  return (
    <MediaFrame ref={wrapperRef} className={wrapperClassName} aspectRatio={aspectRatio}>
      {shouldRenderVideo && current ? (
        <>
          <Image
            src={poster}
            alt=""
            fill
            aria-hidden
            sizes={sizes}
            className={cn(mediaClassName, "rounded-[inherit]")}
            placeholder={posterBlur ? "blur" : "empty"}
            blurDataURL={posterBlur}
          />
          <video
            ref={videoRef}
            src={current.src}
            className={cn(mediaClassName, "relative z-[1] rounded-[inherit]")}
            autoPlay={shouldPlay}
            muted
            loop={loop}
            playsInline
            controls={showNativeControls}
            preload={videoPreload}
            poster={poster}
            disablePictureInPicture
            disableRemotePlayback
            onError={advanceCandidate}
          />
        </>
      ) : (
        <CandidateImage
          candidates={imageCandidates}
          alt={alt}
          fallbackLabel={fallbackLabel}
          imageClassName={imageClassName}
          sizes={sizes}
          priority={priority}
          onExhausted={() => setExhausted(true)}
        />
      )}
    </MediaFrame>
  );
});
