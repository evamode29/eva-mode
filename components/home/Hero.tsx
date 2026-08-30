import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="hero-section">
      <Container>
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              EVA MODE / ESSENTIALS
            </span>

            <h1>EVA MODE</h1>

            <p>
              انتخابی ظریف برای استایل روزمره؛
              ساده، شیک و متفاوت.
            </p>

            <Link
              href="/shop"
              className="eva-button eva-button--primary"
            >
              مشاهده محصولات
            </Link>
          </div>

          <div className="hero-image-wrap">
            <Image
              src="/images/hero.jpg"
              alt="مجموعه لباس زیر زنانه EVA MODE"
              fill
              priority
              sizes="(max-width: 719px) 100vw, 55vw"
              className="hero-image"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}