"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ColorSelector } from "@/components/product/ColorSelector";
import { SizeSelector } from "@/components/product/SizeSelector";
import { useCart } from "@/components/cart/CartContext";

import type {
  Color,
  Product,
  ProductImage,
  ProductVariant,
  Size,
} from "@/types";

function formatPrice(value: number) {
  return new Intl.NumberFormat(
    "fa-IR"
  ).format(value);
}

type ProductInfoProps = {
  product: Product;
  colors: Color[];
  sizes: Size[];
  variants: ProductVariant[];
  stock: number;
  primaryImage: ProductImage | null;
  onColorChange?: (
    colorId: string | null
  ) => void;
};

export function ProductInfo({
  product,
  colors,
  sizes,
  variants,
  stock,
  primaryImage,
  onColorChange,
}: ProductInfoProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const activeVariants = useMemo(
    () =>
      variants.filter(
        (variant) => variant.isActive
      ),
    [variants]
  );

  const [selectedColorId, setSelectedColorId] =
    useState<string | null>(
      colors[0]?.id ?? null
    );

  const [selectedSizeId, setSelectedSizeId] =
    useState<string | null>(
      sizes[0]?.id ?? null
    );

  /*
   * سایزهایی که برای رنگ انتخاب‌شده
   * واقعاً Variant فعال دارند.
   */
  const availableSizeIds = useMemo(() => {
    if (!selectedColorId) {
      return [];
    }

    return activeVariants
      .filter(
        (variant) =>
          variant.colorId ===
            selectedColorId &&
          variant.stock > 0
      )
      .map((variant) => variant.sizeId);
  }, [
    activeVariants,
    selectedColorId,
  ]);

  /*
   * اگر سایز فعلی برای رنگ جدید موجود نبود،
   * اولین سایز موجود را انتخاب می‌کنیم.
   */
  useEffect(() => {
    if (
      availableSizeIds.length === 0
    ) {
      setSelectedSizeId(null);
      return;
    }

    if (
      selectedSizeId &&
      availableSizeIds.includes(
        selectedSizeId
      )
    ) {
      return;
    }

    setSelectedSizeId(
      availableSizeIds[0]
    );
  }, [
    availableSizeIds,
    selectedSizeId,
  ]);

  const selectedVariant = useMemo(() => {
    if (
      !selectedColorId ||
      !selectedSizeId
    ) {
      return null;
    }

    return (
      activeVariants.find(
        (variant) =>
          variant.colorId ===
            selectedColorId &&
          variant.sizeId ===
            selectedSizeId
      ) ?? null
    );
  }, [
    activeVariants,
    selectedColorId,
    selectedSizeId,
  ]);

  const selectedColor = colors.find(
    (color) =>
      color.id === selectedColorId
  );

  const selectedSize = sizes.find(
    (size) =>
      size.id === selectedSizeId
  );

  const available =
    product.isActive && stock > 0;

  const variantAvailable =
    selectedVariant !== null &&
    selectedVariant.stock > 0;

  const displayPrice =
    selectedVariant?.price ??
    product.basePrice;

  function handleColorChange(
    colorId: string
  ) {
    setSelectedColorId(colorId);

    onColorChange?.(colorId);
  }

  function handleAddToCart() {
    if (
      !selectedVariant ||
      !variantAvailable
    ) {
      return;
    }

    addItem({
      id: selectedVariant.id,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      image: primaryImage?.src ?? "",
      colorName:
        selectedColor?.name ?? "",
      sizeName:
        selectedSize?.name ?? "",
      price: selectedVariant.price,
    });

    router.push("/cart");
  }

  return (
    <div className="product-info">
      <div className="product-info-top">
        <Badge
          tone={
            available
              ? "success"
              : "sale"
          }
        >
          {available
            ? "موجود"
            : "ناموجود"}
        </Badge>

        <span>
          برند: {product.brand}
        </span>
      </div>

      <h1>{product.name}</h1>

      <p className="product-description">
        {product.description}
      </p>

      <div className="product-price">
        <strong>
          {formatPrice(displayPrice)}
        </strong>

        <span>تومان</span>

        {product.compareAtPrice && (
          <del>
            {formatPrice(
              product.compareAtPrice
            )}
          </del>
        )}
      </div>

      <ColorSelector
        colors={colors}
        selectedColorId={
          selectedColorId
        }
        onSelect={
          handleColorChange
        }
      />

      <SizeSelector
        sizes={sizes}
        selectedSizeId={
          selectedSizeId
        }
        availableSizeIds={
          availableSizeIds
        }
        onSelect={
          setSelectedSizeId
        }
      />

      {selectedColorId &&
        availableSizeIds.length === 0 && (
          <p className="product-availability-message product-availability-message--error">
            این رنگ در حال حاضر موجود نیست.
          </p>
        )}

      {selectedVariant &&
        selectedVariant.stock > 0 && (
          <p className="product-availability-message">
            موجودی:{" "}
            {formatPrice(
              selectedVariant.stock
            )}{" "}
            عدد
          </p>
        )}

      {selectedVariant &&
        selectedVariant.stock <= 0 && (
          <p className="product-availability-message product-availability-message--error">
            این سایز و رنگ در حال حاضر
            موجود نیست.
          </p>
        )}

      {!selectedVariant &&
        selectedColorId &&
        selectedSizeId &&
        availableSizeIds.length > 0 && (
          <p className="product-availability-message product-availability-message--error">
            این ترکیب رنگ و سایز موجود نیست.
          </p>
        )}

      <Button
        className="add-to-cart-button"
        disabled={!variantAvailable}
        onClick={handleAddToCart}
      >
        {variantAvailable
          ? "افزودن به سبد"
          : "ناموجود"}
      </Button>
    </div>
  );
}