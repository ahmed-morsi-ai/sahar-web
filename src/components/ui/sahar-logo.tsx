"use client";

import Image from "next/image";
import { useState } from "react";
import { brandLogo } from "@/lib/media";
import { cn } from "@/lib/utils";

export function SaharLogo({
  className,
  imageClassName,
  fallbackClassName,
  priority = false,
  sizes = "(max-width: 640px) 128px, 160px"
}: {
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-3xl border border-[#d8b56d]/30 bg-[#06150f]/60 shadow-gold sm:shadow-glow",
        className
      )}
    >
      <span className="pointer-events-none absolute inset-x-4 top-3 h-16 rounded-full bg-emerald/20 blur-2xl" />
      {failed ? (
        <span className="relative grid h-full w-full place-items-center">
          <span
            className={cn(
              "grid aspect-square h-[72%] place-items-center rounded-full border border-gold/30 bg-black/25 font-serif text-3xl text-gold shadow-gold",
              fallbackClassName
            )}
          >
            س
          </span>
        </span>
      ) : (
        <Image
          src={brandLogo}
          alt="Sahar logo"
          width={420}
          height={280}
          className={cn("relative h-full w-full object-contain p-0.5", imageClassName)}
          onError={() => setFailed(true)}
          sizes={sizes}
          priority={priority}
        />
      )}
    </span>
  );
}
