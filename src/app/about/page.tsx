import { Gem, Moon, Sparkles, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

export default function AboutPage() {
  const pillars: [LucideIcon, string, string][] = [
    [Moon, "Night-coded identity", "Every blend is built around the emotional texture of evening."],
    [Gem, "Premium presentation", "Glass, gold, shadow, and emerald details shape the Sahar world."],
    [Sparkles, "Memorable trails", "Long-lasting profiles are selected for presence, not noise."]
  ];

  return (
    <section className="min-h-screen pt-32 pb-24">
      <div className="luxury-container">
        <SectionHeader
          eyebrow="About Sahar"
          title="A luxury perfume house for the evening"
          copy="Sahar blends Arabic night culture with contemporary niche perfumery: rich oils, elegant bottles, and fragrances designed to move quietly but stay remembered."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map(([Icon, title, body]) => (
            <article key={title} className="rounded-[1.5rem] border border-gold/15 bg-white/[0.045] p-7">
              <Icon className="mb-6 h-7 w-7 text-gold" />
              <h2 className="font-serif text-3xl text-ivory">{title}</h2>
              <p className="mt-4 leading-7 text-ivory/62">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
