import { ShopClient } from "@/components/shop/shop-client";
import { SectionHeader } from "@/components/ui/section-header";
import { getStoreProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getStoreProducts();

  return (
    <section id="collection" className="min-h-screen pt-24 pb-14 sm:pt-32 sm:pb-24">
      <div className="luxury-container">
        <SectionHeader
          eyebrow="Shop Sahar"
          title="Prestige Collection"
          copy="Search, filter, and choose the fragrance that matches your evening presence."
        />
        <ShopClient products={products} />
      </div>
    </section>
  );
}
