export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  brand: string;
  basePrice: number;
  compareAtPrice?: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductVariant = {
  id: string;
  productId: string;
  sku: string;
  colorId: string;
  sizeId: string;
  price: number;
  stock: number;
  isActive: boolean;
};

export type ProductImage = {
  id: string;
  productId: string;
  src: string;
  alt: string;
  sortOrder: number;
  isPrimary: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  image: string;
  isActive: boolean;
  sortOrder: number;
};

export type Color = {
  id: string;
  name: string;
  slug: string;
  hex: string;
};

export type Size = {
  id: string;
  name: string;
  type: string;
  sortOrder: number;
};

export type ProductSpecification = {
  id: string;
  productId: string;
  name: string;
  value: string;
  sortOrder: number;
};

export type ProductTag = {
  id: string;
  name: string;
  slug: string;
};
