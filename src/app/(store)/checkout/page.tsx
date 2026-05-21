import { CheckoutForm } from "@/components/checkout/checkout-form";
import { SectionHeader } from "@/components/ui/section-header";

export default function CheckoutPage() {
  return (
    <section className="min-h-screen pt-24 pb-14 sm:pt-32 sm:pb-24">
      <div className="luxury-container">
        <SectionHeader
          eyebrow="Checkout"
          title="Confirm your Sahar order"
          copy="Your order will be prepared as a WhatsApp message with every product, quantity, total, and delivery detail."
        />
        <CheckoutForm />
      </div>
    </section>
  );
}
