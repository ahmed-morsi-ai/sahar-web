import { AdminHeader } from "@/components/admin/AdminHeader";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { getOrders } from "@/lib/actions/admin";
import type { OrderStatusValue, PaymentMethodValue } from "@/types/order";

export const dynamic = "force-dynamic";

const statuses = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const paymentMethods = ["ALL", "CASH_ON_DELIVERY", "VODAFONE_CASH", "INSTAPAY"];

export default async function AdminOrdersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string; paymentMethod?: string }>;
}) {
  const params = await searchParams;
  const status = statuses.includes(params.status ?? "") ? params.status : "ALL";
  const paymentMethod = paymentMethods.includes(params.paymentMethod ?? "") ? params.paymentMethod : "ALL";

  let orders: Awaited<ReturnType<typeof getOrders>> = [];
  let error = "";

  try {
    orders = await getOrders({
      query: params.q,
      status: status as OrderStatusValue | "ALL",
      paymentMethod: paymentMethod as PaymentMethodValue | "ALL"
    });
  } catch {
    error = "Orders could not be loaded. Check the local SQLite database and restart the dev server.";
  }

  return (
    <div>
      <AdminHeader title="Orders" copy="Search, filter, and open every Sahar order from one calm table." />

      <form className="mb-6 grid gap-3 rounded-2xl border border-gold/15 bg-white/[0.045] p-4 backdrop-blur-2xl md:grid-cols-[1fr_220px_220px_auto]">
        <input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Search name, phone, order number"
          className="h-11 rounded-full border border-gold/15 bg-night/70 px-4 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold/50 focus:ring-gold/20"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-11 rounded-full border border-gold/15 bg-night/70 px-4 text-sm text-ivory focus:border-gold/50 focus:ring-gold/20"
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item === "ALL" ? "All statuses" : item.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <select
          name="paymentMethod"
          defaultValue={paymentMethod}
          className="h-11 rounded-full border border-gold/15 bg-night/70 px-4 text-sm text-ivory focus:border-gold/50 focus:ring-gold/20"
        >
          {paymentMethods.map((item) => (
            <option key={item} value={item}>
              {item === "ALL" ? "All payments" : item.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <button type="submit" className="h-11 rounded-full bg-gold px-6 text-sm font-semibold text-night">
          Filter
        </button>
      </form>

      {error ? (
        <div className="rounded-2xl border border-red-400/25 bg-red-500/10 p-6 text-sm text-red-100 backdrop-blur-2xl">
          {error}
        </div>
      ) : (
        <OrdersTable orders={orders} />
      )}
    </div>
  );
}
