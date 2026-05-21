"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/types/product";
import { ProductFilters } from "@/components/shop/product-filters";
import { ProductGrid } from "@/components/shop/product-grid";
import { useAnalytics } from "@/components/analytics/AnalyticsTracker";

const QuickViewModal = dynamic(
  () => import("@/components/shop/quick-view-modal").then((mod) => mod.QuickViewModal),
  { ssr: false }
);

export function ShopClient({ products }: { products: Product[] }) {
  const { track } = useAnalytics();
  const shopViewTrackedRef = useRef(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [quickView, setQuickView] = useState<Product | null>(null);

  const categories = useMemo(() => {
    const values = Array.from(new Set(products.flatMap((product) => product.category))).sort();
    return ["All", ...values];
  }, [products]);

  useEffect(() => {
    if (shopViewTrackedRef.current) return;
    shopViewTrackedRef.current = true;

    track({
      type: "shop_view",
      metadata: { source: "shop_page" }
    });
  }, [track]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesCategory = category === "All" || product.category.includes(category);
      const haystack = [product.name, product.description, ...product.notes, ...product.tags].join(" ").toLowerCase();
      return matchesCategory && (!normalized || haystack.includes(normalized));
    });

    return [...result].sort((a, b) => {
      if (sort === "Price Low to High") return a.price - b.price;
      if (sort === "Price High to Low") return b.price - a.price;
      if (sort === "Newest") return Number(b.isNew) - Number(a.isNew);
      return Number(b.isBestSeller) - Number(a.isBestSeller);
    });
  }, [category, products, query, sort]);

  return (
    <>
      <ProductFilters
        query={query}
        category={category}
        sort={sort}
        categories={categories}
        onQuery={setQuery}
        onCategory={setCategory}
        onSort={setSort}
      />
      <ProductGrid products={filtered} onQuickView={setQuickView} />
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
