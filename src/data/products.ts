import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "sahar-001",
    slug: "ombre-mystique",
    name: "Ombre Mystique",
    price: 1490,
    oldPrice: 1690,
    category: ["Oud", "Night", "Best Sellers"],
    tags: ["signature", "oud", "evening", "bold"],
    description: "Deep oud, saffron, and amber crafted for bold evening presence.",
    longDescription:
      "Ombre Mystique opens with a gilded saffron glow before moving into polished oud wood and a warm amber trail. It is the Sahar signature: cinematic, confident, and made for nights that leave a memory.",
    notes: ["Saffron", "Oud Wood", "Amber"],
    topNotes: ["Saffron Glow", "Pink Pepper", "Bergamot Smoke"],
    heartNotes: ["Oud Wood", "Rose Resin", "Cedar Veil"],
    baseNotes: ["Amber Silk", "Musk", "Labdanum"],
    longevity: "18h",
    projection: "Strong, elegant trail",
    occasion: "Evening, occasions, signature presence",
    gender: "Unisex",
    sizes: [
      { label: "50ml", priceModifier: 0 },
      { label: "100ml", priceModifier: 500 }
    ],
    image: "/images/products/ombre-mystique-1778964643092.png",
    video: "/videos/leslyyyn_pindown.io_1778960192.mp4",
    gallery: [
      "/images/products/ombre-mystique-1778964643092.png",
      "/images/products/desert-noir-1778964501797.png",
      "/images/products/amber-silk-1778964484436.png"
    ],
    rating: 4.9,
    reviewCount: 126,
    isBestSeller: true,
    isNew: false
  },
  {
    id: "sahar-002",
    slug: "rose-nocturne",
    name: "Rose Nocturne",
    price: 1290,
    category: ["Floral", "Night"],
    tags: ["rose", "vanilla", "soft", "evening"],
    description: "Velvet rose wrapped in warm vanilla and patchouli.",
    longDescription:
      "Rose Nocturne turns classic rose into an after-dark statement. Velvet petals meet earthy patchouli and a slow vanilla warmth for an elegant, intimate trail.",
    notes: ["Velvet Rose", "Patchouli", "Vanilla"],
    topNotes: ["Blackcurrant", "Rose Water", "Mandarin"],
    heartNotes: ["Velvet Rose", "Patchouli", "Iris"],
    baseNotes: ["Vanilla", "White Musk", "Sandalwood"],
    longevity: "14h",
    projection: "Moderate to strong",
    occasion: "Dinner, date night, refined daily wear",
    gender: "Feminine leaning unisex",
    sizes: [
      { label: "50ml", priceModifier: 0 },
      { label: "100ml", priceModifier: 450 }
    ],
    image: "/images/products/rose-nocturne-1778964579173.png",
    video: "/videos/products/rose-nocturne.mp4",
    gallery: ["/images/products/rose-nocturne-1778964579173.png", "/images/products/amber-silk-1778964484436.png"],
    rating: 4.8,
    reviewCount: 84,
    isBestSeller: false,
    isNew: true
  },
  {
    id: "sahar-003",
    slug: "lumiere-eternelle",
    name: "Lumiere Eternelle",
    price: 1190,
    category: ["Fresh", "Floral"],
    tags: ["fresh", "white floral", "musk", "day"],
    description: "Fresh citrus, white florals, and clean musk for a soft luxury opening.",
    longDescription:
      "Lumiere Eternelle is the polished daylight side of Sahar. Sparkling bergamot, airy white florals, and clean musk create a luminous fragrance with quiet expensive character.",
    notes: ["Bergamot", "White Floral", "Musk"],
    topNotes: ["Bergamot", "Neroli", "Green Pear"],
    heartNotes: ["White Floral", "Jasmine Petal", "Tea Accord"],
    baseNotes: ["Clean Musk", "Cashmere Wood", "Soft Amber"],
    longevity: "12h",
    projection: "Soft, polished aura",
    occasion: "Day events, office, elegant brunch",
    gender: "Unisex",
    sizes: [
      { label: "50ml", priceModifier: 0 },
      { label: "100ml", priceModifier: 400 }
    ],
    image: "/images/products/lumiere-eternelle-1778964609100.png",
    video: "/videos/products/lumiere-eternelle.mp4",
    gallery: ["/images/products/lumiere-eternelle-1778964609100.png", "/images/products/rose-nocturne-1778964579173.png"],
    rating: 4.7,
    reviewCount: 61,
    isBestSeller: false,
    isNew: true
  },
  {
    id: "sahar-004",
    slug: "amber-silk",
    name: "Amber Silk",
    price: 1390,
    oldPrice: 1550,
    category: ["Amber", "Best Sellers"],
    tags: ["amber", "musk", "warm", "smooth"],
    description: "Smooth amber and musk with a warm elegant trail.",
    longDescription:
      "Amber Silk is warm, tactile, and quietly addictive. Tonka, musk, and amber melt together into a smooth aura that feels dressed-up without becoming loud.",
    notes: ["Amber", "Tonka", "Musk"],
    topNotes: ["Golden Amber", "Cardamom", "Plum"],
    heartNotes: ["Tonka", "Heliotrope", "Soft Spice"],
    baseNotes: ["Musk", "Sandalwood", "Benzoin"],
    longevity: "16h",
    projection: "Elegant medium trail",
    occasion: "Daily luxury, evenings, close encounters",
    gender: "Unisex",
    sizes: [
      { label: "50ml", priceModifier: 0 },
      { label: "100ml", priceModifier: 480 }
    ],
    image: "/images/products/amber-silk-1778964484436.png",
    video: "/videos/products/amber-silk.mp4",
    gallery: ["/images/products/amber-silk-1778964484436.png", "/images/products/ombre-mystique-1778964643092.png"],
    rating: 4.9,
    reviewCount: 102,
    isBestSeller: true,
    isNew: false
  },
  {
    id: "sahar-005",
    slug: "desert-noir",
    name: "Desert Noir",
    price: 1590,
    category: ["Oud", "Amber", "Night"],
    tags: ["incense", "oud", "dark", "limited"],
    description: "A darker oriental signature inspired by midnight desert air.",
    longDescription:
      "Desert Noir is Sahar at its deepest: incense smoke, black vanilla, and oud moving like warm air after midnight. It is intense, ceremonial, and deliberately rare.",
    notes: ["Incense", "Oud", "Black Vanilla"],
    topNotes: ["Incense", "Black Pepper", "Saffron"],
    heartNotes: ["Oud", "Cistus", "Dry Woods"],
    baseNotes: ["Black Vanilla", "Amber Resin", "Smoked Musk"],
    longevity: "20h",
    projection: "Powerful statement trail",
    occasion: "Formal evenings, winter nights, special releases",
    gender: "Masculine leaning unisex",
    sizes: [
      { label: "50ml", priceModifier: 0 },
      { label: "100ml", priceModifier: 550 }
    ],
    image: "/images/products/desert-noir-1778964501797.png",
    gallery: ["/images/products/desert-noir-1778964501797.png", "/images/products/ombre-mystique-1778964643092.png"],
    rating: 4.9,
    reviewCount: 73,
    isBestSeller: false,
    isNew: true
  }
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
