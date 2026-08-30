import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { supabaseServer } from "@/lib/supabase-server";
import OrderStatus from "./OrderStatus";

function formatPrice(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "در انتظار",
    paid: "پرداخت شده",
    processing: "در حال پردازش",
    shipped: "ارسال شده",
    delivered: "تحویل شده",
    cancelled: "لغو شده",
  };

  return labels[status] ?? status;
}

export default async function AdminOrdersPage() {
  const { data: orders, error } = await supabaseServer
    .from("orders")
    .select(
      `
      id,
      order_number,
      customer_full_name,
      customer_mobile,
      city,
      total_amount,
      status,
      payment_status,
      created_at
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main>
        <section className="page-section">
          <Container>
            <h1>خطا در دریافت سفارش‌ها</h1>
            <p>{error.message}</p>
          </Container>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="page-section">
        <Container>
          <div className="page-heading">
            <span className="eyebrow">ADMIN / ORDERS</span>
            <h1>سفارش‌ها</h1>
            <p>
              تعداد سفارش‌ها:{" "}
              {formatPrice(orders?.length ?? 0)}
            </p>
          </div>

          {!orders || orders.length === 0 ? (
            <div className="cart-empty">
              <h2>هنوز سفارشی ثبت نشده است.</h2>
            </div>
          ) : (
            <div className="admin-orders">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="admin-order-card"
                >
                  <div>
                    <span className="eyebrow">
                      {order.order_number}
                    </span>

                    <h2>{order.customer_full_name}</h2>

                    <p>
                      {order.customer_mobile} · {order.city}
                    </p>
                  </div>

                  <div>
                    <strong>
                      {formatPrice(
                        Number(order.total_amount)
                      )}{" "}
                      تومان
                    </strong>

                    <p>
                      وضعیت فعلی:{" "}
                      {statusLabel(order.status)}
                    </p>

                    <p>
                      پرداخت:{" "}
                      {order.payment_status === "paid"
                        ? "پرداخت شده"
                        : "در انتظار پرداخت"}
                    </p>

                    <OrderStatus
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}

          <div style={{ marginTop: "24px" }}>
            <Link href="/admin">← بازگشت به مدیریت</Link>
          </div>
        </Container>
      </section>
    </main>
  );
}