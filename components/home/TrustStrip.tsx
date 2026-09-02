import { Container } from "@/components/ui/Container";

const items = [
  { number: "01", title: "انتخاب با دقت", text: "محصولات منتخب برای EVA MODE" },
  { number: "02", title: "خرید مطمئن", text: "فرآیند خرید ساده و شفاف" },
  { number: "03", title: "ارسال سریع", text: "آماده‌سازی سفارش در کوتاه‌ترین زمان" },
  { number: "04", title: "پشتیبانی", text: "همراه شما در مسیر خرید" },
];

export function TrustStrip() {
  return (
    <section className="home-trust-strip" aria-label="مزایای خرید از EVA MODE">
      <Container>
        <div className="home-trust-grid">
          {items.map((item) => (
            <div className="home-trust-item" key={item.number}>
              <span className="home-trust-number">{item.number}</span>
              <div>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
