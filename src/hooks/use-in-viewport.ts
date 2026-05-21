"use client";

import { RefObject, useLayoutEffect, useState } from "react";

export function useInViewport<T extends Element>(
  ref: RefObject<T | null>,
  rootMargin = "200px",
  threshold = 0.1
) {
  const [isInView, setIsInView] = useState(false);

  useLayoutEffect(() => {
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let cancelled = false;

    const observe = () => {
      observer?.disconnect();
      const element = ref.current;
      if (!element) {
        setIsInView(false);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting);
        },
        { rootMargin, threshold }
      );
      observer.observe(element);
    };

    observe();

    if (!ref.current) {
      frame = requestAnimationFrame(() => {
        if (!cancelled) observe();
      });
    }

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      setIsInView(false);
    };
  }, [ref, rootMargin, threshold]);

  return isInView;
}
