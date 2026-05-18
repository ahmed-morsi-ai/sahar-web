import type { Prisma, Product as PrismaProduct } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  normalizeDbProduct,
  parseJsonList,
  parseSizes,
  parseSizesText,
  sizesToText,
  splitListText,
  stringifyList
} from "@/lib/products";
import { resolveProductGallery, resolveProductImage, resolveProductVideo } from "@/lib/media-utils";
import { productWriteSchema, type ProductWriteInput } from "@/lib/validations/product";

export type ProductStatusFilter = "ALL" | "ACTIVE" | "HIDDEN";

export type AdminProduct = ReturnType<typeof normalizeDbProduct> & {
  costPrice: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductFormValues = {
  name: string;
  slug: string;
  arabicName: string;
  costPrice: number;
  price: number;
  oldPrice: number | "";
  category: string;
  tags: string;
  description: string;
  longDescription: string;
  notes: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  longevity: string;
  projection: string;
  occasion: string;
  gender: string;
  image: string;
  gallery: string;
  video: string;
  sizes: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isBestSeller: boolean;
  isNew: boolean;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
};

export const emptyProductFormValues: ProductFormValues = {
  name: "",
  slug: "",
  arabicName: "",
  costPrice: 0,
  price: 0,
  oldPrice: "",
  category: "",
  tags: "",
  description: "",
  longDescription: "",
  notes: "",
  topNotes: "",
  heartNotes: "",
  baseNotes: "",
  longevity: "14h",
  projection: "Elegant trail",
  occasion: "Evening, occasions, signature presence",
  gender: "Unisex",
  image: "/images/products/new-product.png",
  gallery: "/images/products/new-product.png",
  video: "",
  sizes: "50ml:0\n100ml:500",
  stock: 100,
  rating: 4.8,
  reviewCount: 0,
  isBestSeller: false,
  isNew: true,
  isActive: true,
  metaTitle: "",
  metaDescription: ""
};

function normalizeProductForAdmin(product: PrismaProduct): AdminProduct {
  return {
    ...normalizeDbProduct(product),
    costPrice: product.costPrice,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
}

function revalidateProductCatalog(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  if (slug) revalidatePath(`/product/${slug}`);
}

export function productToFormValues(product: PrismaProduct): ProductFormValues {
  return {
    name: product.name,
    slug: product.slug,
    arabicName: product.arabicName ?? "",
    costPrice: product.costPrice,
    price: product.price,
    oldPrice: product.oldPrice ?? "",
    category: product.category,
    tags: parseJsonList(product.tags).join(", "),
    description: product.description,
    longDescription: product.longDescription,
    notes: parseJsonList(product.notes).join(", "),
    topNotes: parseJsonList(product.topNotes).join(", "),
    heartNotes: parseJsonList(product.heartNotes).join(", "),
    baseNotes: parseJsonList(product.baseNotes).join(", "),
    longevity: product.longevity,
    projection: product.projection,
    occasion: product.occasion,
    gender: product.gender,
    image: product.image,
    gallery: parseJsonList(product.gallery).join("\n"),
    video: product.video ?? "",
    sizes: sizesToText(product.sizes),
    stock: product.stock,
    rating: product.rating,
    reviewCount: product.reviewCount,
    isBestSeller: product.isBestSeller,
    isNew: product.isNew,
    isActive: product.isActive,
    metaTitle: product.metaTitle ?? "",
    metaDescription: product.metaDescription ?? ""
  };
}

function toProductData(input: ProductWriteInput) {
  const parsed = productWriteSchema.parse(input);
  const image = resolveProductImage(parsed.image);
  const gallery = resolveProductGallery(splitListText(parsed.gallery), image);
  const video = resolveProductVideo(parsed.slug, parsed.video) ?? null;
  const sizes = parseSizesText(parsed.sizes);

  return {
    slug: parsed.slug,
    name: parsed.name,
    arabicName: parsed.arabicName ?? null,
    price: parsed.price,
    costPrice: parsed.costPrice,
    oldPrice: parsed.oldPrice ?? null,
    description: parsed.description,
    longDescription: parsed.longDescription,
    category: splitListText(parsed.category).join(", ") || parsed.category.trim(),
    tags: stringifyList(parsed.tags),
    notes: stringifyList(parsed.notes),
    topNotes: stringifyList(parsed.topNotes),
    heartNotes: stringifyList(parsed.heartNotes),
    baseNotes: stringifyList(parsed.baseNotes),
    longevity: parsed.longevity,
    projection: parsed.projection,
    occasion: parsed.occasion,
    gender: parsed.gender,
    sizes: JSON.stringify(sizes),
    image,
    gallery: JSON.stringify(gallery),
    video,
    rating: parsed.rating,
    reviewCount: parsed.reviewCount,
    isBestSeller: parsed.isBestSeller,
    isNew: parsed.isNew,
    stock: parsed.stock,
    isActive: parsed.isActive,
    metaTitle: parsed.metaTitle ?? null,
    metaDescription: parsed.metaDescription ?? null
  } satisfies Prisma.ProductUncheckedCreateInput;
}

export async function getAdminProducts({
  query,
  status = "ALL",
  category
}: {
  query?: string;
  status?: ProductStatusFilter;
  category?: string;
}) {
  const search = query?.trim();
  const categoryFilter = category?.trim();

  const products = await prisma.product.findMany({
    where: {
      ...(status === "ACTIVE" ? { isActive: true } : {}),
      ...(status === "HIDDEN" ? { isActive: false } : {}),
      ...(categoryFilter && categoryFilter !== "ALL" ? { category: { contains: categoryFilter } } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { slug: { contains: search } },
              { category: { contains: search } },
              { description: { contains: search } },
              { longDescription: { contains: search } },
              { tags: { contains: search } },
              { notes: { contains: search } }
            ]
          }
        : {})
    },
    orderBy: [{ isActive: "desc" }, { isBestSeller: "desc" }, { updatedAt: "desc" }]
  });

  return products.map(normalizeProductForAdmin);
}

