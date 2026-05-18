export const OMBRE_MYSTIQUE_VIDEO = "/videos/leslyyyn_pindown.io_1778960192.mp4";
export const PRODUCT_IMAGE_PLACEHOLDER = "/images/products/product-placeholder.svg";

export function isRemoteUrl(src?: string | null) {
  if (!src) return false;
  return /^https?:\/\//i.test(src.trim());
}

export function isVideoPath(src?: string | null) {
  if (!src) return false;
  return /\.mp4(?:[?#].*)?$/i.test(src.trim());
}

export function isImagePath(src?: string | null) {
  if (!src) return false;
  return /\.(png|jpe?g|webp|svg)(?:[?#].*)?$/i.test(src.trim());
}

export function isRenderableImagePath(src?: string | null) {
  const current = src?.trim();
  return Boolean(current && !isVideoPath(current) && (isImagePath(current) || isRemoteUrl(current)));
}

export function resolveProductImage(image?: string | null): string {
  const currentImage = image?.trim();

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
  const currentVideo = video?.trim();

  if (currentVideo && isVideoPath(currentVideo)) {
    return currentVideo;
  }

  return undefined;
}
