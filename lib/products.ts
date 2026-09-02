import { supabase } from "@/lib/supabase";

import type {
  Category,
  Color,
  Product,
  ProductImage,
  ProductVariant,
  Size,
} from "@/types";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  base_price: number;
  category_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type ProductCardRow = ProductRow & {
  product_images:
    | {
        id: string;
        product_id: string;
        image_url: string;
        alt_text: string | null;
        sort_order: number;
        is_primary: boolean;
        color_id: string | null;
      }[]
    | null;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
};

type ProductImageRow = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  color_id: string | null;
  created_at: string;
};

type ProductVariantRow = {
  id: string;
  product_id: string;
  color_id: string | null;
  size_id: string | null;
  sku: string;
  price: number;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  color: ColorRow | ColorRow[] | null;
  size: SizeRow | SizeRow[] | null;
};

type ColorRow = {
  id: string;
  name: string;
  slug: string;
  hex_code: string;
  created_at: string;
};

type SizeRow = {
  id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type ProductCardData = Product & {
  primaryImage: ProductImage | null;
};

export type ProductDetails = {
  product: Product;
  category: Category | null;
  images: ProductImage[];
  variants: ProductVariant[];
  colors: Color[];
  sizes: Size[];
};

function isProductNew(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();

  if (Number.isNaN(created)) return false;

  return Date.now() - created <= 30 * 24 * 60 * 60 * 1000;
}

function mapProduct(
  row: ProductRow,
  categorySlug?: string
): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.description ?? "",
    description: row.description ?? "",
    categoryId: row.category_id,
    categorySlug,
    brand: "EVA MODE",
    basePrice: Number(row.base_price),
    compareAtPrice: undefined,
    isFeatured: false,
    isNew: isProductNew(row.created_at),
    isBestSeller: false,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProductImage(row: ProductImageRow): ProductImage {
  return {
    id: row.id,
    productId: row.product_id,
    src: row.image_url,
    alt: row.alt_text ?? "",
    sortOrder: row.sort_order,
    isPrimary: row.is_primary,
    colorId: row.color_id ?? null,
  };
}

export async function getActiveProducts(): Promise<ProductCardData[]> {
  const [{ data: productData, error: productError }, { data: categoryData, error: categoryError }] =
    await Promise.all([
      supabase
        .from("products")
        .select(`
          id,
          slug,
          name,
          description,
          base_price,
          category_id,
          is_active,
          created_at,
          updated_at,
          product_images (
            id,
            product_id,
            image_url,
            alt_text,
            sort_order,
            is_primary,
            color_id
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("categories")
        .select("id, slug")
        .eq("is_active", true),
    ]);

  if (productError) {
    throw new Error(`Failed to fetch products: ${productError.message}`);
  }

  if (categoryError) {
    throw new Error(`Failed to fetch categories: ${categoryError.message}`);
  }

  const categorySlugs = new Map(
    (categoryData ?? []).map((category) => [category.id, category.slug])
  );

  const rows = (productData ?? []) as unknown as ProductCardRow[];

  return rows.map((row) => {
    const images = (row.product_images ?? [])
      .map((image) => mapProductImage({ ...image, created_at: "" }))
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return {
      ...mapProduct(row, categorySlugs.get(row.category_id)),
      primaryImage:
        images.find((image) => image.isPrimary) ?? images[0] ?? null,
    };
  });
}

export async function getProductBySlug(
  slug: string
): Promise<ProductDetails | null> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      description,
      base_price,
      category_id,
      is_active,
      created_at,
      updated_at,
      category:categories (
        id,
        name,
        slug,
        description,
        is_active,
        created_at
      ),
      product_images (
        id,
        product_id,
        image_url,
        alt_text,
        sort_order,
        is_primary,
        color_id,
        created_at
      ),
      product_variants (
        id,
        product_id,
        color_id,
        size_id,
        sku,
        price,
        stock,
        is_active,
        created_at,
        updated_at,
        color:colors (
          id,
          name,
          slug,
          hex_code,
          created_at
        ),
        size:sizes (
          id,
          name,
          sort_order,
          is_active,
          created_at
        )
      )
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  if (!data) return null;

  const row = data as unknown as ProductRow & {
    category: CategoryRow | CategoryRow[] | null;
    product_images: ProductImageRow[] | null;
    product_variants: ProductVariantRow[] | null;
  };

  const categoryRow = Array.isArray(row.category)
    ? row.category[0] ?? null
    : row.category;

  const category: Category | null = categoryRow
    ? {
        id: categoryRow.id,
        name: categoryRow.name,
        slug: categoryRow.slug,
        description: categoryRow.description ?? "",
        parentId: null,
        image: "",
        isActive: categoryRow.is_active,
        sortOrder: 0,
      }
    : null;

  const images = (row.product_images ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(mapProductImage);

  const variants = (row.product_variants ?? []).map((variant) => ({
    id: variant.id,
    productId: variant.product_id,
    sku: variant.sku,
    colorId: variant.color_id ?? "",
    sizeId: variant.size_id ?? "",
    price: Number(variant.price),
    stock: Number(variant.stock),
    isActive: variant.is_active,
  }));

  const colors: Color[] = [];
  const sizes: Size[] = [];

  for (const variant of row.product_variants ?? []) {
    const colorRow = Array.isArray(variant.color)
      ? variant.color[0] ?? null
      : variant.color;

    if (colorRow && !colors.some((color) => color.id === colorRow.id)) {
      colors.push({
        id: colorRow.id,
        name: colorRow.name,
        slug: colorRow.slug,
        hex: colorRow.hex_code,
      });
    }

    const sizeRow = Array.isArray(variant.size)
      ? variant.size[0] ?? null
      : variant.size;

    if (sizeRow && !sizes.some((size) => size.id === sizeRow.id)) {
      sizes.push({
        id: sizeRow.id,
        name: sizeRow.name,
        type: "apparel",
        sortOrder: sizeRow.sort_order,
      });
    }
  }

  sizes.sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    product: mapProduct(row, category?.slug),
    category,
    images,
    variants,
    colors,
    sizes,
  };
}

export async function getActiveCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug,
      description,
      is_active,
      created_at
    `)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  return (data ?? []).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    parentId: null,
    image: "",
    isActive: category.is_active,
    sortOrder: 0,
  }));
}