export async function getAdminProductCategories() {
  const products = await prisma.product.findMany({
    select: { category: true },
    orderBy: { category: "asc" }
  });

  return Array.from(new Set(products.flatMap((product) => splitListText(product.category)))).sort();
}

export async function getAdminProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

async function getUniqueProductSlug(slug: string, currentProductId?: string) {
  const baseSlug = slug.trim();
  let candidate = baseSlug;
  let suffix = 2;

  while (candidate) {
    const existing = await prisma.product.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === currentProductId) return candidate;

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return baseSlug;
}

export async function createProduct(input: ProductWriteInput) {
  const data = toProductData(input);
  data.slug = await getUniqueProductSlug(data.slug);

  const product = await prisma.product.create({
    data
  });

  revalidateProductCatalog(product.slug);
  return normalizeProductForAdmin(product);
}

export async function updateProduct(productId: string, input: ProductWriteInput) {
  const data = toProductData(input);
  const previous = await prisma.product.findUnique({
    where: { id: productId },
    select: { slug: true }
  });
  data.slug = await getUniqueProductSlug(data.slug, productId);

  const product = await prisma.product.update({
    where: { id: productId },
    data
  });

  revalidateProductCatalog(product.slug);
  if (previous?.slug && previous.slug !== product.slug) {
    revalidatePath(`/product/${previous.slug}`);
  }

  return normalizeProductForAdmin(product);
}

export async function deleteOrHideProduct(productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found.");

  const orderItemCount = await prisma.orderItem.count({
    where: {
      OR: [{ productId }, { productSlug: product.slug }]
    }
  });

  if (orderItemCount > 0) {
    const hidden = await prisma.product.update({
      where: { id: productId },
      data: { isActive: false }
    });

    revalidateProductCatalog(hidden.slug);

    return {
      product: normalizeProductForAdmin(hidden),
      mode: "hidden" as const,
      message: "Product has order history, so it was hidden instead of deleted."
    };
  }

  await prisma.product.delete({ where: { id: productId } });
  revalidateProductCatalog(product.slug);

  return {
    product: null,
    mode: "deleted" as const,
    message: "Product deleted."
  };
}

export function productFormValuesFromAdminProduct(product: AdminProduct): ProductFormValues {
  return {
    ...emptyProductFormValues,
    name: product.name,
    slug: product.slug,
    arabicName: product.arabicName ?? "",
    costPrice: product.costPrice,
    price: product.price,
    oldPrice: product.oldPrice ?? "",
    category: product.category.join(", "),
    tags: product.tags.join(", "),
    description: product.description,
    longDescription: product.longDescription,
    notes: product.notes.join(", "),
    topNotes: product.topNotes.join(", "),
    heartNotes: product.heartNotes.join(", "),
    baseNotes: product.baseNotes.join(", "),
    longevity: product.longevity,
    projection: product.projection,
    occasion: product.occasion,
    gender: product.gender,
    image: product.image,
    gallery: product.gallery.join("\n"),
    video: product.video ?? "",
    sizes: sizesToText(product.sizes),
    stock: product.stock ?? 0,
    rating: product.rating,
    reviewCount: product.reviewCount,
    isBestSeller: product.isBestSeller,
    isNew: product.isNew,
    isActive: product.isActive ?? true,
    metaTitle: product.metaTitle ?? "",
    metaDescription: product.metaDescription ?? ""
  };
}

export function normalizeSizesForDisplay(value: string) {
  return parseSizes(value).map((size) => `${size.label} (+${size.priceModifier})`);
}
