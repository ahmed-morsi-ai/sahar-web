import type { Product as PrismaProduct } from "@prisma/client";
import { products as fallbackProducts } from "@/data/products";
import { prisma } from "@/lib/prisma";
import { resolveProductGallery, resolveProductImage, resolveProductVideo } from "@/lib/media-utils";
import type { Product, ProductSize } from "@/types/product";

const defaultSizes: ProductSize[] = [
  { label: "50ml", priceModifier: 0 },
  { label: "100ml", priceModifier: 500 }
];

export function splitListText(value?: string | null) {
  return (value ?? "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function stringifyList(value: string[] | string | null | undefined) {
  const list = Array.isArray(value) ? value : splitListText(value);
  return JSON.stringify(list);
}

export function parseJsonList(value?: string | null) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch {
    return splitListText(value);
  }

  return [];
}

export function parseSizes(value?: string | null): ProductSize[] {
  if (!value) return defaultSizes;

  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      const sizes = parsed
        .map((entry) => {
          if (!entry || typeof entry !== "object") return null;
          const record = entry as { label?: unknown; priceModifier?: unknown };
          const label = String(record.label ?? "").trim();
          const priceModifier = Number(record.priceModifier ?? 0);

          if (!label || !Number.isFinite(priceModifier)) return null;
          return { label, priceModifier: Math.max(0, Math.round(priceModifier)) };
        })
        .filter((entry): entry is ProductSize => Boolean(entry));

      if (sizes.length) return sizes;
    }
  } catch {
    return parseSizesText(value);
  }

  return defaultSizes;
}

export function parseSizesText(value?: string | null): ProductSize[] {
  const sizes = (value ?? "")
    .split(/[\n,]/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [rawLabel, rawModifier] = line.split(":");
      const label = rawLabel?.trim();
      const priceModifier = Number(rawModifier?.trim() ?? 0);

      if (!label || !Number.isFinite(priceModifier)) return null;
      return { label, priceModifier: Math.max(0, Math.round(priceModifier)) };
    })
    .filter((entry): entry is ProductSize => Boolean(entry));

  return sizes.length ? sizes : defaultSizes;
}

export function sizesToText(value?: string | ProductSize[] | null) {
  const sizes = Array.isArray(value) ? value : parseSizes(value);
  return sizes.map((size) => `${size.label}:${size.priceModifier}`).join("\n");
}

export function normalizeDbProduct(product: PrismaProduct): Product {
  const profit = product.price - product.costPrice;
  const margin = product.price > 0 ? (profit / product.price) * 100 : 0;
  const image = resolveProductImage(product.image);
  const gallery = resolveProductGallery(parseJsonList(product.gallery), image);
  const video = resolveProductVideo(product.slug, product.video);

  if (process.env.NODE_ENV !== "production") {
    console.debug("[product-media:db]", {
      slug: product.slug,
      image,
      rawImage: product.image,
      video,
      rawVideo: product.video
    });
  }

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    arabicName: product.arabicName ?? undefined,
    price: product.price,
    oldPrice: product.oldPrice ?? undefined,
    costPrice: product.costPrice,
    profit,
    margin,
    category: splitListText(product.category),
    tags: parseJsonList(product.tags),
    description: product.description,
    longDescription: product.longDescription,
    notes: parseJsonList(product.notes),
    topNotes: parseJsonList(product.topNotes),
    heartNotes: parseJsonList(product.heartNotes),
    baseNotes: parseJsonList(product.baseNotes),
    longevity: product.longevity,
    projection: product.projection,
    occasion: product.occasion,
    gender: product.gender,
    sizes: parseSizes(product.sizes),
    image,
    imageUrl: image,
    gallery,
    video,
    videoUrl: video,
    metaTitle: product.metaTitle ?? undefined,
    metaDescription: product.metaDescription ?? undefined,
    rating: product.rating,
    reviewCount: product.reviewCount,
    isBestSeller: product.isBestSeller,
    isNew: product.isNew,
    stock: product.stock,
    isActive: product.isActive
  };
}

async function hasDatabaseProducts() {
  return (await prisma.product.count()) > 0;
}

export async function getStoreProducts() {
  if (!(await hasDatabaseProducts())) return fallbackProducts;

  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ isBestSeller: "desc" }, { isNew: "desc" }, { createdAt: "desc" }]
  });

  return products.map(normalizeDbProduct);
}

export async function getStoreProductBySlug(slug: string) {
  if (!(await hasDatabaseProducts())) {
    return fallbackProducts.find((product) => product.slug === slug) ?? null;
  }

  const product = await prisma.product.findFirst({
    where: { slug, isActive: true }
  });

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

  const product = await prisma.product.findFirst({
    where: {
      isActive: true,
      OR: [{ slug: productSlug }, { id: productId }]
    }
  });

  return product ? { ...normalizeDbProduct(product), costPrice: product.costPrice } : null;
}
