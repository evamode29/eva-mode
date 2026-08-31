import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";

type Order = {
id: string;
order_number: string;
customer_full_name: string;
customer_mobile: string;
total_amount: number;
status: string;
payment_status: string;
created_at: string;
};

async function getOrders(): Promise<Order[]> {
const { data, error } = await supabaseServer
.from("orders")
.select(
`       id,
      order_number,
      customer_full_name,
      customer_mobile,
      total_amount,
      status,
      payment_status,
      created_at
      `
)
.order("created_at", {
ascending: false,
});

if (error) {
console.error(
"Admin orders error:",
error
);

return [];


}

return (data ?? []) as Order[];
}

function formatPrice(value: number) {
return `${new Intl.NumberFormat("fa-IR").format(
    value
  )} تومان`;
}

function formatDate(value: string) {
try {
return new Intl.DateTimeFormat("fa-IR", {
dateStyle: "medium",
timeStyle: "short",
}).format(new Date(value));
} catch {
return value;
}
}

function statusLabel(status: string) {
switch (status) {
case "pending":
return "در انتظار بررسی";

case "paid":
  return "پرداخت شده";

case "processing":
  return "در حال پردازش";

case "shipped":
  return "ارسال شده";

case "delivered":
  return "تحویل شده";

case "cancelled":
  return "لغو شده";

default:
  return "نامشخص";


}
}

function statusClass(status: string) {
switch (status) {
case "pending":
return "bg-amber-50 text-amber-700 border-amber-200";


case "paid":
  return "bg-emerald-50 text-emerald-700 border-emerald-200";

case "processing":
  return "bg-blue-50 text-blue-700 border-blue-200";

case "shipped":
  return "bg-purple-50 text-purple-700 border-purple-200";

case "delivered":
  return "bg-green-50 text-green-700 border-green-200";

case "cancelled":
  return "bg-red-50 text-red-700 border-red-200";

default:
  return "bg-gray-50 text-gray-700 border-gray-200";


}
}

function paymentLabel(status: string) {
switch (status) {
case "paid":
return "پرداخت موفق";

case "failed":
  return "پرداخت ناموفق";

case "refunded":
  return "مسترد شده";

default:
  return "در انتظار پرداخت";


}
}

