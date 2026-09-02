"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const supabase = createClient();

    if (mode === "login") {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        setError("ایمیل یا رمز عبور صحیح نیست.");
        setLoading(false);
        return;
      }

      router.replace(next);
      router.refresh();
      return;
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          mobile: mobile.trim(),
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.replace(next);
      router.refresh();
      return;
    }

    setMessage("حساب شما ساخته شد. لینک تأیید به ایمیل شما ارسال شد.");
    setLoading(false);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f4f0] px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between border-b border-[#e6dfd8] pb-5">
          <Link href="/" aria-label="EVA MODE" className="text-[19px] font-bold tracking-[0.16em] text-[#24211f]">EVA MODE</Link>
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#77716b] transition hover:text-[#24211f]"><span aria-hidden="true">→</span>بازگشت به فروشگاه</Link>
        </header>

        <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:gap-20">
          <section className="hidden lg:block">
            <span className="text-[11px] font-medium tracking-[0.24em] text-[#9a8170]">EVA MODE / ACCOUNT</span>
            <h1 className="mt-6 text-6xl font-bold leading-[1.35] text-[#24211f]">زیبایی<br />در سادگی</h1>
            <p className="mt-7 max-w-lg text-sm leading-8 text-[#77716b]">وارد حساب EVA MODE شوید و سفارش‌ها، اطلاعات حساب و تجربه خرید خود را در یک فضای ساده و امن مدیریت کنید.</p>
            <div className="mt-10 flex items-center gap-8 text-xs text-[#77716b]">
              <div><strong className="block text-lg font-semibold text-[#24211f]">01</strong>خرید آسان</div>
              <div><strong className="block text-lg font-semibold text-[#24211f]">02</strong>پیگیری سفارش</div>
              <div><strong className="block text-lg font-semibold text-[#24211f]">03</strong>حساب شخصی</div>
            </div>
          </section>

          <section className="w-full rounded-[28px] border border-[#e4ddd5] bg-white p-6 shadow-[0_20px_60px_rgba(36,33,31,0.06)] md:p-9">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#ddd4cb] text-[#9a8170]"><span className="text-lg" aria-hidden="true">♙</span></div>
              <h2 className="text-xl font-bold text-[#24211f]">{mode === "login" ? "ورود یا ثبت‌نام" : "ساخت حساب EVA MODE"}</h2>
              <p className="mt-3 text-xs leading-6 text-[#77716b]">{mode === "login" ? "برای ادامه، اطلاعات حساب خود را وارد کنید" : "اطلاعات خود را وارد کنید تا حساب شما ساخته شود"}</p>
            </div>

            <div className="mb-7 grid grid-cols-2 border-b border-[#e8e1da]">
              <button type="button" onClick={() => { setMode("login"); setError(""); setMessage(""); }} className={`relative px-4 py-3 text-sm transition ${mode === "login" ? "font-bold text-[#24211f] after:absolute after:inset-x-8 after:bottom-[-1px] after:h-[2px] after:bg-[#24211f]" : "text-[#8b837c] hover:text-[#24211f]"}`}>ورود</button>
              <button type="button" onClick={() => { setMode("signup"); setError(""); setMessage(""); }} className={`relative px-4 py-3 text-sm transition ${mode === "signup" ? "font-bold text-[#24211f] after:absolute after:inset-x-8 after:bottom-[-1px] after:h-[2px] after:bg-[#24211f]" : "text-[#8b837c] hover:text-[#24211f]"}`}>ثبت‌نام</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && <>
                <label className="block"><span className="mb-2 block text-xs font-medium text-[#55504b]">نام و نام خانوادگی</span><input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" required className="h-12 w-full rounded-xl border border-[#ded6ce] bg-[#fdfcfb] px-4 text-sm text-[#24211f] outline-none transition focus:border-[#9a8170] focus:ring-2 focus:ring-[#9a8170]/10" /></label>
                <label className="block"><span className="mb-2 block text-xs font-medium text-[#55504b]">شماره موبایل</span><input value={mobile} onChange={(event) => setMobile(event.target.value)} inputMode="tel" dir="ltr" autoComplete="tel" className="h-12 w-full rounded-xl border border-[#ded6ce] bg-[#fdfcfb] px-4 text-left text-sm text-[#24211f] outline-none transition focus:border-[#9a8170] focus:ring-2 focus:ring-[#9a8170]/10" /></label>
              </>}

              <label className="block"><span className="mb-2 block text-xs font-medium text-[#55504b]">ایمیل</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" dir="ltr" required className="h-12 w-full rounded-xl border border-[#ded6ce] bg-[#fdfcfb] px-4 text-left text-sm text-[#24211f] outline-none transition focus:border-[#9a8170] focus:ring-2 focus:ring-[#9a8170]/10" placeholder="example@email.com" /></label>
              <label className="block"><span className="mb-2 block text-xs font-medium text-[#55504b]">رمز عبور</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required className="h-12 w-full rounded-xl border border-[#ded6ce] bg-[#fdfcfb] px-4 text-left text-sm text-[#24211f] outline-none transition focus:border-[#9a8170] focus:ring-2 focus:ring-[#9a8170]/10" placeholder="حداقل ۶ کاراکتر" /></label>

              {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-6 text-red-700">{error}</div>}
              {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-6 text-emerald-700">{message}</div>}

              <button type="submit" disabled={loading} className="mt-2 h-12 w-full rounded-xl bg-[#24211f] text-sm font-medium text-white transition hover:bg-[#34302d] disabled:cursor-not-allowed disabled:opacity-60">{loading ? "لطفاً صبر کنید..." : mode === "login" ? "ورود به حساب EVA MODE" : "ساخت حساب کاربری"}</button>
            </form>

            <p className="mt-6 border-t border-[#eee8e2] pt-5 text-center text-[10px] leading-6 text-[#99918a]">ورود یا ثبت‌نام شما به معنای پذیرش شرایط استفاده و حریم خصوصی EVA MODE است.</p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main dir="rtl" className="min-h-screen bg-[#f7f4f0]" />}>
      <LoginForm />
    </Suspense>
  );
}
