
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopProducts } from "@/components/shop/ShopProducts";
import { getActiveProducts } from "@/lib/products";

export default async function ShopPage() {
  const products = await getActiveProducts();

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