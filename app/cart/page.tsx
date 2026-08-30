"use client";

import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartContext";

function formatPrice(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart();

  return (
    <>
      <Header />

      <main>
        <section className="page-section">
          <Container>
            <div className="page-heading">
              <span className="eyebrow">
                BAG / {String(totalItems).padStart(2, "0")}
              </span>

              <h1>سبد خرید</h1>
            </div>

            {items.length === 0 ? (
              <div className="cart-empty">
                <h2>سبد خرید شما خالی است.</h2>

                <p>
                  محصولات مورد علاقه‌تان را انتخاب کنید و به سبد خرید
                  اضافه کنید.
                </p>

                <Link href="/shop">
                  <Button variant="secondary">
                    ادامه خرید
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="cart-layout">
                <div className="cart-items">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="cart-item"
                    >
                      <div className="cart-image">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={180}
                            height={220}
                            className="cart-image-real"
                          />
                        ) : (
                          <div className="visual-placeholder">
                            <span>IMAGE</span>
                          </div>
                        )}
                      </div>

                      <div className="cart-item-info">
                        <h2>{item.name}</h2>

                        <p>
                          رنگ: {item.colorName}
                          {" · "}
                          سایز: {item.sizeName}
                        </p>

                        <div className="cart-item-bottom">
                          <div className="quantity-control">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity - 1
                                )
                              }
                              aria-label="کاهش تعداد"
                            >
                              −
                            </button>

                            <span>
                              {formatPrice(item.quantity)}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity + 1
                                )
                              }
                              aria-label="افزایش تعداد"
                            >
                              +
                            </button>
                          </div>

                          <strong>
                            {formatPrice(
                              item.price * item.quantity
                            )}{" "}
                            تومان
                          </strong>
                        </div>

                        <button
                          type="button"
                          className="text-button"
                          onClick={() =>
                            removeItem(item.id)
                          }
                        >
                          حذف محصول
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <aside className="summary-card">
                  <h2>خلاصه سفارش</h2>

                  <div>
                    <span>تعداد کالا</span>
                    <strong>
                      {formatPrice(totalItems)}
                    </strong>
                  </div>

                  <div>
                    <span>جمع کل</span>
                    <strong>
                      {formatPrice(totalPrice)} تومان
                    </strong>
                  </div>

                  <hr />

                  <div>
                    <span>مبلغ قابل پرداخت</span>
                    <strong>
                      {formatPrice(totalPrice)} تومان
                    </strong>
                  </div>

                  <Link
                    href="/checkout"
                    className="cart-checkout-link"
                  >
                    <Button>
                      ادامه به پرداخت
                    </Button>
                  </Link>

                  <Link
                    href="/shop"
                    className="cart-continue-link"
                  >
                    <Button variant="secondary">
                      ادامه خرید
                    </Button>
                  </Link>
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