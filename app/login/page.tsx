"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
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
    <main dir="rtl" className="min-h-screen bg-[#f8f6f2] px-4 py-10 md:py-16">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <section className="hidden lg:block">
          <p className="text-xs tracking-[0.3em] text-[#9a8170]">
            EVA MODE / ACCOUNT
          </p>
          <h1 className="mt-5 text-6xl font-semibold leading-tight text-[#24211f]">
            زیبایی
            <br />
            در سادگی
          </h1>
          <p className="mt-6 max-w-md text-sm leading-8 text-[#77716b]">
            برای پیگیری سفارش‌ها، مدیریت اطلاعات حساب و تجربه خرید بهتر وارد حساب EVA MODE شوید.
          </p>
          <Link href="/" className="mt-8 inline-flex text-sm text-[#9a8170]">
            بازگشت به فروشگاه ←
          </Link>
        </section>

        <section className="rounded-3xl border border-[#e7e0d8] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8 text-center">
            <Link href="/" className="text-xl font-semibold tracking-[0.18em] text-[#24211f]">
              EVA MODE
            </Link>
            <p className="mt-3 text-sm text-[#77716b]">
              {mode === "login" ? "ورود به حساب کاربری" : "ساخت حساب کاربری"}
            </p>
          </div>

          <div className="mb-7 grid grid-cols-2 rounded-xl bg-[#f5f1ec] p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setMessage("");
              }}
              className={`rounded-lg px-4 py-3 text-sm transition ${
                mode === "login"
                  ? "bg-white font-semibold text-[#24211f] shadow-sm"
                  : "text-[#77716b]"
              }`}
            >
              ورود
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
                setMessage("");
              }}
              className={`rounded-lg px-4 py-3 text-sm transition ${
                mode === "signup"
                  ? "bg-white font-semibold text-[#24211f] shadow-sm"
                  : "text-[#77716b]"
              }`}
            >
              ثبت‌نام
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <label className="block">
                  <span className="mb-2 block text-xs text-[#77716b]">نام و نام خانوادگی</span>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-[#e1d9d1] bg-[#fcfbf9] px-4 text-sm outline-none transition focus:border-[#9a8170]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs text-[#77716b]">شماره موبایل</span>
                  <input
                    value={mobile}
                    onChange={(event) => setMobile(event.target.value)}
                    inputMode="tel"
                    className="h-12 w-full rounded-xl border border-[#e1d9d1] bg-[#fcfbf9] px-4 text-sm outline-none transition focus:border-[#9a8170]"
                  />
                </label>
              </>
            )}

            <label className="block">
              <span className="mb-2 block text-xs text-[#77716b]">ایمیل</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                className="h-12 w-full rounded-xl border border-[#e1d9d1] bg-[#fcfbf9] px-4 text-sm outline-none transition focus:border-[#9a8170]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs text-[#77716b]">رمز عبور</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={6}
                required
                className="h-12 w-full rounded-xl border border-[#e1d9d1] bg-[#fcfbf9] px-4 text-sm outline-none transition focus:border-[#9a8170]"
              />
            </label>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-6 text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-6 text-emerald-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-[#24211f] text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "لطفاً صبر کنید..."
                : mode === "login"
                  ? "ورود به حساب"
                  : "ساخت حساب کاربری"}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] leading-6 text-[#99918a]">
            با ایجاد حساب، اطلاعات سفارش‌ها و حساب شما در EVA MODE ذخیره می‌شود.
          </p>
        </section>
      </div>
    </main>
  );
}
