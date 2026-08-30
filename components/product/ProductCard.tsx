
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

        <button
          type="button"
          className="favorite-button"
          aria-label={`افزودن ${product.name} به علاقه‌مندی‌ها`}
        >
          ♡
        </button>

        <div className="product-badges">
          {discount > 0 && (
            <Badge tone="sale">
              {discount}٪
            </Badge>
          )}

          {product.isNew && (
            <Badge tone="neutral">
              جدید
            </Badge>
          )}
        </div>
      </div>

      <div className="product-card-body">
        <div className="product-meta">
          <span>
            {product.isActive ? "موجود" : "ناموجود"}
          </span>

          <span>{product.brand}</span>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <div className="price-row">
          <strong>
            {formatPrice(product.basePrice)}
          </strong>

          <span>تومان</span>

          {product.compareAtPrice &&
            product.compareAtPrice > product.basePrice && (
              <del>
                {formatPrice(product.compareAtPrice)}
              </del>
            )}
        </div>
      </div>
    </article>
  );
}