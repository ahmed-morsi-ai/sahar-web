import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export { formatPrice, shippingFee } from "@/lib/money";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
