import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";

export function ProductGrid({ products, onQuickView }: { products: Product[]; onQuickView?: (product: Product) => void }) {
  if (!products.length) {
    return (
      <div className="rounded-[1.5rem] border border-gold/15 bg-white/[0.04] p-12 text-center">
        <p className="font-serif text-3xl text-ivory">No fragrance matches this ritual.</p>
        <p className="mt-3 text-ivory/55">Adjust your search or explore the full Sahar collection.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
      ))}
    </div>
  );
}
