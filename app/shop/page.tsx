import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { FilterBar } from "@/components/shop/FilterBar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Container } from "@/components/ui/Container";
import { getActiveProducts } from "@/lib/products";

export default async function ShopPage() {
  const products = await getActiveProducts();

  return (
    <>
      <Header />

      <main>
        <ShopHeader />

        <FilterBar />

        <section className="shop-products">
          <Container>
            <ProductGrid items={products} />
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}