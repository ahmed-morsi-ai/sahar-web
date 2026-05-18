"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Edit3, Eye, Plus, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import type { AdminProduct } from "@/lib/actions/products";
import { formatPrice } from "@/lib/money";
import { ProductImagePreview } from "@/components/admin/products/ProductImagePreview";
import { ProductStatusBadge } from "@/components/admin/products/ProductStatusBadge";

type ProductRow = Omit<AdminProduct, "createdAt" | "updatedAt">;

function productToPayload(product: ProductRow, overrides: Partial<ProductRow> = {}) {
  const next = { ...product, ...overrides };

  return {
    name: next.name,
    slug: next.slug,
    arabicName: next.arabicName ?? "",
    costPrice: next.costPrice,
    price: next.price,
    oldPrice: next.oldPrice ?? "",
    category: next.category.join(", "),
    tags: next.tags.join(", "),
    description: next.description,
    longDescription: next.longDescription,
    notes: next.notes.join(", "),
    topNotes: next.topNotes.join(", "),
    heartNotes: next.heartNotes.join(", "),
    baseNotes: next.baseNotes.join(", "),
    longevity: next.longevity,
    projection: next.projection,
    occasion: next.occasion,
    gender: next.gender,
    image: next.image,
    gallery: next.gallery.join("\n"),
    video: next.video ?? "",
    sizes: next.sizes.map((size) => `${size.label}:${size.priceModifier}`).join("\n"),
    stock: next.stock ?? 0,
    rating: next.rating,
    reviewCount: next.reviewCount,
    isBestSeller: next.isBestSeller,
    isNew: next.isNew,
    isActive: next.isActive ?? true,
    metaTitle: next.metaTitle ?? "",
    metaDescription: next.metaDescription ?? ""
  };
}

function getProfit(product: ProductRow) {
  return product.price - product.costPrice;
}

function getMargin(product: ProductRow) {
  return product.price ? Math.round((getProfit(product) / product.price) * 100) : 0;
}

export function ProductsTable({ products }: { products: ProductRow[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState("");
  const [isPending, startTransition] = useTransition();

  function toggleProduct(product: ProductRow) {
    setBusyId(product.id);
    setMessage("");

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/products/${product.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productToPayload(product, { isActive: !(product.isActive ?? true) }))
        });
        const result = (await response.json().catch(() => null)) as { error?: string } | null;

        if (!response.ok) {
          setMessage(result?.error ?? "Could not update product status.");
          return;
        }

        setMessage(product.isActive ? "Product hidden from the shop." : "Product is active in the shop.");
        router.refresh();
      } catch {
        setMessage("Network error. Check the dev server and try again.");
      } finally {
        setBusyId("");
      }
    });
  }

  function deleteProduct(product: ProductRow) {
    if (!window.confirm(`Delete ${product.name}? Products with order history will be hidden instead.`)) return;

    setBusyId(product.id);
    setMessage("");

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
        const result = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;

        if (!response.ok) {
          setMessage(result?.error ?? "Could not delete product.");
          return;
        }

        setMessage(result?.message ?? "Product updated.");
        router.refresh();
      } catch {
        setMessage("Network error. Check the dev server and try again.");
      } finally {
        setBusyId("");
      }
    });
  }

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-gold/15 bg-white/[0.045] p-10 text-center backdrop-blur-2xl">
        <p className="font-serif text-3xl text-ivory">No products found.</p>
        <p className="mt-3 text-sm text-ivory/55">Add the next Sahar fragrance or adjust the filters.</p>
        <Link
          href="/admin/products/new"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-night"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {message ? (
        <div className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold backdrop-blur-2xl">
          {message}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-gold/15 bg-white/[0.045] backdrop-blur-2xl">
        <div className="hidden overflow-x-auto xl:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gold/10 text-xs uppercase tracking-[0.2em] text-gold/65">
              <tr>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Sale Price</th>
                <th className="px-5 py-4">Cost</th>
                <th className="px-5 py-4">Profit</th>
                <th className="px-5 py-4">Margin</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {products.map((product) => (
                <tr key={product.id} className="text-ivory/72">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <ProductImagePreview src={product.image} alt={product.name} />
                      <div>
                        <p className="font-semibold text-ivory">{product.name}</p>
                        <p className="mt-1 text-xs text-ivory/45">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gold">{formatPrice(product.price)}</td>
                  <td className="px-5 py-4">{formatPrice(product.costPrice)}</td>
                  <td className={getProfit(product) >= 0 ? "px-5 py-4 text-emerald" : "px-5 py-4 text-red-200"}>
                    {formatPrice(getProfit(product))}
                  </td>
                  <td className={getMargin(product) >= 0 ? "px-5 py-4 text-ivory/72" : "px-5 py-4 text-red-200"}>
                    {getMargin(product)}%
                  </td>
                  <td className="px-5 py-4">{product.category.join(", ")}</td>
                  <td className="px-5 py-4">{product.stock ?? 0}</td>
                  <td className="px-5 py-4">
                    <ProductStatusBadge isActive={product.isActive ?? true} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="grid h-10 w-10 place-items-center rounded-full border border-gold/15 text-gold transition hover:border-gold/45"
                        aria-label={`View ${product.name}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="grid h-10 w-10 place-items-center rounded-full border border-gold/15 text-ivory transition hover:border-gold/45 hover:text-gold"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        disabled={isPending && busyId === product.id}
                        onClick={() => toggleProduct(product)}
                        className="grid h-10 w-10 place-items-center rounded-full border border-emerald/20 text-emerald transition hover:border-emerald/45 disabled:opacity-50"
                        aria-label={product.isActive ? `Hide ${product.name}` : `Activate ${product.name}`}
                      >
                        {product.isActive ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                      <button
                        type="button"
                        disabled={isPending && busyId === product.id}
                        onClick={() => deleteProduct(product)}
                        className="grid h-10 w-10 place-items-center rounded-full border border-red-400/20 text-red-200 transition hover:border-red-300/45 disabled:opacity-50"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 p-4 xl:hidden">
          {products.map((product) => (
            <div key={product.id} className="rounded-2xl border border-gold/10 p-4">
              <div className="flex items-start gap-4">
                <ProductImagePreview src={product.image} alt={product.name} className="h-20 w-20" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ivory">{product.name}</p>
                      <p className="mt-1 break-all text-xs text-ivory/45">{product.slug}</p>
                    </div>
                    <ProductStatusBadge isActive={product.isActive ?? true} />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-ivory/58">
                    <span>Sale {formatPrice(product.price)}</span>
                    <span>Cost {formatPrice(product.costPrice)}</span>
                    <span className={getProfit(product) >= 0 ? "text-emerald" : "text-red-200"}>
                      Profit {formatPrice(getProfit(product))}
                    </span>
                    <span>Margin {getMargin(product)}%</span>
                    <span>Stock {product.stock ?? 0}</span>
                    <span>{product.category.join(", ")}</span>
                    <span>{product.isBestSeller ? "Best seller" : product.isNew ? "New" : "Standard"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/admin/products/${product.id}/edit`} className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-night">
                  Edit
                </Link>
                <Link href={`/product/${product.slug}`} target="_blank" className="rounded-full border border-gold/20 px-4 py-2 text-xs text-gold">
                  View
                </Link>
                <button type="button" onClick={() => toggleProduct(product)} className="rounded-full border border-emerald/25 px-4 py-2 text-xs text-emerald">
                  {product.isActive ? "Hide" : "Activate"}
                </button>
                <button type="button" onClick={() => deleteProduct(product)} className="rounded-full border border-red-400/25 px-4 py-2 text-xs text-red-200">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
