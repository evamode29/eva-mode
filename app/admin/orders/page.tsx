import Link from "next/link";

type Order = {
  id: string;
  customer_name?: string | null;
  customer_phone?: string | null;
  total_amount?: number | null;
  status?: string | null;
  created_at?: string | null;
};

async function getOrders(): Promise<Order[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/orders`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return data;
    }

    return Array.isArray(data.orders) ? data.orders : [];
  } catch {
    return [];
  }
}

function formatPrice(value?: number | null) {
  if (!value) {
    return "۰ تومان";
  }

  return `${new Intl.NumberFormat("fa-IR").format(value)} تومان`;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function statusLabel(status?: string | null) {
  switch (status) {
    case "pending":
      return "در انتظار بررسی";

    case "processing":
      return "در حال پردازش";

    case "shipped":
      return "ارسال شده";

    case "delivered":
      return "تحویل شده";

    case "cancelled":
      return "لغو شده";

    default:
      return status || "نامشخص";
  }
}

function statusClass(status?: string | null) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";

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

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <main className="min-h-screen bg-[#f8f6f2] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-xs font-medium tracking-[0.25em] text-[#9a8170]">
              EVA MODE
            </p>

            <h1 className="mt-3 text-3xl font-semibold text-[#24211f]">
              مدیریت سفارش‌ها
            </h1>

            <p className="mt-2 text-sm text-[#77716b]">
              مشاهده و مدیریت سفارش‌های ثبت‌شده در فروشگاه
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex w-fit items-center rounded-xl border border-[#ded5cc] bg-white px-5 py-3 text-sm font-medium text-[#24211f] transition hover:bg-[#f1ede7]"
          >
            ← بازگشت به پنل
          </Link>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-[#e7e0d8] bg-white p-6">
            <p className="text-sm text-[#77716b]">
              کل سفارش‌ها
            </p>

            <p className="mt-3 text-3xl font-semibold text-[#24211f]">
              {new Intl.NumberFormat("fa-IR").format(orders.length)}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e7e0d8] bg-white p-6">
            <p className="text-sm text-[#77716b]">
              در انتظار بررسی
            </p>

            <p className="mt-3 text-3xl font-semibold text-[#24211f]">
              {new Intl.NumberFormat("fa-IR").format(
                orders.filter(
                  (order) =>
                    !order.status || order.status === "pending"
                ).length
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e7e0d8] bg-white p-6">
            <p className="text-sm text-[#77716b]">
              در حال پردازش
            </p>

            <p className="mt-3 text-3xl font-semibold text-[#24211f]">
              {new Intl.NumberFormat("fa-IR").format(
                orders.filter(
                  (order) => order.status === "processing"
                ).length
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e7e0d8] bg-white p-6">
            <p className="text-sm text-[#77716b]">
              تحویل شده
            </p>

            <p className="mt-3 text-3xl font-semibold text-[#24211f]">
              {new Intl.NumberFormat("fa-IR").format(
                orders.filter(
                  (order) => order.status === "delivered"
                ).length
              )}
            </p>
          </div>
        </div>

        {/* Orders */}
        <section className="overflow-hidden rounded-2xl border border-[#e7e0d8] bg-white">

          <div className="border-b border-[#eee8e1] px-6 py-5">
            <h2 className="text-lg font-semibold text-[#24211f]">
              لیست سفارش‌ها
            </h2>
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
                وقتی مشتری سفارشی ثبت کند، اطلاعات سفارش در این بخش
                نمایش داده خواهد شد.
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

              <table className="w-full min-w-[850px] text-right">

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
                      وضعیت
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

                        <div className="font-medium text-[#24211f]">
                          #{order.id.slice(0, 8)}
                        </div>

                        <div className="mt-1 text-xs text-[#99918a]">
                          شناسه سفارش
                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <div className="font-medium text-[#24211f]">
                          {order.customer_name || "بدون نام"}
                        </div>

                        <div className="mt-1 text-xs text-[#77716b]">
                          {order.customer_phone || "شماره ثبت نشده"}
                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <span className="font-medium text-[#24211f]">
                          {formatPrice(order.total_amount)}
                        </span>

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

                      <td className="px-6 py-5 text-sm text-[#77716b]">
                        {formatDate(order.created_at)}
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