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
          <div className="shop-search">
            <span className="shop-search-icon">⌕</span>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="جستجو در محصولات..."
              aria-label="جستجو در محصولات"
            />
          </div>

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
                <option value="new">جدیدترین</option>
                <option value="price-asc">
                  ارزان‌ترین
                </option>
                <option value="price-desc">
                  گران‌ترین
                </option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}