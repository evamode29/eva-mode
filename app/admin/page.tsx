import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f8f6f2] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-2 text-sm tracking-[0.2em] text-[#9a8170]">
            EVA MODE
          </p>

          <h1 className="text-3xl font-semibold text-[#24211f]">
            پنل مدیریت
          </h1>

          <p className="mt-3 text-[#77716b]">
            مدیریت فروشگاه و سفارش‌های EVA MODE
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/admin/orders"
            className="group rounded-2xl border border-[#e7e0d8] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1ede7] text-xl">
              🛍️
            </div>

            <h2 className="text-xl font-semibold text-[#24211f]">
              سفارش‌ها
            </h2>

            <p className="mt-2 text-sm leading-7 text-[#77716b]">
              مشاهده، بررسی و مدیریت سفارش‌های ثبت‌شده مشتریان
            </p>

            <div className="mt-6 text-sm font-medium text-[#9a8170]">
              ورود به سفارش‌ها ←
            </div>
          </Link>

          <Link
            href="/shop"
            className="group rounded-2xl border border-[#e7e0d8] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1ede7] text-xl">
              🛒
            </div>

            <h2 className="text-xl font-semibold text-[#24211f]">
              مشاهده فروشگاه
            </h2>

            <p className="mt-2 text-sm leading-7 text-[#77716b]">
              بازگشت به فروشگاه و مشاهده محصولات همانند مشتری
            </p>

            <div className="mt-6 text-sm font-medium text-[#9a8170]">
              مشاهده فروشگاه ←
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}