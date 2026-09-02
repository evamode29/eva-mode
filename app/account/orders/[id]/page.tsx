import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "full", timeStyle: "short" }).format(new Date(value));
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "در انتظار بررسی",
    processing: "در حال پردازش",
    shipped: "ارسال شده",
    delivered: "تحویل شده",
    cancelled: "لغو شده",
  };
  return labels[status] ?? status;
}

export default async function CustomerOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, order_number, customer_full_name, customer_mobile, province, city, address, postal_code, subtotal, shipping_amount, total_amount, status, payment_status, created_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("id, product_id, product_name, sku, color_name, size_name, unit_price, quantity, line_total")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8f6f2] px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs tracking-[0.25em] text-[#9a8170]">EVA MODE / ORDER</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#24211f]">جزئیات سفارش</h1>
            <p className="mt-2 text-sm text-[#77716b]">{order.order_number} · {formatDate(order.created_at)}</p>
          </div>
          <Link href="/account" className="text-sm text-[#9a8170]">← بازگشت به سفارش‌های من</Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
          <section className="rounded-3xl border border-[#e7e0d8] bg-white p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee8e1] pb-5">
              <div>
                <p className="text-xs text-[#99918a]">شماره سفارش</p>
                <h2 className="mt-1 text-lg font-semibold text-[#24211f]">{order.order_number}</h2>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="rounded-full bg-[#f1ede7] px-3 py-2 text-[#6f665e]">{statusLabel(order.status)}</span>
                <span className="rounded-full border border-[#e7e0d8] px-3 py-2 text-[#6f665e]">پرداخت: {order.payment_status === "paid" ? "موفق" : "در انتظار"}</span>
              </div>
            </div>

            <div className="divide-y divide-[#eee8e1]">
              {(items ?? []).map((item) => (
                <div key={item.id} className="py-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-medium text-[#24211f]">{item.product_name}</h3>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#77716b]">
                        <span>SKU: {item.sku}</span>
                        {item.color_name && <span>رنگ: {item.color_name}</span>}
                        {item.size_name && <span>سایز: {item.size_name}</span>}
                        <span>تعداد: {formatPrice(item.quantity)}</span>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-[#24211f]">{formatPrice(Number(item.line_total))} تومان</div>
                  </div>
                  <p className="mt-2 text-xs text-[#99918a]">قیمت واحد: {formatPrice(Number(item.unit_price))} تومان</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-[#e7e0d8] bg-white p-6">
              <h2 className="text-lg font-semibold text-[#24211f]">خلاصه پرداخت</h2>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between gap-4"><span className="text-[#77716b]">جمع محصولات</span><strong>{formatPrice(Number(order.subtotal))} تومان</strong></div>
                <div className="flex justify-between gap-4"><span className="text-[#77716b]">هزینه ارسال</span><strong>{Number(order.shipping_amount) === 0 ? "رایگان" : `${formatPrice(Number(order.shipping_amount))} تومان`}</strong></div>
                <div className="border-t border-[#eee8e1] pt-4 flex justify-between gap-4"><span className="font-medium">مبلغ نهایی</span><strong>{formatPrice(Number(order.total_amount))} تومان</strong></div>
              </div>
            </section>

            <section className="rounded-3xl border border-[#e7e0d8] bg-white p-6">
              <h2 className="text-lg font-semibold text-[#24211f]">اطلاعات ارسال</h2>
              <div className="mt-5 space-y-3 text-sm text-[#77716b]">
                <p><strong className="text-[#24211f]">گیرنده:</strong> {order.customer_full_name}</p>
                <p><strong className="text-[#24211f]">موبایل:</strong> {order.customer_mobile}</p>
                <p><strong className="text-[#24211f]">نشانی:</strong> {order.province}، {order.city}، {order.address}</p>
                <p><strong className="text-[#24211f]">کد پستی:</strong> {order.postal_code}</p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
