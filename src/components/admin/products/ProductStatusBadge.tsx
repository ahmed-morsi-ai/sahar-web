export function ProductStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        isActive
          ? "border-emerald/35 bg-emerald/10 text-emerald"
          : "border-red-400/35 bg-red-500/10 text-red-200"
      }`}
    >
      {isActive ? "Active" : "Hidden"}
    </span>
  );
}
