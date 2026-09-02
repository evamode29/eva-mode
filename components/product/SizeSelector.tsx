"use client";

import { useState } from "react";
import type { Size } from "@/types";

type SizeSelectorProps = {
  sizes: Size[];
  selectedSizeId: string | null;
  onSelect: (sizeId: string) => void;
  availableSizeIds?: string[];
};

export function SizeSelector({
  sizes,
  selectedSizeId,
  onSelect,
  availableSizeIds,
}: SizeSelectorProps) {
  const [guideOpen, setGuideOpen] = useState(false);

  if (sizes.length === 0) return null;

  return (
    <div className="selector-group">
      <div className="selector-label">
        <strong>سایز</strong>
        <button
          type="button"
          onClick={() => setGuideOpen(true)}
          className="size-guide-trigger"
          aria-haspopup="dialog"
          aria-expanded={guideOpen}
        >
          راهنمای سایز
        </button>
      </div>

      <div className="option-row">
        {sizes.map((size) => {
          const isSelected = size.id === selectedSizeId;
          const isAvailable =
            availableSizeIds === undefined || availableSizeIds.includes(size.id);

          return (
            <button
              key={size.id}
              type="button"
              className={[
                "size-option",
                isSelected ? "is-selected" : "",
                !isAvailable ? "is-disabled" : "",
              ].filter(Boolean).join(" ")}
              aria-pressed={isSelected}
              disabled={!isAvailable}
              onClick={() => onSelect(size.id)}
            >
              {size.name}
            </button>
          );
        })}
      </div>

      {guideOpen && (
        <div
          className="size-guide-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setGuideOpen(false);
          }}
        >
          <div
            className="size-guide-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-guide-title"
          >
            <button
              type="button"
              className="size-guide-close"
              onClick={() => setGuideOpen(false)}
              aria-label="بستن راهنمای سایز"
            >
              ×
            </button>

            <span className="size-guide-eyebrow">EVA MODE / FIT GUIDE</span>
            <h3 id="size-guide-title">راهنمای انتخاب سایز</h3>
            <p>
              برای انتخاب دقیق‌تر، اندازه‌ها را با جدول همین محصول و اطلاعات درج‌شده
              در مشخصات آن مقایسه کنید. در صورت تفاوت بین دو سایز، اندازه‌ای را انتخاب
              کنید که فرم راحت‌تری برای شما ایجاد می‌کند.
            </p>

            <div className="size-guide-table-wrap">
              <table className="size-guide-table">
                <thead>
                  <tr>
                    <th>سایز</th>
                    <th>وضعیت این محصول</th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((size) => {
                    const available =
                      availableSizeIds === undefined || availableSizeIds.includes(size.id);
                    return (
                      <tr key={size.id}>
                        <td>{size.name}</td>
                        <td>{available ? "قابل انتخاب" : "فعلاً ناموجود"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="size-guide-note">
              اندازه‌های عددی یا سانتی‌متری را فقط زمانی نمایش می‌دهیم که برای خود محصول
              در دیتابیس EVA MODE ثبت شده باشد.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
