"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { PRODUCT_IMAGE_PLACEHOLDER, resolveProductImage } from "@/lib/media-utils";

export function ProductImagePreview({
  src,
  alt,
  className = "h-16 w-16"
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const imageSrc = resolveProductImage(src);
  const [activeSrc, setActiveSrc] = useState(imageSrc);

  useEffect(() => {
    setActiveSrc(imageSrc);
  }, [imageSrc]);

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-2xl border border-gold/15 bg-luxury-radial ${className}`}>
      <Image
        src={activeSrc}
        alt={alt}
        fill
        sizes="96px"
        className="object-contain p-2"
        onError={() => {
          if (activeSrc !== PRODUCT_IMAGE_PLACEHOLDER) {
            setActiveSrc(PRODUCT_IMAGE_PLACEHOLDER);
          }
        }}
      />
    </div>
  );
}
