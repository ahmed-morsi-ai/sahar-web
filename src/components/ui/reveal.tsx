"use client";

import { m } from "@/lib/motion";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/use-media-query";

export function Reveal({
  children,
  delay = 0,
  className
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldReduce = isMobile || prefersReducedMotion;

  return (
    <m.div
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: shouldReduce ? 12 : 34, filter: shouldReduce ? "blur(0px)" : "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: shouldReduce ? 0.35 : 0.8, delay: shouldReduce ? Math.min(delay, 0.05) : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
