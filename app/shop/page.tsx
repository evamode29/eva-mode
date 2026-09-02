import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopProducts } from "@/components/shop/ShopProducts";
import { getActiveProducts } from "@/lib/products";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
  }>;
}) {
  const [products, params] = await Promise.all([
    getActiveProducts(),
    searchParams,
  ]);

  return (
    <>
      <Header />
      <main>
        <ShopHeader />
        <ShopProducts
          products={products}
          initialCategory={params.category}
        />
      </main>
      <Footer />
    </>
  );
}
