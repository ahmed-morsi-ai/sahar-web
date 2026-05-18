import { faqs } from "@/data/faqs";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { SectionHeader } from "@/components/ui/section-header";

export default function FAQPage() {
  return (
    <section className="min-h-screen pt-32 pb-24">
      <div className="luxury-container">
        <SectionHeader eyebrow="FAQ" title="Questions before the night begins" />
        <div className="mx-auto max-w-4xl">
          <FAQAccordion items={faqs} />
        </div>
      </div>
    </section>
  );
}
