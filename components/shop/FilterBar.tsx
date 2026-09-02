"use client";

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
  return (
    <section className="shop-toolbar">
      <div className="container">
        <div className="shop-toolbar-inner">

          {/* جستجو */}
          <div className="shop-search">
            <span
              className="shop-search-icon"
              aria-hidden="true"
            >
              ⌕
            </span>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="جستجو در محصولات..."
              aria-label="جستجو در محصولات"
              autoComplete="off"
            />

            {search && (
              <button
                type="button"
                className="shop-search-clear"
                onClick={() => onSearchChange("")}
                aria-label="پاک کردن جستجو"
              >
                ×
              </button>
            )}
          </div>

          {/* ابزارهای فروشگاه */}
          <div className="shop-toolbar-right">

            <div className="shop-result-label">
              محصولات EVA MODE
            </div>

            <label className="shop-sort">
              <span>مرتب‌سازی</span>

              <select
                value={sort}
                onChange={(event) =>
                  onSortChange(event.target.value)
                }
                aria-label="مرتب‌سازی محصولات"
              >
                <option value="newest">
                  جدیدترین
                </option>

                <option value="price-low">
                  ارزان‌ترین
                </option>

                <option value="price-high">
                  گران‌ترین
                </option>

                <option value="name">
                  الفبایی
                </option>
              </select>
            </label>

          </div>
        </div>
      </div>
    </section>
  );
}