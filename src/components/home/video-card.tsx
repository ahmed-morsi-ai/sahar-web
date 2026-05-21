"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Play } from "lucide-react";
import { useInViewport } from "@/lib/use-in-viewport";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/use-media-query";

const VIDEO_CARD_PLAY_EVENT = "sahar:campaign-video-play";

export function VideoCard({ title, src }: { title: string; src?: string }) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const id = useId();
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isInView = useInViewport(cardRef, "120px", 0.45);
  const showVideo = Boolean(src && !videoFailed && !prefersReducedMotion);
  const shouldRenderVideo = showVideo && isInView;
  const canPlay = shouldRenderVideo && !userPaused;

  useEffect(() => {
    if (!isInView) {
      setUserPaused(false);
    }
  }, [isInView]);

  useEffect(() => {
    if (!isMobile) return;

    const pauseOtherVideo = (event: Event) => {
      const currentId = (event as CustomEvent<string>).detail;
      if (currentId !== id) {
        videoRef.current?.pause();
      }
    };

    window.addEventListener(VIDEO_CARD_PLAY_EVENT, pauseOtherVideo);

    return () => window.removeEventListener(VIDEO_CARD_PLAY_EVENT, pauseOtherVideo);
  }, [id, isMobile]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldRenderVideo) return;

    if (!canPlay) {
      video.pause();
      return;
    }

    if (isMobile) {
      window.dispatchEvent(new CustomEvent(VIDEO_CARD_PLAY_EVENT, { detail: id }));
    }

    void video.play().catch(() => setUserPaused(true));
  }, [canPlay, id, isMobile, shouldRenderVideo]);

  return (
    <div
      ref={cardRef}
      className="group relative h-[320px] overflow-hidden rounded-[1.2rem] border border-gold/15 bg-luxury-radial shadow-xl sm:aspect-[4/5] sm:h-auto sm:rounded-[1.4rem] sm:shadow-2xl"
    >
      {shouldRenderVideo ? (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover opacity-80 sm:opacity-85"
          onError={() => setVideoFailed(true)}
          onPlay={() => {
            if (isMobile) {
              window.dispatchEvent(new CustomEvent(VIDEO_CARD_PLAY_EVENT, { detail: id }));
            }
          }}
          onPause={() => {
            if (isMobile && isInView) setUserPaused(true);
          }}
        />
      ) : (
        <div className="absolute inset-0">
          <div className="absolute inset-x-8 top-12 hidden h-44 rounded-full bg-emerald/15 blur-3xl sm:block" />
          <div className="absolute bottom-16 left-1/2 h-64 w-24 -translate-x-1/2 rounded-t-full border border-gold/25 bg-black/35 shadow-gold" />
          <div className="noise absolute inset-0 opacity-25" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
      <div className="absolute inset-x-5 bottom-5">
        <div className="mb-4 grid h-11 w-11 place-items-center rounded-full border border-gold/30 bg-black/40 text-gold backdrop-blur-xl sm:h-12 sm:w-12">
          <Play className="h-4 w-4 fill-gold" />
        </div>
        <p className="font-serif text-2xl text-ivory sm:text-3xl">{title}</p>
      </div>
    </div>
  );
}
