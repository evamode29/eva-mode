import type { ProductCardData } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";

export function ProductGrid({
  items,
}: {
  items: ProductCardData[];
}) {
  if (!items.length) {
    return (
      <div className="shop-empty">
        <span className="shop-empty-number">00</span>

        <h2>محصولی پیدا نشد</h2>

        <p>
          عبارت جستجو یا فیلتر انتخابی خود را تغییر دهید.
        </p>

        <a
          href="/shop"
          className="eva-button eva-button--primary"
        >
          مشاهده همه محصولات
          <span>←</span>
        </a>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {items.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}