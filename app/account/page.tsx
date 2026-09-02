import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(value));
}

function statusLabel(status: string) {
  const labels: Record<string, string> = { pending: "در انتظار بررسی", processing: "در حال پردازش", shipped: "ارسال شده", delivered: "تحویل شده", cancelled: "لغو شده" };
  return labels[status] ?? status;
}

export default async function AccountPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from("profiles").select("full_name, mobile, role").eq("id", user.id).single(),
    supabase.from("orders").select("id, order_number, subtotal, shipping_amount, total_amount, status, payment_status, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8f6f2] px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><p className="text-xs tracking-[0.25em] text-[#9a8170]">EVA MODE / ACCOUNT</p><h1 className="mt-3 text-3xl font-semibold text-[#24211f]">حساب کاربری</h1><p className="mt-2 text-sm text-[#77716b]">مدیریت اطلاعات و سفارش‌های شما</p></div>
          <Link href="/shop" className="text-sm text-[#9a8170]">بازگشت به فروشگاه ←</Link>
        </div>
        <section className="rounded-3xl border border-[#e7e0d8] bg-white p-6 md:p-8">
          <div className="flex items-center gap-4 border-b border-[#eee8e1] pb-6"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f1ede7] text-xl">♙</div><div><h2 className="font-semibold text-[#24211f]">{profile?.full_name || "کاربر EVA MODE"}</h2><p className="mt-1 text-xs text-[#77716b]">{user.email}</p></div></div>
          <div className="grid gap-4 py-6 md:grid-cols-2"><div className="rounded-2xl bg-[#faf8f5] p-5"><span className="text-xs text-[#99918a]">شماره موبایل</span><p className="mt-2 text-sm text-[#24211f]">{profile?.mobile || "ثبت نشده"}</p></div><div className="rounded-2xl bg-[#faf8f5] p-5"><span className="text-xs text-[#99918a]">نوع حساب</span><p className="mt-2 text-sm text-[#24211f]">{profile?.role === "admin" ? "مدیر فروشگاه" : "مشتری"}</p></div></div>
          <div className="flex flex-wrap gap-3"><Link href="/shop" className="rounded-xl bg-[#24211f] px-5 py-3 text-sm text-white">ادامه خرید</Link>{profile?.role === "admin" && <Link href="/admin" className="rounded-xl border border-[#ded5cc] px-5 py-3 text-sm text-[#24211f]">ورود به پنل مدیریت</Link>}<form action="/auth/logout" method="post"><button type="submit" className="rounded-xl border border-red-200 px-5 py-3 text-sm text-red-600">خروج از حساب</button></form></div>
        </section>
        <section className="mt-6 rounded-3xl border border-[#e7e0d8] bg-white p-6 md:p-8">
          <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs tracking-[0.2em] text-[#9a8170]">ORDER HISTORY</p><h2 className="mt-2 text-xl font-semibold text-[#24211f]">سفارش‌های من</h2></div><span className="text-xs text-[#99918a]">{formatPrice(orders?.length ?? 0)} سفارش</span></div>
          {!orders?.length ? <div className="rounded-2xl bg-[#faf8f5] px-5 py-10 text-center"><p className="font-medium text-[#24211f]">هنوز سفارشی ثبت نکرده‌اید.</p><p className="mt-2 text-sm text-[#77716b]">محصولات مورد علاقه‌تان را انتخاب کنید و اولین سفارش خود را ثبت کنید.</p><Link href="/shop" className="mt-5 inline-flex rounded-xl bg-[#24211f] px-5 py-3 text-sm text-white">مشاهده محصولات</Link></div> : <div className="space-y-3">{orders.map((order) => <Link key={order.id} href={`/account/orders/${order.id}`} className="block rounded-2xl border border-[#eee8e1] p-5 transition hover:border-[#d7cbbf] hover:bg-[#fdfbf8]"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-semibold text-[#24211f]">{order.order_number}</p><p className="mt-1 text-xs text-[#99918a]">{formatDate(order.created_at)}</p></div><div className="flex flex-wrap items-center gap-3 text-xs"><span className="rounded-full bg-[#f1ede7] px-3 py-1.5 text-[#6f665e]">{statusLabel(order.status)}</span><span className="rounded-full border border-[#e7e0d8] px-3 py-1.5 text-[#6f665e]">پرداخت: {order.payment_status === "paid" ? "موفق" : "در انتظار"}</span></div><div className="flex items-center gap-4"><strong className="text-sm text-[#24211f]">{formatPrice(Number(order.total_amount))} تومان</strong><span className="text-[#9a8170]">←</span></div></div></Link>)}</div>}
        </section>
      </div>
    </main>
  );
}
