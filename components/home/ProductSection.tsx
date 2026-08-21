import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/lib/mock-data";

export function ProductSection({ title, eyebrow, filter }: { title: string; eyebrow: string; filter?: (product: typeof products[number]) => boolean }) {
  const items = (filter ? products.filter(filter) : products).slice(0, 4);

  return (
    <section className="section section-muted">
      <Container>
        <div className="section-heading section-heading--row"><div><span>{eyebrow}</span><h2>{title}</h2></div><Link href="/shop">مشاهده همه ←</Link></div>
        <div className="product-grid">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </Container>
    </section>
  );
}
