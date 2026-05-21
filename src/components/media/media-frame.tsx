import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const aspectClasses = {
  square: "aspect-square",
  video: "aspect-video",
  none: ""
} as const;

export const MediaFrame = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    className?: string;
    aspectRatio?: keyof typeof aspectClasses;
  }
>(function MediaFrame({ children, className, aspectRatio = "none" }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden bg-[#06100d]",
        aspectClasses[aspectRatio],
        className
      )}
    >
      {children}
    </div>
  );
});
