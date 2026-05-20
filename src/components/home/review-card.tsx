import { Star } from "lucide-react";

export function ReviewCard({ review }: { review: { name: string; city: string; rating: number; text: string } }) {
  return (
    <article className="rounded-[1.1rem] border border-gold/15 bg-white/[0.045] p-5 backdrop-blur-xl sm:rounded-[1.25rem] sm:p-6 sm:backdrop-blur-2xl">
      <div className="mb-4 flex gap-1 text-gold sm:mb-5">
        {Array.from({ length: review.rating }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-gold" />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-ivory/70 sm:text-base sm:leading-7">&ldquo;{review.text}&rdquo;</p>
      <div className="mt-6 border-t border-gold/10 pt-4">
        <p className="font-serif text-xl text-ivory">{review.name}</p>
        <p className="text-sm text-ivory/45">{review.city}</p>
      </div>
    </article>
  );
}
