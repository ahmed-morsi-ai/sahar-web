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
    <section className="min-h-screen pt-32 pb-24">
      <div className="luxury-container">
        <SectionHeader eyebrow={eyebrow} title={title} copy={intro} />
        <div className="mx-auto max-w-4xl rounded-[1.6rem] border border-gold/15 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-10">
          <div className="space-y-8">
            {sections.map((section) => (
              <article key={section.title}>
                <h2 className="font-serif text-3xl text-gold">{section.title}</h2>
                <p className="mt-3 leading-8 text-ivory/65">{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
