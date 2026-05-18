import { orderStatusLabels, type OrderStatusValue } from "@/types/order";

const statusClasses: Record<OrderStatusValue, string> = {
  PENDING: "border-gold/35 bg-gold/10 text-gold",
  CONFIRMED: "border-emerald/35 bg-emerald/10 text-emerald",
  PROCESSING: "border-blue-400/35 bg-blue-500/10 text-blue-200",
  SHIPPED: "border-purple-400/35 bg-purple-500/10 text-purple-200",
  DELIVERED: "border-green-400/35 bg-green-500/10 text-green-200",
  CANCELLED: "border-red-400/35 bg-red-500/10 text-red-200"
};

export function OrderStatusBadge({ status }: { status: OrderStatusValue }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses[status]}`}>
      {orderStatusLabels[status]}
    </span>
  );
}
