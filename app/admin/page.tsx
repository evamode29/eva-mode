import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";

type Order = {
  id: string;
  order_number: string;
  customer_full_name: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function formatPrice(value: number) {
  return `${formatNumber(value)} تومان`;
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

async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabaseServer
    .from("orders")
    .select(
      `
        id,
        order_number,
        customer_full_name,
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
    console.error("Admin dashboard orders error:", error);
    return [];
  }

  return (data ?? []) as Order[];
}

export default async function AdminPage() {
  const orders = await getOrders();

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "processing"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  const paidOrders = orders.filter(
    (order) => order.payment_status === "paid"
  ).length;

  const totalSales = orders
    .filter((order) => order.payment_status === "paid")
    .reduce(
      (total, order) =>
        total + Number(order.total_amount || 0),
      0
    );

  const recentOrders = orders.slice(0, 6);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f8f6f2]"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">

        {/* Header */}
        <header className="mb-10">

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>
              <p className="text-xs font-medium tracking-[0.28em] text-[#9a8170]">
                EVA MODE / ADMIN
              </p>

              <h1 className="mt-3 text-3xl font-semibold text-[#24211f] md:text-4xl">
                داشبورد مدیریت
              </h1>

              <p className="mt-3 text-sm leading-7 text-[#77716b]">
                مدیریت فروشگاه، سفارش‌ها و عملکرد EVA MODE
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-xl border border-[#ded5cc] bg-white px-5 py-3 text-sm font-medium text-[#24211f] transition hover:bg-[#f1ede7]"
              >
                مشاهده فروشگاه
                <span className="mr-2">←</span>
              </Link>

              <Link
                href="/admin/orders"
                className="inline-flex items-center justify-center rounded-xl bg-[#24211f] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                مدیریت سفارش‌ها
                <span className="mr-2">←</span>
              </Link>

            </div>

          </div>

        </header>

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

          {/* Sales */}
          <div className="rounded-2xl border border-[#e7e0d8] bg-white p-6">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-[#77716b]">
                  فروش ثبت‌شده
                </p>

                <p className="mt-3 text-xl font-semibold leading-8 text-[#24211f]">
                  {formatPrice(totalSales)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1ede7] text-lg">
                ﷼
              </div>

            </div>
          </div>

          {/* Orders */}
          <div className="rounded-2xl border border-[#e7e0d8] bg-white p-6">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-[#77716b]">
                  کل سفارش‌ها
                </p>

                <p className="mt-3 text-3xl font-semibold text-[#24211f]">
                  {formatNumber(totalOrders)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1ede7] text-lg">
                📦
              </div>

            </div>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-[#e7e0d8] bg-white p-6">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-[#77716b]">
                  در انتظار بررسی
                </p>

                <p className="mt-3 text-3xl font-semibold text-[#24211f]">
                  {formatNumber(pendingOrders)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-lg">
                ⏳
              </div>

            </div>
          </div>

          {/* Processing */}
          <div className="rounded-2xl border border-[#e7e0d8] bg-white p-6">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-[#77716b]">
                  در حال پردازش
                </p>

                <p className="mt-3 text-3xl font-semibold text-[#24211f]">
                  {formatNumber(processingOrders)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg">
                ⚙
              </div>

            </div>
          </div>

          {/* Delivered */}
          <div className="rounded-2xl border border-[#e7e0d8] bg-white p-6">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-[#77716b]">
                  تحویل شده
                </p>

                <p className="mt-3 text-3xl font-semibold text-[#24211f]">
                  {formatNumber(deliveredOrders)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-lg">
                ✓
              </div>

            </div>
          </div>

        </section>

        {/* Main Grid */}
        <section className="grid gap-6 lg:grid-cols-3">

          {/* Recent Orders */}
          <div className="overflow-hidden rounded-2xl border border-[#e7e0d8] bg-white lg:col-span-2">

            <div className="flex flex-col gap-3 border-b border-[#eee8e1] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs tracking-[0.15em] text-[#9a8170]">
                  ORDERS
                </p>

                <h2 className="mt-1 text-lg font-semibold text-[#24211f]">
                  آخرین سفارش‌ها
                </h2>
              </div>

              <Link
                href="/admin/orders"
                className="text-sm font-medium text-[#9a8170] transition hover:text-[#24211f]"
              >
                مشاهده همه ←
              </Link>

            </div>

            {recentOrders.length === 0 ? (

              <div className="px-6 py-16 text-center">

                <div className="text-5xl">
                  📦
                </div>

                <h3 className="mt-5 text-lg font-semibold text-[#24211f]">
                  هنوز سفارشی ثبت نشده است
                </h3>

                <p className="mt-2 text-sm leading-7 text-[#77716b]">
                  سفارش‌های جدید مشتریان در این قسمت نمایش داده می‌شوند.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[720px] text-right">

                  <thead>
                    <tr className="border-b border-[#eee8e1] bg-[#faf8f5] text-xs text-[#77716b]">

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
                        وضعیت
                      </th>

                      <th className="px-6 py-4 font-medium">
                        تاریخ
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {recentOrders.map((order) => (

                      <tr
                        key={order.id}
                        className="border-b border-[#f0ebe5] last:border-0 transition hover:bg-[#fcfaf7]"
                      >

                        <td className="px-6 py-5">

                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="font-semibold text-[#24211f] hover:text-[#9a8170]"
                          >
                            {order.order_number}
                          </Link>

                        </td>

                        <td className="px-6 py-5">

                          <p className="font-medium text-[#24211f]">
                            {order.customer_full_name || "—"}
                          </p>

                        </td>

                        <td className="px-6 py-5 text-sm text-[#24211f]">
                          {formatPrice(
                            Number(order.total_amount || 0)
                          )}
                        </td>

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${statusClass(
                              order.status
                            )}`}
                          >
                            {statusLabel(order.status)}
                          </span>

                        </td>

                        <td className="px-6 py-5 text-xs text-[#77716b]">
                          {formatDate(order.created_at)}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

          {/* Quick Access */}
          <aside className="rounded-2xl border border-[#e7e0d8] bg-white">

            <div className="border-b border-[#eee8e1] px-6 py-5">

              <p className="text-xs tracking-[0.15em] text-[#9a8170]">
                QUICK ACCESS
              </p>

              <h2 className="mt-1 text-lg font-semibold text-[#24211f]">
                دسترسی سریع
              </h2>

            </div>

            <div className="p-4">

              <Link
                href="/admin/orders"
                className="group flex items-center gap-4 rounded-xl p-4 transition hover:bg-[#faf8f5]"
              >

                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f1ede7] text-lg">
                  📦
                </span>

                <span className="flex-1">
                  <strong className="block text-sm font-medium text-[#24211f]">
                    سفارش‌ها
                  </strong>

                  <small className="mt-1 block text-xs text-[#99918a]">
                    مشاهده و مدیریت سفارش‌ها
                  </small>
                </span>

                <span className="text-[#9a8170] transition group-hover:-translate-x-1">
                  ←
                </span>

              </Link>

              <Link
                href="/shop"
                className="group flex items-center gap-4 rounded-xl p-4 transition hover:bg-[#faf8f5]"
              >

                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f1ede7] text-lg">
                  🛍
                </span>

                <span className="flex-1">
                  <strong className="block text-sm font-medium text-[#24211f]">
                    فروشگاه
                  </strong>

                  <small className="mt-1 block text-xs text-[#99918a]">
                    مشاهده فروشگاه به عنوان مشتری
                  </small>
                </span>

                <span className="text-[#9a8170] transition group-hover:-translate-x-1">
                  ←
                </span>

              </Link>

              <div className="my-2 border-t border-[#eee8e1]" />

              <div className="rounded-xl bg-[#faf8f5] p-4">

                <div className="flex items-center justify-between">

                  <span className="text-xs text-[#77716b]">
                    پرداخت‌های موفق
                  </span>

                  <strong className="text-lg text-[#24211f]">
                    {formatNumber(paidOrders)}
                  </strong>

                </div>

              </div>

            </div>

          </aside>

        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-[#e7e0d8] pt-6">

          <div className="flex flex-col gap-2 text-xs text-[#99918a] sm:flex-row sm:items-center sm:justify-between">

            <span>
              EVA MODE / MANAGEMENT
            </span>

            <span>
              پنل مدیریت فروشگاه
            </span>

          </div>

        </footer>

      </div>
    </main>
  );
}