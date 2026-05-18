import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { getAdminProductById, productToFormValues } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const product = await getAdminProductById(id);

  if (!product) notFound();

  return (
    <div>
      <AdminHeader title={`Edit ${product.name}`} copy="Refine product content, stock, media paths, and shop visibility." />
      <ProductForm
        mode="edit"
        productId={product.id}
        initialValues={productToFormValues(product)}
        savedMessage={query.saved === "created" ? "Product created. You can preview it or keep editing." : undefined}
      />
    </div>
  );
}
