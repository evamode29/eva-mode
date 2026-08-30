
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Category } from "@/types";

export function CategorySection({
  categories,
}: {
  categories: Category[];
}) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="section category-section" id="categories">
      <Container>
        <div className="section-heading section-heading--row">
          <div>
            <span>01 / COLLECTION</span>
            <h2>دسته‌بندی‌ها</h2>
            <p>انتخابی ساده برای شروع خرید شما.</p>
          </div>

          <Link href="/shop">
            مشاهده همه ←
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="category-card"
            >
              <div className="category-visual">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 719px) 50vw, 25vw"
                    className="category-image"
                  />
                ) : (
                  <span className="category-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}

                <span className="category-overlay">
                  مشاهده محصولات
                </span>
              </div>

              <div className="category-card-info">
                <h3>{category.name}</h3>
                <span>مشاهده مجموعه ←</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}