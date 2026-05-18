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
    <Reveal className={cn("mx-auto mb-12 max-w-3xl", align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.36em] text-gold/80">{eyebrow}</p>
      ) : null}
      <h2 className="font-serif text-4xl font-semibold leading-none text-ivory sm:text-5xl lg:text-6xl">{title}</h2>
      {copy ? <p className="mt-5 text-base leading-8 text-ivory/65 sm:text-lg">{copy}</p> : null}
    </Reveal>
  );
}
