"use client";

import Link from "next/link";
import { m } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/use-media-query";

type LuxuryButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
};

export function LuxuryButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  className,
  disabled
}: LuxuryButtonProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const prefersReducedMotion = usePrefersReducedMotion();
  const interactionMotion = isMobile || prefersReducedMotion ? undefined : { y: -2, scale: 1.015 };
  const classes = cn(
    "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold uppercase tracking-[0.18em] transition focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" &&
      "bg-gold text-night shadow-gold hover:bg-[#f4d8aa] hover:shadow-[0_0_35px_rgba(231,197,141,.35)]",
    variant === "secondary" &&
      "border border-gold/25 bg-white/[0.04] text-ivory backdrop-blur-xl hover:border-gold/55 hover:bg-gold/10",
    variant === "ghost" && "text-gold hover:bg-gold/10",
    className
  );

  const content = (
    <m.span whileHover={interactionMotion} whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }} className={classes}>
      {children}
    </m.span>
  );

  if (href) return <Link href={href} onClick={onClick}>{content}</Link>;

  return (
    <button type={type} onClick={onClick} disabled={disabled} className="contents">
      {content}
    </button>
  );
}
