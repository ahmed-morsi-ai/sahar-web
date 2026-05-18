import { PolicyLayout } from "@/components/ui/policy-layout";

export default function PrivacyPage() {
  return (
    <PolicyLayout
      eyebrow="Policy"
      title="Privacy Policy"
      intro="Sahar only collects the information needed to confirm and deliver your fragrance order."
      sections={[
        { title: "Information collected", body: "Checkout collects your name, phone number, email when provided, city, address, payment preference, and order notes." },
        { title: "How it is used", body: "This information is used to confirm orders, arrange delivery, provide support, and improve the customer experience." },
        { title: "WhatsApp orders", body: "Checkout creates a WhatsApp message containing your order details. WhatsApp processing is subject to WhatsApp's own privacy practices." },
        { title: "Data sharing", body: "Sahar does not sell customer data. Delivery details may be shared with courier partners only when needed to fulfill an order." }
      ]}
    />
  );
}
