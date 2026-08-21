import type {
  Category,
  Color,
  Product,
  ProductImage,
  ProductSpecification,
  ProductTag,
  ProductVariant,
  Size,
} from "@/types";

export const categories: Category[] = [
  { id: "cat-bra", name: "سوتین", slug: "bra", description: "مدل‌های ظریف و کاربردی سوتین.", parentId: null, image: "placeholder-bra", isActive: true, sortOrder: 1 },
  { id: "cat-brief", name: "شورت", slug: "brief", description: "شورت‌های روزمره و راحت.", parentId: null, image: "placeholder-brief", isActive: true, sortOrder: 2 },
  { id: "cat-set", name: "ست لباس زیر", slug: "sets", description: "ست‌های هماهنگ و مینیمال.", parentId: null, image: "placeholder-set", isActive: true, sortOrder: 3 },
  { id: "cat-sleepwear", name: "لباس خواب", slug: "sleepwear", description: "لباس خواب‌های سبک و ظریف.", parentId: null, image: "placeholder-sleepwear", isActive: true, sortOrder: 4 },
];

export const colors: Color[] = [
  { id: "color-black", name: "مشکی", slug: "black", hex: "#171717" },
  { id: "color-cream", name: "کرم", slug: "cream", hex: "#E8DED0" },
  { id: "color-wine", name: "زرشکی", slug: "wine", hex: "#6F303C" },
  { id: "color-sand", name: "شنی", slug: "sand", hex: "#CBBBA5" },
  { id: "color-white", name: "سفید", slug: "white", hex: "#F8F7F3" },
];

export const sizes: Size[] = [
  { id: "size-s", name: "S", type: "apparel", sortOrder: 1 },
  { id: "size-m", name: "M", type: "apparel", sortOrder: 2 },
  { id: "size-l", name: "L", type: "apparel", sortOrder: 3 },
  { id: "size-xl", name: "XL", type: "apparel", sortOrder: 4 },
];

export const tags: ProductTag[] = [
  { id: "tag-new", name: "جدید", slug: "new" },
  { id: "tag-best", name: "پرفروش", slug: "best-seller" },
  { id: "tag-sale", name: "تخفیف", slug: "sale" },
];

const productSeed = [
  ["p001", "silk-essential", "ست مینیمال Essential", "ست مینیمال برای استفاده روزمره", "طراحی ساده و ظریف با حال‌وهوای مینیمال.", "cat-set", 1490000, undefined, true, true, true],
  ["p002", "soft-lace", "سوتین دانتل Soft Lace", "سوتین دانتل نرم و سبک", "مدلی ظریف با طراحی ساده برای استفاده روزمره.", "cat-bra", 890000, 1050000, true, true, false],
  ["p003", "everyday-comfort", "شورت Everyday Comfort", "شورت راحت و سبک روزمره", "طراحی راحت با ظاهر تمیز و مینیمال.", "cat-brief", 490000, undefined, false, false, false],
  ["p004", "night-set", "ست لباس خواب آرام", "ست لباس خواب سبک و ظریف", "یک انتخاب ساده برای استراحت شبانه.", "cat-sleepwear", 1890000, undefined, true, false, true],
  ["p005", "minimal-bra", "سوتین Minimal", "سوتین مینیمال و کاربردی", "فرم ساده و قابل استفاده در استایل روزمره.", "cat-bra", 990000, undefined, false, true, false],
  ["p006", "soft-short", "شورت Soft Classic", "شورت نرم با فرم کلاسیک", "مدلی ساده با تمرکز بر راحتی.", "cat-brief", 440000, 520000, false, false, false],
  ["p007", "signature-set", "ست Signature", "ست ویژه با طراحی ظریف", "ترکیبی از فرم مینیمال و جزئیات ظریف.", "cat-set", 2190000, 2490000, true, true, false],
  ["p008", "silk-night", "لباس خواب Silk Night", "لباس خواب با ظاهر لطیف", "طراحی ساده و تمیز برای مجموعه لباس خواب.", "cat-sleepwear", 2390000, undefined, false, false, false],
] as const;

export const products: Product[] = productSeed.map(([id, slug, name, shortDescription, description, categoryId, basePrice, compareAtPrice, isFeatured, isBestSeller, isNew], index) => ({
  id, slug, name, shortDescription, description, categoryId, brand: "EVA MODE", basePrice, compareAtPrice, isFeatured, isBestSeller, isNew, isActive: index !== 7, createdAt: `2026-08-${String(19 - index).padStart(2, "0")}T10:00:00.000Z`, updatedAt: "2026-08-19T10:00:00.000Z",
}));

export const variants: ProductVariant[] = products.flatMap((product, productIndex) => {
  const colorId = colors[productIndex % colors.length].id;
  return [sizes[1], sizes[2]].map((size, sizeIndex): ProductVariant => ({
    id: `${product.id}-variant-${size.id}`,
    productId: product.id,
    sku: `EVA-${String(productIndex + 1).padStart(3, "0")}-${size.name}`,
    colorId,
    sizeId: size.id,
    price: product.basePrice,
    stock: product.id === "p008" ? 0 : sizeIndex === 0 ? 6 + productIndex : 3 + productIndex,
    isActive: product.isActive,
  }));
});

export const productImages: ProductImage[] = products.flatMap((product) => [1, 2, 3].map((position) => ({
  id: `${product.id}-image-${position}`,
  productId: product.id,
  src: `placeholder-${product.slug}-${position}`,
  alt: `${product.name} — تصویر ${position}`,
  sortOrder: position,
  isPrimary: position === 1,
})));

export const specifications: ProductSpecification[] = products.flatMap((product) => [
  { id: `${product.id}-spec-material`, productId: product.id, name: "جنس", value: "پارچه نمایشی", sortOrder: 1 },
  { id: `${product.id}-spec-care`, productId: product.id, name: "نگهداری", value: "شست‌وشوی ملایم", sortOrder: 2 },
]);

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductVariants(productId: string) {
  return variants.filter((variant) => variant.productId === productId);
}

export function getProductImages(productId: string) {
  return productImages.filter((image) => image.productId === productId).sort((a, b) => a.sortOrder - b.sortOrder);
}
