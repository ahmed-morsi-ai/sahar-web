import { SectionHeader } from "@/components/ui/section-header";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { SaharLogo } from "@/components/ui/sahar-logo";

export default function StoryPage() {
  return (
    <section className="min-h-screen pt-24 pb-14 sm:pt-32 sm:pb-24">
      <div className="luxury-container">
        <SectionHeader
          eyebrow="Brand Story"
          title="سهر means the night is still awake"
          copy="Sahar was created for the hour when light becomes softer, voices become lower, and fragrance becomes part of memory."
        />
        <div className="grid items-center gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <SaharLogo
            className="min-h-[300px] w-full rounded-[1.4rem] border-gold/15 bg-luxury-radial p-5 sm:min-h-[440px] sm:rounded-[2rem] sm:p-8"
            imageClassName="max-h-72 max-w-full object-contain sm:max-h-96"
            fallbackClassName="text-5xl sm:text-8xl"
            sizes="(min-width: 1024px) 36vw, 100vw"
          />
          <div className="rounded-[1.4rem] border border-gold/15 bg-white/[0.045] p-5 text-sm leading-relaxed text-ivory/66 backdrop-blur-xl sm:rounded-[2rem] sm:p-10 sm:text-base sm:leading-8 sm:backdrop-blur-2xl">
            <p>
              The brand begins with a simple idea: the best perfume does not shout. It arrives with control, settles
              with warmth, and leaves behind a trace that feels personal. Sahar bottles that after-dark confidence.
            </p>
            <p className="mt-5">
              Emerald light represents the mystery of the night. Gold represents craft and ceremony. Ivory typography
              keeps the experience human, warm, and refined.
            </p>
            <p className="mt-5">
              Each fragrance is arranged like a scene: an opening note, a heart that reveals the character, and a base
              that stays in the room after you leave.
            </p>
            <LuxuryButton href="/shop" className="mt-8 w-full sm:w-auto">
              Explore Collection
            </LuxuryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
