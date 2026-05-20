import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";

export function ProductGrid({ products, onQuickView }: { products: Product[]; onQuickView?: (product: Product) => void }) {
  if (!products.length) {
    return (
      <div className="rounded-[1.25rem] border border-gold/15 bg-white/[0.04] p-6 text-center sm:rounded-[1.5rem] sm:p-12">
        <p className="font-serif text-2xl text-ivory sm:text-3xl">No fragrance matches this ritual.</p>
        <p className="mt-3 text-sm leading-relaxed text-ivory/55 sm:text-base">Adjust your search or explore the full Sahar collection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
      ))}
    </div>
  );
}
