import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { ProductSection } from "@/components/home/ProductSection";
import { CTASection } from "@/components/home/CTASection";

export default function HomePage() {
  return <><Header /><main><Hero /><CategorySection /><ProductSection eyebrow="02 / NEW IN" title="جدیدترین محصولات" filter={(product) => product.isNew} /><ProductSection eyebrow="03 / BEST SELLERS" title="پرفروش‌ها" filter={(product) => product.isBestSeller} /><CTASection /></main><Footer /></>;
}
