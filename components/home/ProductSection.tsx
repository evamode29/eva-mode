import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/ui/Container";
import type { ProductCardData } from "@/lib/products";

type ProductSectionProps = {
  title: string;
  eyebrow: string;
  products: ProductCardData[];
  filter?: (product: ProductCardData) => boolean;
};

export function ProductSection({
  title,
  eyebrow,
  products,
  filter,
}: ProductSectionProps) {
  const items = (filter ? products.filter(filter) : products).slice(0, 4);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="section section-muted">
      <Container>
        <div className="section-heading section-heading--row">
          <div>
            <span>{eyebrow}</span>
            <h2>{title}</h2>
          </div>

          <Link href="/shop">مشاهده همه ←</Link>
        </div>

        <div className="product-grid">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
