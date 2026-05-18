import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { emptyProductFormValues } from "@/lib/actions/products";

export default function NewProductPage() {
  return (
    <div>
      <AdminHeader title="New Product" copy="Add a new Sahar fragrance to the admin catalog and public shop." />
      <ProductForm mode="create" initialValues={emptyProductFormValues} />
    </div>
  );
}
