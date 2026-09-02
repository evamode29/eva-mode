import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { ProductSection } from "@/components/home/ProductSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import {
  getActiveCategories,
  getActiveProducts,
} from "@/lib/products";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getActiveProducts(),
    getActiveCategories(),
  ]);

  return (
    <>
      <Header />

      <main>
        <Hero />

        <TrustStrip />

        <CategorySection categories={categories} />

        <ProductSection
          title="جدیدترین‌های EVA MODE"
          eyebrow="02 / NEW ARRIVALS"
          products={products}
          filter={(product) => product.isNew}
        />

        <ProductSection
          title="منتخب EVA MODE"
          eyebrow="03 / SELECTED"
          products={products}
        />
      </main>

      <Footer />
    </>
  );
}
