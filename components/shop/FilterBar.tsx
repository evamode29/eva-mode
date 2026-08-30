"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";

type FilterBarProps = {
  search: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
};

export function FilterBar({
  search,
  sort,
  onSearchChange,
  onSortChange,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <section className="shop-filter-section">
      <Container>
        <div className="filter-bar">
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            aria-expanded={showFilters}
          >
            فیلترها
            <span>{showFilters ? "⌃" : "⌄"}</span>
          </button>

          <label>
            <span>جستجو</span>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="نام محصول..."
              aria-label="جستجوی محصول"
            />
          </label>

          <label>
            <span>مرتب‌سازی</span>

            <select
              value={sort}
              onChange={(event) =>
                onSortChange(event.target.value)
              }
              aria-label="مرتب‌سازی محصولات"
            >
              <option value="newest">جدیدترین</option>
              <option value="price-low">ارزان‌ترین</option>
              <option value="price-high">گران‌ترین</option>
              <option value="name">نام محصول</option>
            </select>
          </label>
        </div>

        {showFilters && (
          <div className="shop-filter-panel">
            <span>
              {search
                ? `نتایج جستجو برای «${search}»`
                : "فیلتر محصولات"}
            </span>

            {(search || sort !== "newest") && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange("");
                  onSortChange("newest");
                }}
              >
                پاک کردن
              </button>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}