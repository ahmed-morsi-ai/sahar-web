"use client";

import { Search } from "lucide-react";

const fallbackCategories = ["All", "Best Sellers", "Oud", "Floral", "Amber", "Fresh", "Night"];

export function ProductFilters({
  query,
  category,
  sort,
  categories = fallbackCategories,
  onQuery,
  onCategory,
  onSort
}: {
  query: string;
  category: string;
  sort: string;
  categories?: string[];
  onQuery: (value: string) => void;
  onCategory: (value: string) => void;
  onSort: (value: string) => void;
}) {
  return (
    <div className="mb-10 rounded-[1.5rem] border border-gold/15 bg-white/[0.04] p-4 backdrop-blur-2xl">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search by scent, note, or mood"
            className="h-12 w-full rounded-full border border-gold/15 bg-night/60 pl-11 pr-4 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold/50 focus:ring-gold/20"
          />
        </label>
        <label>
          <span className="sr-only">Sort products</span>
          <select
            value={sort}
            onChange={(event) => onSort(event.target.value)}
            className="h-12 rounded-full border border-gold/15 bg-night/80 px-5 text-sm text-ivory focus:border-gold/50 focus:ring-gold/20"
          >
            <option>Featured</option>
            <option>Price Low to High</option>
            <option>Price High to Low</option>
            <option>Newest</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onCategory(item)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
              category === item
                ? "border-gold bg-gold text-night"
                : "border-gold/15 text-ivory/60 hover:border-gold/45 hover:text-gold"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
