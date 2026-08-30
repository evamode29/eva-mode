
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { ProductSection } from "@/components/home/ProductSection";
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

        <CategorySection categories={categories} />

        <ProductSection
          title="منتخب EVA MODE"
          eyebrow="02 / SELECTED"
          products={products}
        />
      </main>

      <Footer />
    </>
  );
}