export default async function AdminOrdersPage() {
const orders = await getOrders();

const pendingCount = orders.filter(
(order) =>
order.status === "pending"
).length;

const processingCount = orders.filter(
(order) =>
order.status === "processing"
).length;

const deliveredCount = orders.filter(
(order) =>
order.status === "delivered"
).length;

const paidCount = orders.filter(
(order) =>
order.payment_status === "paid"
).length;

return ( <main
   dir="rtl"
   className="min-h-screen bg-[#f8f6f2] px-4 py-10 md:px-8"
 > <div className="mx-auto max-w-7xl">

```
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

      <div>
        <p className="text-xs font-medium tracking-[0.25em] text-[#9a8170]">
          EVA MODE
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[#24211f]">
          مدیریت سفارش‌ها
        </h1>

        <p className="mt-2 text-sm text-[#77716b]">
          مدیریت سفارش‌های ثبت‌شده فروشگاه
        </p>
      </div>

      <Link
        href="/admin"
        className="inline-flex w-fit items-center rounded-xl border border-[#ded5cc] bg-white px-5 py-3 text-sm font-medium text-[#24211f] transition hover:bg-[#f1ede7]"
      >
        بازگشت به پنل
      </Link>

    </div>

    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

      <div className="rounded-2xl border border-[#e7e0d8] bg-white p-6">
        <p className="text-sm text-[#77716b]">
          کل سفارش‌ها
        </p>

        <p className="mt-3 text-3xl font-semibold text-[#24211f]">
          {new Intl.NumberFormat("fa-IR").format(
            orders.length
          )}
        </p>
      </div>

      <div className="rounded-2xl border border-[#e7e0d8] bg-white p-6">
        <p className="text-sm text-[#77716b]">
          در انتظار بررسی
        </p>

        <p className="mt-3 text-3xl font-semibold text-[#24211f]">
          {new Intl.NumberFormat("fa-IR").format(
            pendingCount
          )}
        </p>
      </div>

      <div className="rounded-2xl border border-[#e7e0d8] bg-white p-6">
        <p className="text-sm text-[#77716b]">
          پرداخت موفق
        </p>

        <p className="mt-3 text-3xl font-semibold text-[#24211f]">
          {new Intl.NumberFormat("fa-IR").format(
            paidCount
          )}
        </p>
      </div>

      <div className="rounded-2xl border border-[#e7e0d8] bg-white p-6">
        <p className="text-sm text-[#77716b]">
          تحویل شده
        </p>

        <p className="mt-3 text-3xl font-semibold text-[#24211f]">
          {new Intl.NumberFormat("fa-IR").format(
            deliveredCount
          )}
        </p>
      </div>

    </div>

    <section className="overflow-hidden rounded-2xl border border-[#e7e0d8] bg-white">

      <div className="border-b border-[#eee8e1] px-6 py-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-[#24211f]">
              لیست سفارش‌ها
            </h2>

            <p className="mt-1 text-xs text-[#99918a]">
              {new Intl.NumberFormat("fa-IR").format(
                processingCount
              )}{" "}
              سفارش در حال پردازش
            </p>
          </div>

          <span className="text-sm text-[#77716b]">
            جدیدترین سفارش‌ها ابتدا نمایش داده می‌شوند
          </span>

        </div>
      </div>

      {orders.length === 0 ? (
        <div className="px-6 py-20 text-center">

          <div className="text-5xl">
            📦
          </div>

          <h3 className="mt-5 text-xl font-semibold text-[#24211f]">
            هنوز سفارشی ثبت نشده است
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#77716b]">
            وقتی مشتری سفارشی ثبت کند،
            اطلاعات سفارش در این بخش نمایش داده می‌شود.
          </p>

          <Link
            href="/shop"
            className="mt-7 inline-flex rounded-xl bg-[#24211f] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            مشاهده فروشگاه
          </Link>

        </div>
      ) : (

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px] text-right">

            <thead>
              <tr className="border-b border-[#eee8e1] bg-[#faf8f5] text-sm text-[#77716b]">

                <th className="px-6 py-4 font-medium">
                  سفارش
                </th>

                <th className="px-6 py-4 font-medium">
                  مشتری
                </th>

                <th className="px-6 py-4 font-medium">
                  مبلغ
                </th>

                <th className="px-6 py-4 font-medium">
                  سفارش
                </th>

                <th className="px-6 py-4 font-medium">
                  پرداخت
                </th>

                <th className="px-6 py-4 font-medium">
                  تاریخ
                </th>

                <th className="px-6 py-4 font-medium">
                  عملیات
                </th>

              </tr>
            </thead>

            <tbody>

              {orders.map((order) => (

                <tr
                  key={order.id}
                  className="border-b border-[#f0ebe5] last:border-b-0 transition hover:bg-[#fcfaf7]"
                >

                  <td className="px-6 py-5">

                    <div className="font-semibold text-[#24211f]">
                      {order.order_number}
                    </div>

                    <div className="mt-1 text-xs text-[#99918a]">
                      {order.id.slice(0, 8)}
                    </div>

                  </td>

                  <td className="px-6 py-5">

                    <div className="font-medium text-[#24211f]">
                      {order.customer_full_name}
                    </div>

                    <div className="mt-1 text-xs text-[#77716b]">
                      {order.customer_mobile}
                    </div>

                  </td>

                  <td className="px-6 py-5">

                    <span className="font-medium text-[#24211f]">
                      {formatPrice(
                        Number(
                          order.total_amount
                        )
                      )}
                    </span>

                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${statusClass(
                        order.status
                      )}`}
                    >
                      {statusLabel(
                        order.status
                      )}
                    </span>

                  </td>

                  <td className="px-6 py-5">

                    <span className="text-xs text-[#77716b]">
                      {paymentLabel(
                        order.payment_status
                      )}
                    </span>

                  </td>

                  <td className="px-6 py-5 text-sm text-[#77716b]">
                    {formatDate(
                      order.created_at
                    )}
                  </td>

                  <td className="px-6 py-5">

                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex rounded-lg border border-[#ded5cc] px-4 py-2 text-xs font-medium text-[#24211f] transition hover:bg-[#f1ede7]"
                    >
                      مشاهده جزئیات
                    </Link>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </section>

  </div>
</main>

);
}
