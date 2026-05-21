export type MediaKind = "image" | "video" | "unknown";

export type MediaCandidate = {
  src: string;
  kind: MediaKind;
};

export type MediaRendererProps = {
  src?: string | null;
  fallbackSrc?: string | null;
  alt: string;
  fallbackLabel: string;
  className?: string;
  mediaClassName?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  preload?: "none" | "metadata" | "auto";
  autoPlay?: boolean;
  loop?: boolean;
  lazyVideo?: boolean;
  allowMobileAutoPlay?: boolean;
  disableVideoOnMobile?: boolean;
  controlsOnMobile?: boolean;
  aspectRatio?: "square" | "video" | "none";
};
