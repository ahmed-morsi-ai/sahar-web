import { HomePageClient } from "@/components/home/home-page-client";
import { getStoreProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getStoreProducts();

  return <HomePageClient products={products} />;
}
