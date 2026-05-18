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
    ["Top Notes", top, "w-7/12"],
    ["Heart Notes", heart, "w-10/12"],
    ["Base Notes", base, "w-full"]
  ] as const;

  return (
    <div className={cn("space-y-4", className)}>
      {rows.map(([label, notes, width]) => (
        <div key={label} className={cn("mx-auto rounded-xl border border-gold/15 bg-white/[0.045] p-5 text-center", width)}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold/80">{label}</p>
          <p className="font-serif text-2xl text-ivory">{notes.join(" / ")}</p>
        </div>
      ))}
    </div>
  );
}
