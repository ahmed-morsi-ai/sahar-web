"use client";

import { RefObject, useEffect, useState } from "react";

export function useInViewport<T extends Element>(
  ref: RefObject<T | null>,
  rootMargin = "200px",
  threshold = 0.1
) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, rootMargin, threshold]);

  return isInView;
}
