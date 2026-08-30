
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
              EVA MODE / NEW COLLECTION
            </span>

            <h1>
              زیبایی
              <br />
              در سادگی
            </h1>

            <p>
              مجموعه‌ای منتخب از لباس زیر زنانه؛
              <br />
              برای زنانی که کیفیت، ظرافت و راحتی را
              <br />
              هم‌زمان انتخاب می‌کنند.
            </p>

            <div className="hero-actions">
              <Link
                href="/shop"
                className="eva-button eva-button--primary"
              >
                مشاهده مجموعه
                <span>←</span>
              </Link>

              <Link
                href="/shop?sort=new"
                className="eva-button eva-button--secondary"
              >
                جدیدترین‌ها
              </Link>
            </div>

            <div className="hero-trust">
              <div>
                <strong>01</strong>
                <span>انتخاب دقیق</span>
              </div>

              <div>
                <strong>02</strong>
                <span>کیفیت مطلوب</span>
              </div>

              <div>
                <strong>03</strong>
                <span>خرید آسان</span>
              </div>
            </div>
          </div>

          <div className="hero-image-wrap">
            <Image
              src="/images/hero.jpg"
              alt="مجموعه جدید EVA MODE"
              fill
              priority
              sizes="(max-width: 719px) 100vw, 55vw"
              className="hero-image"
            />

            <div className="hero-image-label">
              <span>NEW COLLECTION</span>
              <strong>EVA MODE</strong>
            </div>

            <Link href="/shop" className="hero-image-link">
              خرید مجموعه
              <span>←</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}