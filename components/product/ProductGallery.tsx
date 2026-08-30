"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ProductImage,
} from "@/types";

type ProductGalleryProps = {
  images: ProductImage[];
  selectedColorId?: string | null;
};

export function ProductGallery({
  images,
  selectedColorId = null,
}: ProductGalleryProps) {
  const sortedImages = useMemo(() => {
    return [...images].sort(
      (a, b) =>
        a.sortOrder - b.sortOrder
    );
  }, [images]);

  const colorImages = useMemo(() => {
    if (!selectedColorId) {
      return sortedImages;
    }

    const imagesWithColor =
      sortedImages.filter(
        (image) =>
          image.colorId ===
          selectedColorId
      );

    if (
      imagesWithColor.length === 0
    ) {
      return sortedImages;
    }

    return imagesWithColor;
  }, [
    sortedImages,
    selectedColorId,
  ]);

  const primaryImage =
    colorImages.find(
      (image) => image.isPrimary
    ) ??
    colorImages[0] ??
    null;

  const [
    selectedImage,
    setSelectedImage,
  ] =
    useState<ProductImage | null>(
      primaryImage
    );

  useEffect(() => {
    if (
      colorImages.length === 0
    ) {
      setSelectedImage(null);
      return;
    }

    setSelectedImage(
      primaryImage
    );
  }, [
    colorImages,
    primaryImage,
  ]);

  if (colorImages.length === 0) {
    return (
      <div className="gallery">
        <div className="visual-placeholder gallery-main">
          <span>
            تصویر محصول موجود نیست
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery">
      <div className="gallery-main">
        {selectedImage && (
          <Image
            key={selectedImage.id}
            src={selectedImage.src}
            alt={
              selectedImage.alt ||
              "تصویر محصول"
            }
            width={1200}
            height={1500}
            priority
            className="gallery-main-image"
            sizes="(max-width: 719px) 100vw, 55vw"
          />
        )}
      </div>

      {colorImages.length > 1 && (
        <div className="gallery-thumbs">
          {colorImages.map(
            (image) => {
              const isSelected =
                selectedImage?.id ===
                image.id;

              return (
                <button
                  key={image.id}
                  type="button"
                  className={[
                    "gallery-thumb",
                    isSelected
                      ? "is-selected"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() =>
                    setSelectedImage(
                      image
                    )
                  }
                  aria-label={
                    image.alt ||
                    `تصویر ${image.sortOrder}`
                  }
                  aria-pressed={
                    isSelected
                  }
                >
                  <Image
                    src={image.src}
                    alt=""
                    width={220}
                    height={220}
                    className="gallery-thumb-image"
                    sizes="120px"
                  />
                </button>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}