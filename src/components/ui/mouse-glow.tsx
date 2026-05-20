"use client";

import { useEffect, useState } from "react";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/use-media-query";

export function MouseGlow() {
  const [pos, setPos] = useState({ x: -300, y: -300 });
  const canUsePointerGlow = useMediaQuery("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!canUsePointerGlow || prefersReducedMotion) return;

    const onMove = (event: MouseEvent) => setPos({ x: event.clientX, y: event.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [canUsePointerGlow, prefersReducedMotion]);

  if (!canUsePointerGlow || prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-0 hidden h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald/10 blur-3xl lg:block"
      style={{ left: pos.x, top: pos.y }}
    />
  );
}
