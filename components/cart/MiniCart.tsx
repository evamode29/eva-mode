"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/cart/CartContext";

function formatPrice(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function MiniCart({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120]" dir="rtl" role="dialog" aria-modal="true" aria-label="سبد خرید">
      <button
        type="button"
        className="absolute inset-0 bg-black/25 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="بستن سبد خرید"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[430px] flex-col bg-[#fffdf9] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e3ddd5] px-5 py-5">
          <div>
            <span className="text-[9px] font-bold tracking-[0.16em] text-[#9a8170]">EVA MODE / BAG</span>
            <h2 className="mt-1 text-lg font-bold text-[#24211f]">سبد خرید</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e3ddd5] text-xl text-[#24211f] transition hover:bg-[#f1ede7]"
            aria-label="بستن"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <span className="text-xs tracking-[0.2em] text-[#9a8170]">00 / EMPTY</span>
              <h3 className="mt-3 text-xl font-bold text-[#24211f]">سبد خرید خالی است</h3>
              <p className="mt-2 max-w-[280px] text-xs leading-7 text-[#77716b]">
                محصولات مورد علاقه‌تان را انتخاب کنید و برای خرید به سبد اضافه کنید.
              </p>
              <Link
                href="/shop"
                onClick={onClose}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#24211f] px-6 text-xs font-bold text-white transition hover:opacity-90"
              >
                مشاهده محصولات ←
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[#e3ddd5] bg-white p-3">
                  <div className="flex gap-3">
                    <Link href={`/products/${item.productId}`} onClick={onClose} className="h-24 w-[76px] shrink-0 overflow-hidden rounded-xl bg-[#f1ede7]">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} width={152} height={192} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[8px] tracking-widest text-[#9a8170]">EVA</div>
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/products/${item.productId}`} onClick={onClose} className="line-clamp-2 text-sm font-bold text-[#24211f]">
                          {item.name}
                        </Link>
                        <button type="button" onClick={() => removeItem(item.id)} className="shrink-0 text-lg text-[#9b5d58]" aria-label={`حذف ${item.name}`}>
                          ×
                        </button>
                      </div>
                      <p className="mt-1 text-[10px] text-[#77716b]">رنگ: {item.colorName} · سایز: {item.sizeName}</p>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center rounded-full border border-[#e3ddd5] px-1">
                          <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-7 w-7 text-base" aria-label="کاهش تعداد">−</button>
                          <span className="min-w-6 text-center text-[10px]">{formatPrice(item.quantity)}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-7 w-7 text-base" aria-label="افزایش تعداد">+</button>
                        </div>
                        <strong className="text-xs text-[#24211f]">{formatPrice(item.price * item.quantity)} تومان</strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#e3ddd5] bg-[#f8f6f2] px-5 py-5">
            <div className="flex items-center justify-between text-xs text-[#77716b]">
              <span>تعداد کالا</span>
              <strong className="text-[#24211f]">{formatPrice(totalItems)}</strong>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-[#77716b]">جمع سبد</span>
              <strong className="text-base text-[#24211f]">{formatPrice(totalPrice)} تومان</strong>
            </div>
            <Link href="/cart" onClick={onClose} className="mt-4 flex min-h-12 items-center justify-center rounded-xl bg-[#24211f] text-xs font-bold text-white transition hover:opacity-90">
              مشاهده سبد خرید
            </Link>
            <Link href="/checkout" onClick={onClose} className="mt-2 flex min-h-11 items-center justify-center rounded-xl border border-[#d6cec5] bg-white text-xs font-bold text-[#24211f] transition hover:bg-[#f1ede7]">
              ادامه به پرداخت
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
