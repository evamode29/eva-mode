import { ProductCard } from "@/components/product/ProductCard";
import type { ProductCardData } from "@/lib/products";

export function ProductGrid({
  items,
}: {
  items: ProductCardData[];
}) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h2>محصولی پیدا نشد</h2>
        <p>
          محصولی مطابق جستجوی شما وجود ندارد.
        </p>
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