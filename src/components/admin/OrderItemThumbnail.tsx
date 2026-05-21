"use client";

import { SafeImage } from "@/components/media/safe-image";
import { resolveProductImage } from "@/lib/media-utils";

export function OrderItemThumbnail({ src, alt }: { src?: string | null; alt: string }) {
  const imageSrc = resolveProductImage(src);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <SafeImage src={imageSrc} alt={alt} sizes="72px" className="object-cover" />
    </div>
  );
}
