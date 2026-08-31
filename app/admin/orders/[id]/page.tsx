import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import OrderStatus from "../OrderStatus";

type PageProps = {
params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailsPage({
params,
}: PageProps) {
const { id } = await params;

const { data: order, error } = await supabaseServer
.from("orders")
.select(
`       *,
      order_items (
        id,
        product_id,
        variant_id,
        product_name,
        sku,
        color_name,
        size_name,
        unit_price,
        quantity,
        line_total
      )
    `
)
.eq("id", id)
.single();

if (error || !order) {
notFound();
}

const items = order.order_items ?? [];

return ( <main className="min-h-screen bg-[#f8f6f2] px-4 py-10 md:px-8"> <div className="mx-auto max-w-6xl">

```
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-medium tracking-[0.25em] text-[#9a8170]">
          EVA MODE
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[#24211f]">
          جزئیات سفارش
        </h1>

        <p className="mt-2 text-sm text-[#77716b]">
          سفارش {order.order_number}
        </p>
      </div>

      <Link
        href="/admin/orders"
        className="inline-flex w-fit rounded-xl border border-[#ded5cc] bg-white px-5 py-3 text-sm font-medium text-[#24211f] transition hover:bg-[#f1ede7]"
      >
        ← بازگشت به سفارش‌ها
      </Link>
    </div>

    <div className="mb-6 grid gap-6 md:grid-cols-3">

      <section className="rounded-2xl border border-[#e7e0d8] bg-white p-6 md:col-span-2">
        <p className="text-sm text-[#77716b]">
          شماره سفارش
        </p>

        <p className="mt-2 text-xl font-semibold text-[#24211f]">
          {order.order_number}
        </p>

        <div className="mt-6">
          <p className="mb-3 text-sm text-[#77716b]">
            وضعیت سفارش
          </p>

          <OrderStatus
            orderId={order.id}
            currentStatus={order.status}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-[#e7e0d8] bg-white p-6">
        <p className="text-sm text-[#77716b]">
          مبلغ نهایی
        </p>

        <p className="mt-3 text-2xl font-semibold text-[#24211f]">
          {new Intl.NumberFormat("fa-IR").format(
            Number(order.total_amount ?? 0)
          )}{" "}
          تومان
        </p>
      </section>
    </div>

    <div className="mb-6 grid gap-6 md:grid-cols-2">

      <section className="rounded-2xl border border-[#e7e0d8] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#24211f]">
          اطلاعات مشتری
        </h2>

        <div className="mt-6 space-y-4">

          <div>
            <p className="text-xs text-[#99918a]">
              نام و نام خانوادگی
            </p>

            <p className="mt-1 text-sm text-[#24211f]">
              {order.customer_full_name || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#99918a]">
              شماره موبایل
            </p>

            <p className="mt-1 text-sm text-[#24211f]">
              {order.customer_mobile || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#99918a]">
              استان
            </p>

            <p className="mt-1 text-sm text-[#24211f]">
              {order.province || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#99918a]">
              شهر
            </p>

            <p className="mt-1 text-sm text-[#24211f]">
              {order.city || "—"}
            </p>
          </div>

        </div>
      </section>

      <section className="rounded-2xl border border-[#e7e0d8] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#24211f]">
          آدرس ارسال
        </h2>

        <div className="mt-6 space-y-4">

          <div>
            <p className="text-xs text-[#99918a]">
              آدرس
            </p>

            <p className="mt-2 text-sm leading-7 text-[#24211f]">
              {order.address || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#99918a]">
              کد پستی
            </p>

            <p className="mt-1 text-sm text-[#24211f]">
              {order.postal_code || "—"}
            </p>
          </div>

        </div>
      </section>
    </div>

    <section className="overflow-hidden rounded-2xl border border-[#e7e0d8] bg-white">

      <div className="border-b border-[#eee8e1] px-6 py-5">
        <h2 className="text-lg font-semibold text-[#24211f]">
          محصولات سفارش
        </h2>
      </div>

      {items.length === 0 ? (
        <div className="px-6 py-16 text-center text-sm text-[#77716b]">
          محصولی برای این سفارش ثبت نشده است.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-right">

            <thead>
              <tr className="border-b border-[#eee8e1] bg-[#faf8f5] text-sm text-[#77716b]">
                <th className="px-6 py-4 font-medium">
                  محصول
                </th>

                <th className="px-6 py-4 font-medium">
                  مشخصات
                </th>

                <th className="px-6 py-4 font-medium">
                  تعداد
                </th>

                <th className="px-6 py-4 font-medium">
                  قیمت واحد
                </th>

                <th className="px-6 py-4 font-medium">
                  جمع
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map(
                (item: {
                  id: string;
                  product_name: string;
                  sku: string;
                  color_name: string | null;
                  size_name: string | null;
                  unit_price: number;
                  quantity: number;
                  line_total: number;
                }) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#f0ebe5] last:border-0"
                  >
                    <td className="px-6 py-5">
                      <p className="font-medium text-[#24211f]">
                        {item.product_name}
                      </p>

                      <p className="mt-1 text-xs text-[#99918a]">
                        SKU: {item.sku}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-[#77716b]">
                      <div className="space-y-1">
                        <p>
                          رنگ: {item.color_name || "—"}
                        </p>

                        <p>
                          سایز: {item.size_name || "—"}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-[#24211f]">
                      {new Intl.NumberFormat("fa-IR").format(
                        item.quantity
                      )}
                    </td>

                    <td className="px-6 py-5 text-sm text-[#24211f]">
                      {new Intl.NumberFormat("fa-IR").format(
                        Number(item.unit_price)
                      )}{" "}
                      تومان
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-[#24211f]">
                      {new Intl.NumberFormat("fa-IR").format(
                        Number(item.line_total)
                      )}{" "}
                      تومان
                    </td>
                  </tr>
                )
              )}
            </tbody>

          </table>
        </div>
      )}

      <div className="border-t border-[#eee8e1] bg-[#faf8f5] px-6 py-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#77716b]">
            مبلغ نهایی
          </span>

          <span className="text-xl font-semibold text-[#24211f]">
            {new Intl.NumberFormat("fa-IR").format(
              Number(order.total_amount ?? 0)
            )}{" "}
            تومان
          </span>
        </div>
      </div>

    </section>
  </div>
</main>
);
}