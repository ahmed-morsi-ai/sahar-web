"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export function VideoCard({ title, src }: { title: string; src?: string }) {
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = Boolean(src && !videoFailed);

  return (
    <div className="group relative aspect-[4/5] overflow-hidden rounded-[1.4rem] border border-gold/15 bg-luxury-radial shadow-2xl">
      {showVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover opacity-85"
          onError={() => setVideoFailed(true)}
        >
          <source src={src} type="video/mp4" onError={() => setVideoFailed(true)} />
        </video>
      ) : (
        <div className="absolute inset-0">
          <div className="absolute inset-x-8 top-12 h-44 rounded-full bg-emerald/15 blur-3xl" />
          <div className="absolute bottom-16 left-1/2 h-64 w-24 -translate-x-1/2 rounded-t-full border border-gold/25 bg-black/35 shadow-gold" />
          <div className="noise absolute inset-0 opacity-25" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
      <div className="absolute inset-x-5 bottom-5">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-full border border-gold/30 bg-black/40 text-gold backdrop-blur-xl">
          <Play className="h-4 w-4 fill-gold" />
        </div>
        <p className="font-serif text-3xl text-ivory">{title}</p>
      </div>
    </div>
  );
}
