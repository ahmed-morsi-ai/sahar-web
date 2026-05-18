export type PaymentMethodValue = "CASH_ON_DELIVERY" | "VODAFONE_CASH" | "INSTAPAY";

export type OrderStatusValue =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export const paymentMethodLabels: Record<PaymentMethodValue, string> = {
  CASH_ON_DELIVERY: "Cash on delivery",
  VODAFONE_CASH: "Vodafone Cash",
  INSTAPAY: "InstaPay"
};

export const orderStatusLabels: Record<OrderStatusValue, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled"
};
