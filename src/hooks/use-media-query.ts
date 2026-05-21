"use client";

import { useEffect, useState } from "react";
import { useMounted } from "@/hooks/use-mounted";

export function useMediaQuery(query: string, initialValue = false) {
  const [matches, setMatches] = useState(initialValue);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatches = () => setMatches(media.matches);

    updateMatches();
    media.addEventListener("change", updateMatches);
    return () => media.removeEventListener("change", updateMatches);
  }, [query]);

  return matches;
}

export function useIsMobile() {
  const mounted = useMounted();
  const isMobile = useMediaQuery("(max-width: 640px)");
  return mounted ? isMobile : false;
}

export function usePrefersReducedMotion() {
  const mounted = useMounted();
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  return mounted ? prefersReducedMotion : false;
}
