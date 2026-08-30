import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function AdminPage() {
  return (
    <main>
      <section className="page-section">
        <Container>
          <div className="page-heading">
            <span className="eyebrow">EVA MODE / ADMIN</span>
            <h1>مدیریت فروشگاه</h1>
            <p>مدیریت سفارش‌ها و اطلاعات فروشگاه</p>
          </div>

          <div className="admin-grid">
            <Link href="/admin/orders" className="admin-card">
              <span className="eyebrow">ORDERS</span>
              <h2>سفارش‌ها</h2>
              <p>مشاهده و مدیریت سفارش‌های مشتریان</p>
            </Link>

            <Link href="/shop" className="admin-card">
              <span className="eyebrow">STORE</span>
              <h2>مشاهده فروشگاه</h2>
              <p>بازگشت به فروشگاه EVA MODE</p>
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}