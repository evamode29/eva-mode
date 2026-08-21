import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

export function ProductGrid({ items }: { items: Product[] }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h2>محصولی موجود نیست</h2>
        <p>در حال حاضر محصول فعالی برای نمایش وجود ندارد.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}