import { PolicyLayout } from "@/components/ui/policy-layout";

export default function ShippingReturnsPage() {
  return (
    <PolicyLayout
      eyebrow="Policy"
      title="Shipping & Returns"
      intro="Clear commercial policies for Egyptian perfume orders, written in a premium but readable format."
      sections={[
        { title: "Shipping across Egypt", body: "Sahar ships across Egypt after WhatsApp order confirmation. Delivery timing depends on destination city and courier availability." },
        { title: "Order confirmation", body: "After checkout, your order details open in WhatsApp. A Sahar representative confirms availability, payment method, and delivery details before dispatch." },
        { title: "Returns and exchanges", body: "Unopened bottles with intact packaging may be eligible for return or exchange. Opened fragrances cannot be returned for hygiene and product integrity reasons." },
        { title: "Damaged parcels", body: "If your parcel arrives damaged, contact Sahar on WhatsApp on the same day with clear photos so the team can resolve it quickly." }
      ]}
    />
  );
}
