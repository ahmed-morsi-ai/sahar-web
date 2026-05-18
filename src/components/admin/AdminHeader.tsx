export function AdminHeader({ title, copy }: { title: string; copy?: string }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs uppercase tracking-[0.34em] text-gold/70">Sahar Private Console</p>
        <h1 className="mt-3 font-serif text-4xl text-ivory sm:text-5xl">{title}</h1>
        {copy ? <p className="mt-3 max-w-2xl text-sm leading-6 text-ivory/58">{copy}</p> : null}
      </div>
    </div>
  );
}
