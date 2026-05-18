import { z } from "zod";
import { isImagePath, isVideoPath } from "@/lib/media-utils";

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

const optionalPositiveInt = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.coerce.number().int().positive().optional()
);

export const productWriteSchema = z.object({
  name: z.string().trim().min(2, "Product name is required.").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  arabicName: optionalText,
  price: z.coerce.number().int().positive("Price must be a positive number."),
  costPrice: z.coerce.number().min(0, "Cost price cannot be negative.").default(0),
  oldPrice: optionalPositiveInt,
  category: z.string().trim().min(1, "Category is required.").max(160),
  tags: z.string().trim().optional().default(""),
  description: z.string().trim().min(8, "Short description is required.").max(500),
  longDescription: z.string().trim().min(20, "Long description is required.").max(2000),
  notes: z.string().trim().optional().default(""),
  topNotes: z.string().trim().optional().default(""),
  heartNotes: z.string().trim().optional().default(""),
  baseNotes: z.string().trim().optional().default(""),
  longevity: z.string().trim().min(1, "Longevity is required.").max(80),
  projection: z.string().trim().min(1, "Projection is required.").max(140),
  occasion: z.string().trim().min(1, "Occasion is required.").max(180),
  gender: z.string().trim().min(1, "Gender is required.").max(80),
  image: z
    .string()
    .trim()
    .min(1, "Main image path is required.")
    .max(300)
    .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), "Image path must start with / or http(s).")
    .refine((value) => isImagePath(value) || /^https?:\/\//.test(value), "Image path must be PNG, JPG, JPEG, WEBP, or SVG.")
    .refine((value) => !isVideoPath(value), "Use the video field for MP4 files."),
  gallery: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((value) => value.split(/[\n,]/).every((item) => !item.trim() || isImagePath(item.trim())), "Gallery paths must be image files."),
  video: optionalText
    .refine((value) => !value || value.startsWith("/") || /^https?:\/\//.test(value), "Video path must start with / or http(s).")
    .refine((value) => !value || isVideoPath(value), "Video path must end with .mp4."),
  sizes: z.string().trim().optional().default("50ml:0\n100ml:500"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative.").default(0),
  rating: z.coerce.number().min(0).max(5).default(0),
  reviewCount: z.coerce.number().int().min(0).default(0),
  isBestSeller: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isActive: z.boolean().default(true),
  metaTitle: optionalText,
  metaDescription: optionalText
});

export type ProductWriteInput = z.infer<typeof productWriteSchema>;
