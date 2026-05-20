import { SectionHeader } from "./section-header";

export function PolicyLayout({
  eyebrow,
  title,
  intro,
  sections
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: { title: string; body: string }[];
}) {
  return (
    <section className="min-h-screen pt-24 pb-14 sm:pt-32 sm:pb-24">
      <div className="luxury-container">
        <SectionHeader eyebrow={eyebrow} title={title} copy={intro} />
        <div className="mx-auto max-w-4xl rounded-[1.25rem] border border-gold/15 bg-white/[0.045] p-5 backdrop-blur-xl sm:rounded-[1.6rem] sm:p-10 sm:backdrop-blur-2xl">
          <div className="space-y-7 sm:space-y-8">
            {sections.map((section) => (
              <article key={section.title}>
                <h2 className="font-serif text-2xl text-gold sm:text-3xl">{section.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65 sm:text-base sm:leading-8">{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
