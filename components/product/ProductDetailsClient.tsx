"use client";

import { useMemo, useState } from "react";

import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";

import type {
  Color,
  Product,
  ProductImage,
  ProductVariant,
  Size,
} from "@/types";

type ProductDetailsClientProps = {
  product: Product;
  images: ProductImage[];
  variants: ProductVariant[];
  colors: Color[];
  sizes: Size[];
  stock: number;
  primaryImage: ProductImage | null;
};

export function ProductDetailsClient({
  product,
  images,
  variants,
  colors,
  sizes,
  stock,
  primaryImage,
}: ProductDetailsClientProps) {
  const [
    selectedColorId,
    setSelectedColorId,
  ] = useState<string | null>(
    colors[0]?.id ?? null
  );

  const selectedColorImage =
    useMemo(() => {
      if (!selectedColorId) {
        return primaryImage;
      }

      return (
        images.find(
          (image) =>
            image.colorId ===
              selectedColorId &&
            image.isPrimary
        ) ??
        images.find(
          (image) =>
            image.colorId ===
            selectedColorId
        ) ??
        primaryImage
      );
    }, [
      images,
      selectedColorId,
      primaryImage,
    ]);

  return (
    <div className="product-detail">
      <ProductGallery
        images={images}
        selectedColorId={
          selectedColorId
        }
      />

      <ProductInfo
        product={product}
        colors={colors}
        sizes={sizes}
        variants={variants}
        stock={stock}
        primaryImage={
          selectedColorImage
        }
        onColorChange={
          setSelectedColorId
        }
      />
    </div>
  );
}