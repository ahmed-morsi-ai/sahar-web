export type ProductCategory = string;

export type ProductSize = {
  label: string;
  priceModifier: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  arabicName?: string;
  price: number;
  oldPrice?: number;
  costPrice?: number;
  profit?: number;
  margin?: number;
  category: ProductCategory[];
  tags: string[];
  description: string;
  longDescription: string;
  notes: string[];
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  longevity: string;
  projection: string;
  occasion: string;
  gender: string;
  sizes: ProductSize[];
  image: string;
  imageUrl?: string;
  gallery: string[];
  video?: string;
  videoUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  rating: number;
  reviewCount: number;
  isBestSeller: boolean;
  isNew: boolean;
  stock?: number;
  isActive?: boolean;
};
