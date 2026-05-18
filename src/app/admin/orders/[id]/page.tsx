import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OrderActions } from "@/components/admin/OrderActions";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { getOrderById } from "@/lib/actions/admin";
import { resolveProductImage } from "@/lib/media-utils";
import { formatPrice } from "@/lib/money";
import { paymentMethodLabels, type OrderStatusValue, type PaymentMethodValue } from "@/types/order";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let order: Awaited<ReturnType<typeof getOrderById>>;

  try {
    order = await getOrderById(id);
  } catch {
    return (
      <div>
        <Link href="/admin/orders" className="mb-6 inline-flex items-center gap-2 text-sm text-gold">
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
        <AdminHeader title="Order unavailable" copy="The order details could not be loaded right now." />
        <div className="rounded-2xl border border-red-400/25 bg-red-500/10 p-6 text-sm text-red-100 backdrop-blur-2xl">
          Check the local SQLite database and try again.
        </div>
      </div>
    );
  }

  if (!order) notFound();
  const orderNetProfit = order.items.reduce((sum, item) => sum + item.profit, 0);

  return (
    <div>
      <Link href="/admin/orders" className="mb-6 inline-flex items-center gap-2 text-sm text-gold">
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>

      <AdminHeader title={order.orderNumber} copy="Customer details, order items, fulfillment status, and WhatsApp tools." />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-gold/15 bg-white/[0.045] p-5 backdrop-blur-2xl">
            <h2 className="font-serif text-3xl text-ivory">Customer Details</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <Detail label="Name" value={order.customerName} />
              <Detail label="Phone" value={order.customerPhone} />
              <Detail label="Email" value={order.customerEmail || "Not provided"} />
              <Detail label="City" value={order.city} />
              <Detail label="Address" value={order.address} wide />
              <Detail label="Notes" value={order.notes || "No notes"} wide />
            </dl>
          </div>

          <div className="rounded-2xl border border-gold/15 bg-white/[0.045] p-5 backdrop-blur-2xl">
            <h2 className="font-serif text-3xl text-ivory">Order Items</h2>
            <div className="mt-5 divide-y divide-gold/10">
              {order.items.map((item) => (
                <div key={item.id} className="grid gap-4 py-4 sm:grid-cols-[72px_1fr_auto] sm:items-center">
                  <div className="relative h-[72px] w-[72px] overflow-hidden rounded-2xl border border-gold/10 bg-white/[0.04]">
                    <Image src={resolveProductImage(item.productImage)} alt="" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-ivory">{item.productName}</p>
                    <p className="mt-1 text-sm text-ivory/50">
                      {item.size} x {item.quantity} at {formatPrice(item.unitPrice || item.price)}
                    </p>
                    <div className="mt-3 grid gap-2 text-xs text-ivory/50 sm:grid-cols-3">
                      <span>Sale: {formatPrice(item.unitPrice || item.price)}</span>
                      <span>Cost: {formatPrice(item.unitCost)}</span>
                      <span className="text-emerald">Profit: {formatPrice(item.profit)}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-serif text-2xl text-gold">{formatPrice(item.total)}</p>
                    <p className="mt-1 text-xs text-emerald">{formatPrice(item.profit)} profit</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-gold/15 bg-white/[0.045] p-5 backdrop-blur-2xl">
            <h2 className="font-serif text-3xl text-ivory">Order Details</h2>
            <div className="mt-5 space-y-3 text-sm text-ivory/62">
              <Row label="Date" value={order.createdAt.toLocaleString("en-GB")} />
              <Row label="Payment" value={paymentMethodLabels[order.paymentMethod as PaymentMethodValue]} />
              <div className="flex items-center justify-between gap-4">
                <span>Status</span>
                <OrderStatusBadge status={order.status as OrderStatusValue} />
              </div>
              <Row label="Subtotal" value={formatPrice(order.subtotal)} />
              <Row label="Shipping" value={formatPrice(order.shipping)} />
              <Row label="Total" value={formatPrice(order.total)} strong />
              <Row label="Net Profit" value={formatPrice(orderNetProfit)} positive />
            </div>
          </div>

          <div className="rounded-2xl border border-gold/15 bg-white/[0.045] p-5 backdrop-blur-2xl">
            <h2 className="mb-4 font-serif text-3xl text-ivory">Admin Actions</h2>
            <OrderStatusSelect orderId={order.id} status={order.status as OrderStatusValue} />
            <div className="mt-5">
              <OrderActions
                orderId={order.id}
                customerPhone={order.customerPhone}
                whatsappMessage={order.whatsappMessage || ""}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Detail({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-xs uppercase tracking-[0.22em] text-gold/60">{label}</dt>
      <dd className="mt-2 text-ivory/75">{value}</dd>
    </div>
  );
}

function Row({ label, value, strong, positive }: { label: string; value: string; strong?: boolean; positive?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span className={strong ? "font-serif text-2xl text-gold" : positive ? "font-semibold text-emerald" : "text-ivory"}>
        {value}
      </span>
    </div>
  );
}
