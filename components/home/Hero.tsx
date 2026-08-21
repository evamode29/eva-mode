import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="hero-section">
      <Container>
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">EVA MODE / ESSENTIALS</span>
            <h1>EVA MODE</h1>
            <p>ظرافتی آرام برای انتخاب‌های روزمره.</p>
            <Link href="/shop" className="eva-button eva-button--primary">مشاهده محصولات</Link>
          </div>
          <div className="visual-placeholder hero-placeholder" aria-label="محل تصویر اصلی برند">
            <span>IMAGE PLACEHOLDER</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
