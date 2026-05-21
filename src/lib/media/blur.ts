import { MEDIA_BLUR_DATA_URL } from "@/lib/media/constants";

export function getImageBlurDataURL(src?: string | null) {
  if (!src || src.endsWith(".svg")) return undefined;
  return MEDIA_BLUR_DATA_URL;
}
