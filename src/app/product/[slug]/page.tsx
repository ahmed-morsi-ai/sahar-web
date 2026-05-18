import Link from "next/link";
import { ProductDetailClient } from "@/components/product/product-detail-client";
import { getRelatedStoreProducts, getStoreProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getStoreProductBySlug(slug);

  if (!product) {
    return (
      <section className="min-h-screen pt-32 pb-24">
        <div className="luxury-container rounded-[1.5rem] border border-gold/15 bg-white/[0.04] p-12 text-center">
          <h1 className="font-serif text-5xl text-ivory">Fragrance not found</h1>
          <p className="mt-3 text-ivory/55">Return to the collection and choose another Sahar ritual.</p>
          <Link href="/shop" className="mt-8 inline-flex rounded-full bg-gold px-7 py-4 font-semibold uppercase tracking-[0.16em] text-night">
            Shop Collection
          </Link>
        </div>
      </section>
    );
  }

  const related = await getRelatedStoreProducts(product.slug);

  return <ProductDetailClient product={product} related={related} />;
}
