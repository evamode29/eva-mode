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
              EVA MODE / WOMEN'S ESSENTIALS
            </span>

            <h1>
              زیبایی
              <br />
              در سادگی
            </h1>

            <p>
              انتخابی از لباس زیر زنانه با تمرکز بر
              ظرافت، کیفیت و راحتی.
            </p>

            <div className="hero-actions">
              <Link
                href="/shop"
                className="eva-button eva-button--primary"
              >
                مشاهده مجموعه
              </Link>

              <Link
                href="/shop?sort=newest"
                className="eva-button eva-button--secondary"
              >
                جدیدترین‌ها
              </Link>
            </div>

            <div className="hero-trust">
              <span>کیفیت انتخاب‌شده</span>
              <span>ارسال مطمئن</span>
              <span>خرید آسان</span>
            </div>
          </div>

          <div className="hero-image-wrap">
            <Image
              src="/images/hero.jpg"
              alt="مجموعه EVA MODE"
              fill
              priority
              sizes="(max-width: 719px) 100vw, 55vw"
              className="hero-image"
            />

            <div className="hero-image-label">
              <span>NEW COLLECTION</span>
              <strong>EVA MODE</strong>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}