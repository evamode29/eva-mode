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
    <section className="section" id="categories">
      <Container>
        <div className="section-heading">
          <span>01</span>

          <h2>دسته‌بندی‌ها</h2>

          <p>
            انتخابی ساده برای شروع.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="category-card"
            >
              <div className="visual-placeholder category-placeholder">
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3>{category.name}</h3>

              <span>مشاهده محصولات ←</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}