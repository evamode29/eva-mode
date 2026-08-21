import { Container } from "@/components/ui/Container";

const categories = ["سوتین", "شورت", "ست لباس زیر", "لباس خواب"];

export function CategorySection() {
  return (
    <section className="section" id="categories">
      <Container>
        <div className="section-heading"><span>01</span><h2>دسته‌بندی‌ها</h2><p>انتخابی ساده برای شروع.</p></div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <article className="category-card" key={category}>
              <div className="visual-placeholder category-placeholder"><span>0{index + 1}</span></div>
              <h3>{category}</h3>
              <span>مشاهده</span>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
