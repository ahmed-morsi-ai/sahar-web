import nextDynamic from "next/dynamic";
import { HomePageSkeleton } from "@/components/home/home-page-skeleton";
import { getStoreProducts } from "@/lib/products";

const HomePageClient = nextDynamic(
  () => import("@/components/home/home-page-client").then((mod) => mod.HomePageClient),
  { loading: () => <HomePageSkeleton /> }
);

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getStoreProducts();

  return <HomePageClient products={products} />;
}
