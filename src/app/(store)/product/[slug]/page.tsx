import Link from "next/link";
import { ProductDetailClient } from "@/components/product/product-detail-client";
import { getRelatedStoreProducts, getStoreProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getStoreProductBySlug(slug);

  if (!product) {
    return (
      <section className="min-h-screen pt-24 pb-14 sm:pt-32 sm:pb-24">
        <div className="luxury-container rounded-[1.25rem] border border-gold/15 bg-white/[0.04] p-6 text-center sm:rounded-[1.5rem] sm:p-12">
          <h1 className="font-serif text-4xl text-ivory sm:text-5xl">Fragrance not found</h1>
          <p className="mt-3 text-sm leading-relaxed text-ivory/55 sm:text-base">Return to the collection and choose another Sahar ritual.</p>
          <Link href="/shop" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-night sm:w-auto">
            Shop Collection
          </Link>
        </div>
      </section>
    );
  }

  const related = await getRelatedStoreProducts(product.slug);

  return <ProductDetailClient product={product} related={related} />;
}
