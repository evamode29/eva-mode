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
  category: CategoryRow | CategoryRow[] | null;
  product_images: ProductImageRow[] | null;
  product_variants: ProductVariantRow[] | null;
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

export type ProductDetails = {
  product: Product;
  category: Category | null;
  images: ProductImage[];
  variants: ProductVariant[];
  colors: Color[];
  sizes: Size[];
};

export async function getActiveProducts(): Promise<Product[]> {
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
      updated_at
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  const rows = (data ?? []) as ProductRow[];

  return rows.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.description ?? "",
    description: product.description ?? "",
    categoryId: product.category_id,
    brand: "EVA MODE",
    basePrice: Number(product.base_price),
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
    isActive: product.is_active,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  }));
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

  if (!data) {
    return null;
  }

  const row = data as unknown as ProductRow;

  const product: Product = {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.description ?? "",
    description: row.description ?? "",
    categoryId: row.category_id,
    brand: "EVA MODE",
    basePrice: Number(row.base_price),
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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

  const images: ProductImage[] = (row.product_images ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((image) => ({
      id: image.id,
      productId: image.product_id,
      src: image.image_url,
      alt: image.alt_text ?? product.name,
      sortOrder: image.sort_order,
      isPrimary: image.is_primary,
    }));

  const variants: ProductVariant[] = (row.product_variants ?? []).map(
    (variant) => ({
      id: variant.id,
      productId: variant.product_id,
      sku: variant.sku,
      colorId: variant.color_id ?? "",
      sizeId: variant.size_id ?? "",
      price: Number(variant.price),
      stock: Number(variant.stock),
      isActive: variant.is_active,
    })
  );

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
    product,
    category,
    images,
    variants,
    colors,
    sizes,
  };
}