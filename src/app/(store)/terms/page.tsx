import { PolicyLayout } from "@/components/ui/policy-layout";

export default function TermsPage() {
  return (
    <PolicyLayout
      eyebrow="Policy"
      title="Terms & Conditions"
      intro="These terms describe how Sahar online orders, payments, and product information should be understood."
      sections={[
        { title: "Product information", body: "Product descriptions, notes, longevity, and projection are provided as realistic guidance. Performance may vary by skin chemistry, weather, and application." },
        { title: "Pricing", body: "Prices are listed in EGP and may change for new releases, offers, size selections, or stock updates." },
        { title: "Payment", body: "Available payment methods include cash on delivery, Vodafone Cash, and InstaPay. Final payment details are confirmed through WhatsApp." },
        { title: "Use of website", body: "The website is intended for legitimate customer browsing and ordering. Any misuse, scraping, or fraudulent order activity may be rejected." }
      ]}
    />
  );
}
