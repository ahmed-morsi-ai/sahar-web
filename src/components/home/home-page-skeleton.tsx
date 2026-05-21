export function HomePageSkeleton() {
  return (
    <div className="luxury-container animate-pulse space-y-16 py-24">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="h-8 w-48 rounded-full bg-white/10" />
          <div className="h-24 w-full max-w-xl rounded-3xl bg-white/10" />
          <div className="h-16 w-full max-w-2xl rounded-2xl bg-white/8" />
          <div className="flex gap-3">
            <div className="h-12 w-40 rounded-full bg-white/10" />
            <div className="h-12 w-40 rounded-full bg-white/8" />
          </div>
        </div>
        <div className="aspect-[4/5] rounded-[2rem] bg-white/10" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="aspect-[4/5] rounded-[1.35rem] bg-white/8" />
        ))}
      </div>
    </div>
  );
}
