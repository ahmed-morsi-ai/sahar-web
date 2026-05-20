import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function SectionHeader({
  eyebrow,
  title,
  copy,
  align = "center",
  className
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal className={cn("mx-auto mb-8 max-w-3xl sm:mb-12", align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow ? (
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold/80 sm:text-xs sm:tracking-[0.36em]">{eyebrow}</p>
      ) : null}
      <h2 className="font-serif text-3xl font-semibold leading-tight text-ivory sm:text-5xl sm:leading-none lg:text-6xl">{title}</h2>
      {copy ? <p className="mt-4 text-sm leading-relaxed text-ivory/65 sm:mt-5 sm:text-lg sm:leading-8">{copy}</p> : null}
    </Reveal>
  );
}
