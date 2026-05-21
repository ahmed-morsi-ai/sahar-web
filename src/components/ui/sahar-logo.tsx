"use client";

import { useMemo } from "react";
import { SafeImage } from "@/components/media/safe-image";
import { BRAND_LOGO_CANDIDATES } from "@/lib/media/resolve";
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
  const logoCandidates = useMemo(() => [...BRAND_LOGO_CANDIDATES], []);

  return (
    <span
      className={cn(
        "relative inline-flex min-h-[3rem] min-w-[4rem] items-center justify-center overflow-hidden rounded-3xl border border-[#d8b56d]/30 bg-[#06150f]/60 shadow-gold sm:min-h-[4rem] sm:min-w-[5rem] sm:shadow-glow",
        className
      )}
    >
      <span className="pointer-events-none absolute inset-x-4 top-3 h-16 rounded-full bg-emerald/20 blur-2xl" />
      <SafeImage
        src={logoCandidates[0]}
        alt="Sahar logo"
        fill
        sizes={sizes}
        priority={priority}
        fallbackCandidates={logoCandidates}
        className={cn("relative h-full w-full", imageClassName)}
      />
    </span>
  );
}
