"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const fields = [
  "نام و نام خانوادگی",
  "شماره موبایل",
  "استان",
  "شهر",
  "آدرس",
  "کد پستی",
];

export default function CheckoutPage() {
  return (
    <>
      <Header />

      <main>
        <section className="page-section">
          <Container>
            <div className="page-heading">
              <span className="eyebrow">CHECKOUT / 01</span>
              <h1>تکمیل سفارش</h1>
            </div>

            <div className="checkout-layout">
              <form
                className="checkout-form"
                onSubmit={(event) => event.preventDefault()}
              >
                <h2>اطلاعات گیرنده</h2>

                {fields.map((field) => (
                  <label key={field}>
                    {field}
                    <input placeholder={field} />
                  </label>
                ))}

                <p className="form-note">
                  این فرم در این مرحله صرفاً رابط کاربری نمایشی است.
                </p>
              </form>

              <aside className="summary-card">
                <h2>خلاصه سفارش</h2>

                <div>
                  <span>محصولات</span>
                  <strong>۱,۴۹۰,۰۰۰ تومان</strong>
                </div>

                <div>
                  <span>ارسال</span>
                  <strong>محاسبه بعداً</strong>
                </div>

                <hr />

                <div>
                  <span>مبلغ نهایی</span>
                  <strong>۱,۴۹۰,۰۰۰ تومان</strong>
                </div>

                <Button type="button">پرداخت</Button>
              </aside>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}