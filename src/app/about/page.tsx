import { Gem, Moon, Sparkles, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

export default function AboutPage() {
  const pillars: [LucideIcon, string, string][] = [
    [Moon, "Night-coded identity", "Every blend is built around the emotional texture of evening."],
    [Gem, "Premium presentation", "Glass, gold, shadow, and emerald details shape the Sahar world."],
    [Sparkles, "Memorable trails", "Long-lasting profiles are selected for presence, not noise."]
  ];

  return (
    <section className="min-h-screen pt-24 pb-14 sm:pt-32 sm:pb-24">
      <div className="luxury-container">
        <SectionHeader
          eyebrow="About Sahar"
          title="A luxury perfume house for the evening"
          copy="Sahar blends Arabic night culture with contemporary niche perfumery: rich oils, elegant bottles, and fragrances designed to move quietly but stay remembered."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map(([Icon, title, body]) => (
            <article key={title} className="rounded-[1.25rem] border border-gold/15 bg-white/[0.045] p-5 sm:rounded-[1.5rem] sm:p-7">
              <Icon className="mb-4 h-7 w-7 text-gold sm:mb-6" />
              <h2 className="font-serif text-2xl text-ivory sm:text-3xl">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ivory/62 sm:mt-4 sm:text-base sm:leading-7">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
