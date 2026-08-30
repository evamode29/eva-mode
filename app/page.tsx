import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopProducts } from "@/components/shop/ShopProducts";
import {
  getActiveCategories,
  getActiveProducts,
} from "@/lib/products";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
  getActiveProducts(),
  getActiveCategories(),
]);

  return (
    <>
      <Header />

      <main>
        <ShopHeader />

        <ShopProducts products={products} />
      </main>

      <Footer />
    </>
  );
}