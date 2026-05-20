import { cn } from "@/lib/utils";

export function ScentPyramid({
  top,
  heart,
  base,
  className
}: {
  top: string[];
  heart: string[];
  base: string[];
  className?: string;
}) {
  const rows = [
    ["Top Notes", top, "w-full sm:w-7/12"],
    ["Heart Notes", heart, "w-full sm:w-10/12"],
    ["Base Notes", base, "w-full"]
  ] as const;

  return (
    <div className={cn("space-y-4", className)}>
      {rows.map(([label, notes, width]) => (
        <div key={label} className={cn("mx-auto rounded-xl border border-gold/15 bg-white/[0.045] p-4 text-center sm:p-5", width)}>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold/80 sm:text-xs sm:tracking-[0.28em]">{label}</p>
          <p className="font-serif text-xl leading-tight text-ivory sm:text-2xl">{notes.join(" / ")}</p>
        </div>
      ))}
    </div>
  );
}
