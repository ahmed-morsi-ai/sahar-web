import type { LucideIcon } from "lucide-react";
import { formatPrice } from "@/lib/money";

export function AdminStatCard({
  label,
  value,
  icon: Icon,
  currency,
  suffix
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  currency?: boolean;
  suffix?: string;
}) {
  const displayValue = currency ? formatPrice(value) : `${value}${suffix ?? ""}`;

  return (
    <div className="rounded-2xl border border-gold/15 bg-white/[0.045] p-5 shadow-glow backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-ivory/58">{label}</p>
        <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/20 bg-emerald/10 text-gold">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-4 font-serif text-3xl text-ivory">{displayValue}</p>
    </div>
  );
}
