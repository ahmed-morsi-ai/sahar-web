import { PRODUCT_IMAGE_PLACEHOLDER } from "@/lib/media/constants";
import type { MediaCandidate, MediaKind } from "@/types/media";

export function isRemoteUrl(src?: string | null) {
  if (!src) return false;
  return /^https?:\/\//i.test(src.trim());
}

function cleanMediaSrc(src?: string | null) {
  return src?.trim() ?? "";
}

function withoutQueryOrHash(src: string) {
  return src.split(/[?#]/, 1)[0] ?? src;
}

function siblingWebpPath(src: string) {
  if (isRemoteUrl(src)) return undefined;

  const path = withoutQueryOrHash(src);
  if (!/\.(png|jpe?g)$/i.test(path)) return undefined;

  const dotIndex = path.lastIndexOf(".");
  if (dotIndex < 0) return undefined;

  const webpPath = `${path.slice(0, dotIndex)}.webp`;
  return webpPath === path ? undefined : webpPath;
}

function uniqueMediaSources(values: Array<string | undefined | null>) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const current = cleanMediaSrc(value);
    if (!current || seen.has(current)) continue;

    seen.add(current);
    result.push(current);
  }

  return result;
}

export function isVideoPath(src?: string | null) {
  const current = cleanMediaSrc(src);
  return /\.(mp4|mov|webm)(?:[?#].*)?$/i.test(current);
}

export function isImagePath(src?: string | null) {
  const current = cleanMediaSrc(src);
  return /\.(png|jpe?g|webp|avif|svg|gif)(?:[?#].*)?$/i.test(current);
}

export function isRenderableImagePath(src?: string | null) {
  const current = cleanMediaSrc(src);
  return Boolean(current && !isVideoPath(current) && (isImagePath(current) || isRemoteUrl(current)));
}

export function getMediaKind(src?: string | null): MediaKind {
  const current = cleanMediaSrc(src);
  if (!current) return "unknown";
  if (isVideoPath(current)) return "video";
  if (isRenderableImagePath(current)) return "image";
  return "unknown";
}

/** Primary path first, optional sibling .webp, then fallback — no speculative /optimized URLs. */
export function resolveImageCandidates(image?: string | null, fallbackImage?: string | null): string[] {
  const current = cleanMediaSrc(image);
  const fallback = cleanMediaSrc(fallbackImage);
  const candidates: Array<string | undefined> = [];

  if (isRenderableImagePath(current)) {
    candidates.push(current);
    const webp = siblingWebpPath(current);
    if (webp) candidates.push(webp);
  }

  if (fallback && fallback !== current && isRenderableImagePath(fallback)) {
    candidates.push(fallback);
    const fallbackWebp = siblingWebpPath(fallback);
    if (fallbackWebp) candidates.push(fallbackWebp);
  }

  candidates.push(PRODUCT_IMAGE_PLACEHOLDER);

  return uniqueMediaSources(candidates).filter(isRenderableImagePath);
}

export function resolveVideoCandidates(video?: string | null): string[] {
  const current = cleanMediaSrc(video);
  if (!isVideoPath(current)) return [];

  return uniqueMediaSources([current]).filter(isVideoPath);
}

export function resolveMediaCandidates(src?: string | null, fallbackImage?: string | null): MediaCandidate[] {
  const current = cleanMediaSrc(src);
  const kind = getMediaKind(current);

  let sources: string[] = [];

  if (kind === "video") {
    sources = [...resolveVideoCandidates(current), ...resolveImageCandidates(fallbackImage)];
  } else if (kind === "image") {
    sources = resolveImageCandidates(current, fallbackImage);
  } else if (current) {
    sources = uniqueMediaSources([...resolveVideoCandidates(current), ...resolveImageCandidates(current, fallbackImage)]);
  } else {
    sources = resolveImageCandidates(undefined, fallbackImage);
  }

  if (!sources.length) {
    sources = [PRODUCT_IMAGE_PLACEHOLDER];
  }

  return sources.map((source) => ({
    src: source,
    kind: getMediaKind(source)
  }));
}

export function resolveProductImage(image?: string | null): string {
  const currentImage = cleanMediaSrc(image);

  if (currentImage && isRenderableImagePath(currentImage)) {
    return currentImage;
  }

  return PRODUCT_IMAGE_PLACEHOLDER;
}

export function resolveProductGallery(gallery: string[] = [], mainImage?: string | null): string[] {
  const main = resolveProductImage(mainImage);
  const images = gallery
    .map((item) => item.trim())
    .filter((item) => item && isRenderableImagePath(item));
  const unique = Array.from(new Set([main, ...images]));

  return unique.length ? unique : [PRODUCT_IMAGE_PLACEHOLDER];
}

export function resolveProductVideo(_slug: string, video?: string | null) {
  const currentVideo = cleanMediaSrc(video);

  if (currentVideo && isVideoPath(currentVideo)) {
    return currentVideo;
  }

  return undefined;
}

export const BRAND_LOGO_CANDIDATES = [
  "/images/sahar-logo.png",
  PRODUCT_IMAGE_PLACEHOLDER
] as const;
