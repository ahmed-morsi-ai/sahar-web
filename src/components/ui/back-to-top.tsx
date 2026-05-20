"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-media-query";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const frameRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        setVisible(window.scrollY > 800);
        frameRef.current = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" })}
      className="fixed bottom-20 right-4 z-40 grid h-11 w-11 place-items-center rounded-full border border-gold/25 bg-night/75 text-gold shadow-gold backdrop-blur-xl transition hover:border-gold/60 sm:bottom-6 sm:right-5"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
