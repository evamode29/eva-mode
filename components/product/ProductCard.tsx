
import Image from "next/image";
import Link from "next/link";
import type { ProductCardData } from "@/lib/products";
import { Badge } from "@/components/ui/Badge";

function formatPrice(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function ProductCard({
  product,
}: {
  product: ProductCardData;
}) {
  const discount =
    product.compareAtPrice &&
    product.compareAtPrice > product.basePrice
      ? Math.round(
          (1 - product.basePrice / product.compareAtPrice) * 100
        )
      : 0;

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link
          href={`/products/${product.slug}`}
          className="product-placeholder"
          aria-label={`مشاهده ${product.name}`}
        >
          {product.primaryImage ? (
            <Image
              src={product.primaryImage.src}
              alt={product.primaryImage.alt || product.name}
              width={900}
              height={1200}
              className="product-card-image"
            />
          ) : (
            <span className="product-image-empty">
              EVA MODE
            </span>
          )}
        </Link>

        <div className="product-badges">
          {discount > 0 && (
            <Badge tone="sale">
              {discount}٪ تخفیف
            </Badge>
          )}

          {product.isNew && (
            <Badge tone="neutral">
              جدید
            </Badge>
          )}

          {product.isBestSeller && (
            <Badge tone="neutral">
              پرفروش
            </Badge>
          )}
        </div>

        <button
          type="button"
          className="favorite-button"
          aria-label={`افزودن ${product.name} به علاقه‌مندی‌ها`}
        >
          ♡
        </button>
      </div>

      <div className="product-card-body">
        <div className="product-meta">
          <span>{product.brand}</span>

          <span
            className={
              product.isActive
                ? "product-stock product-stock--available"
                : "product-stock"
            }
          >
            {product.isActive ? "موجود" : "ناموجود"}
          </span>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="product-name"
        >
          {product.name}
        </Link>

        {product.shortDescription && (
          <p className="product-short-description">
            {product.shortDescription}
          </p>
        )}

        <div className="price-row">
          <div className="current-price">
            <strong>{formatPrice(product.basePrice)}</strong>
            <span>تومان</span>
          </div>

          {product.compareAtPrice &&
            product.compareAtPrice > product.basePrice && (
              <del>{formatPrice(product.compareAtPrice)}</del>
            )}
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="product-view-link"
        >
          مشاهده محصول
          <span>←</span>
        </Link>
      </div>
    </article>
  );
}