"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartContext";

function formatPrice(value: number) {
return new Intl.NumberFormat("fa-IR").format(value);
}

type FormData = {
fullName: string;
mobile: string;
province: string;
city: string;
address: string;
postalCode: string;
};

type OrderResponse = {
success: boolean;
error?: string;
order?: {
id: string;
orderNumber: string;
totalAmount: number;
status: string;
paymentStatus: string;
};
};

export default function CheckoutPage() {
const {
items,
totalItems,
totalPrice,
clearCart,
} = useCart();

const [formData, setFormData] =
useState<FormData>({
fullName: "",
mobile: "",
province: "",
city: "",
address: "",
postalCode: "",
});

const [loading, setLoading] =
useState(false);

const [error, setError] =
useState("");

const [orderNumber, setOrderNumber] =
useState<string | null>(null);

function handleChange(
event: React.ChangeEvent<HTMLInputElement>
) {
const { name, value } = event.target;

setFormData((current) => ({
  ...current,
  [name]: value,
}));

if (error) {
  setError("");
}

}
async function handleSubmit(
event: React.FormEvent<HTMLFormElement>
) {
event.preventDefault();


if (loading) {
  return;
}

setError("");

if (items.length === 0) {
  setError(
    "سبد خرید شما خالی است."
  );
  return;
}

setLoading(true);

try {
  const response = await fetch(
    "/api/orders",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        customerFullName:
          formData.fullName,

        customerMobile:
          formData.mobile,

        province:
          formData.province,

        city:
          formData.city,

        address:
          formData.address,

        postalCode:
          formData.postalCode,

        items: items.map((item) => ({
          productId:
            item.productId,

          variantId:
            item.variantId,

          quantity:
            item.quantity,
        })),
      }),
    }
  );

  const data =
    (await response.json()) as OrderResponse;

  if (!response.ok) {
    throw new Error(
      data.error ||
        "ثبت سفارش انجام نشد."
    );
  }

  if (
    !data.success ||
    !data.order?.orderNumber
  ) {
    throw new Error(
      "پاسخ نامعتبر از سرور دریافت شد."
    );
  }

  clearCart();

  setOrderNumber(
    data.order.orderNumber
  );
} catch (error) {
  setError(
    error instanceof Error
      ? error.message
      : "خطایی هنگام ثبت سفارش رخ داد."
  );
} finally {
  setLoading(false);
}

}

return (
<> <Header />

```
  <main>
    <section className="page-section">
      <Container>
        <div className="page-heading">
          <span className="eyebrow">
            CHECKOUT / 01
          </span>

          <h1>
            تکمیل سفارش
          </h1>
        </div>

        {orderNumber ? (
          <div className="cart-empty">
            <span className="eyebrow">
              ORDER CONFIRMED
            </span>

            <h2>
              سفارش شما با موفقیت ثبت شد.
            </h2>

            <p>
              شماره سفارش:{" "}
              <strong>
                {orderNumber}
              </strong>
            </p>

            <p>
              سفارش شما با موفقیت در
              سیستم ثبت شد.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                justifyContent:
                  "center",
                marginTop: "24px",
              }}
            >
              <Link href="/shop">
                <Button>
                  ادامه خرید
                </Button>
              </Link>

              <Link href="/">
                <Button variant="secondary">
                  بازگشت به خانه
                </Button>
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="cart-empty">
            <h2>
              سبد خرید شما خالی است.
            </h2>

            <p>
              برای ادامه پرداخت ابتدا
              یک محصول به سبد خرید اضافه
              کنید.
            </p>

            <Link href="/shop">
              <Button variant="secondary">
                رفتن به فروشگاه
              </Button>
            </Link>
          </div>
        ) : (
          <div className="checkout-layout">
            <form
              className="checkout-form"
              onSubmit={handleSubmit}
            >
              <h2>
                اطلاعات گیرنده
              </h2>

              <label>
                نام و نام خانوادگی

                <input
                  name="fullName"
                  value={
                    formData.fullName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="نام و نام خانوادگی"
                  autoComplete="name"
                  required
                />
              </label>

              <label>
                شماره موبایل

                <input
                  name="mobile"
                  type="tel"
                  value={
                    formData.mobile
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="09xxxxxxxxx"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={11}
                  required
                />
              </label>

              <label>
                استان

                <input
                  name="province"
                  value={
                    formData.province
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="استان"
                  autoComplete="address-level1"
                  required
                />
              </label>

              <label>
                شهر

                <input
                  name="city"
                  value={
                    formData.city
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="شهر"
                  autoComplete="address-level2"
                  required
                />
              </label>

              <label>
                آدرس

                <input
                  name="address"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="آدرس کامل"
                  autoComplete="street-address"
                  required
                />
              </label>

              <label>
                کد پستی

                <input
                  name="postalCode"
                  value={
                    formData.postalCode
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="کد پستی ۱۰ رقمی"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={10}
                  required
                />
              </label>

              <p className="form-note">
                اطلاعات شما برای تکمیل
                سفارش و ارسال محصول
                استفاده خواهد شد.
              </p>

              {error && (
                <p
                  className="form-note"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "در حال ثبت سفارش..."
                  : "ثبت سفارش"}
              </Button>
            </form>

            <aside className="summary-card">
              <h2>
                خلاصه سفارش
              </h2>

              <div>
                <span>
                  محصولات (
                  {formatPrice(
                    totalItems
                  )}
                  )
                </span>

                <strong>
                  {formatPrice(
                    totalPrice
                  )}{" "}
                  تومان
                </strong>
              </div>

              <div>
                <span>
                  ارسال
                </span>

                <strong>
                  محاسبه بعداً
                </strong>
              </div>

              <hr />

              <div>
                <span>
                  مبلغ نهایی
                </span>

                <strong>
                  {formatPrice(
                    totalPrice
                  )}{" "}
                  تومان
                </strong>
              </div>

              <div className="checkout-products">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="checkout-product"
                  >
                    <div>
                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        {item.colorName}
                        {" · "}
                        {item.sizeName}
                        {" · "}
                        تعداد:{" "}
                        {formatPrice(
                          item.quantity
                        )}
                      </span>
                    </div>

                    <strong>
                      {formatPrice(
                        item.price *
                          item.quantity
                      )}{" "}
                      تومان
                    </strong>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}
      </Container>
    </section>
  </main>

  <Footer />
</>


);
}
