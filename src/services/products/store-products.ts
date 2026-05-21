import type { Product as PrismaProduct } from "@prisma/client";
import { products as fallbackProducts } from "@/data/products";
import { normalizeDbProduct } from "@/services/products/product-normalizer";
import { prisma } from "@/services/db/prisma";
import { safePrismaRead, safePrismaReadNullable } from "@/services/db/safe-query";
import type { Product } from "@/types/product";

export {
  normalizeDbProduct,
  parseJsonList,
  parseSizes,
  parseSizesText,
  sizesToText,
  splitListText,
  stringifyList
} from "@/services/products/product-normalizer";

async function hasDatabaseProducts() {
  const count = await safePrismaRead(() => prisma.product.count(), 0);
  return count > 0;
}

export async function getStoreProducts(): Promise<Product[]> {
  if (!(await hasDatabaseProducts())) return fallbackProducts;

  const products = await safePrismaRead(
    () =>
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: [{ isBestSeller: "desc" }, { isNew: "desc" }, { createdAt: "desc" }]
      }),
    [] as PrismaProduct[]
  );

  if (!products.length) return fallbackProducts;

  return products.map(normalizeDbProduct);
}

export async function getStoreProductBySlug(slug: string): Promise<Product | null> {
  if (!(await hasDatabaseProducts())) {
    return fallbackProducts.find((product) => product.slug === slug) ?? null;
  }

  const product = await safePrismaReadNullable(() =>
    prisma.product.findFirst({
      where: { slug, isActive: true }
    })
  );

  return product ? normalizeDbProduct(product) : null;
}

export async function getRelatedStoreProducts(slug: string, limit?: number) {
  const products = await getStoreProducts();
  const related = products.filter((product) => product.slug !== slug);
  return typeof limit === "number" ? related.slice(0, limit) : related;
}

export async function getOrderableProduct(productSlug: string, productId: string) {
  if (!(await hasDatabaseProducts())) {
    const fallback = fallbackProducts.find((product) => product.slug === productSlug || product.id === productId);
    return fallback ? { ...fallback, costPrice: 0 } : null;
  }

  const product = await safePrismaReadNullable(() =>
    prisma.product.findFirst({
      where: {
        isActive: true,
        OR: [{ slug: productSlug }, { id: productId }]
      }
    })
  );

  return product ? { ...normalizeDbProduct(product), costPrice: product.costPrice } : null;
}
