import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { getAdminProductCategories, getAdminProducts, type ProductStatusFilter } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

const statuses: ProductStatusFilter[] = ["ALL", "ACTIVE", "HIDDEN"];

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string; category?: string }>;
}) {
  const params = await searchParams;
  const status = statuses.includes((params.status ?? "ALL") as ProductStatusFilter)
    ? ((params.status ?? "ALL") as ProductStatusFilter)
    : "ALL";
  const category = params.category ?? "ALL";

  let products: Awaited<ReturnType<typeof getAdminProducts>> = [];
  let categories: string[] = [];
  let error = "";

  try {
    [products, categories] = await Promise.all([
      getAdminProducts({ query: params.q, status, category }),
      getAdminProductCategories()
    ]);
  } catch {
    error = "Products could not be loaded. Check the SQLite database and Prisma migration.";
  }

  return (
    <div>
      <AdminHeader
        title="Products"
        copy="Create, edit, hide, and curate the Sahar fragrance collection from the private console."
      />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <form className="grid flex-1 gap-3 rounded-2xl border border-gold/15 bg-white/[0.045] p-4 backdrop-blur-2xl md:grid-cols-[1fr_180px_180px_auto]">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
            <input
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search name, slug, category, notes"
              className="h-11 w-full rounded-full border border-gold/15 bg-night/70 pl-11 pr-4 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold/50 focus:ring-gold/20"
            />
          </label>
          <select
            name="status"
            defaultValue={status}
            className="h-11 rounded-full border border-gold/15 bg-night/70 px-4 text-sm text-ivory focus:border-gold/50 focus:ring-gold/20"
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="HIDDEN">Hidden</option>
          </select>
          <select
            name="category"
            defaultValue={category}
            className="h-11 rounded-full border border-gold/15 bg-night/70 px-4 text-sm text-ivory focus:border-gold/50 focus:ring-gold/20"
          >
            <option value="ALL">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button type="submit" className="h-11 rounded-full bg-gold px-6 text-sm font-semibold text-night">
            Filter
          </button>
        </form>

        <Link
          href="/admin/products/new"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold text-night transition hover:bg-[#f4d8aa]"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-400/25 bg-red-500/10 p-6 text-sm text-red-100 backdrop-blur-2xl">
          {error}
        </div>
      ) : (
        <ProductsTable products={products} />
      )}
    </div>
  );
}
