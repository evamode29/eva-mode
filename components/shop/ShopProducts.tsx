"use client";

import { useMemo, useState } from "react";
import type { ProductCardData } from "@/lib/products";
import { FilterBar } from "@/components/shop/FilterBar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Container } from "@/components/ui/Container";

const categories = [
  { value: "all", label: "همه محصولات" },
  { value: "bras", label: "سوتین" },
  { value: "sets", label: "ست لباس زیر" },
  { value: "underwear", label: "لباس زیر" },
  { value: "bodysuit", label: "بادی" },
  { value: "sleepwear", label: "لباس خواب" },
];

const priceFilters = [
  { value: "all", label: "همه قیمت‌ها" },
  { value: "under-500", label: "زیر ۵۰۰ هزار تومان" },
  { value: "500-1000", label: "۵۰۰ هزار تا ۱ میلیون" },
  { value: "over-1000", label: "بالای ۱ میلیون" },
];

export function ShopProducts({
  products,
}: {
  products: ProductCardData[];
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query);

      const matchesCategory =
        category === "all" ||
        product.categoryId?.toLowerCase() === category;

      const matchesPrice =
        price === "all" ||
        (price === "under-500" && product.basePrice < 500000) ||
        (price === "500-1000" &&
          product.basePrice >= 500000 &&
          product.basePrice <= 1000000) ||
        (price === "over-1000" && product.basePrice > 1000000);

      const matchesAvailability =
        !onlyAvailable || product.isActive;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesAvailability
      );
    });

    return [...result].sort((a, b) => {
      switch (sort) {
        case "price-low":
          return a.basePrice - b.basePrice;

        case "price-high":
          return b.basePrice - a.basePrice;

        case "name":
          return a.name.localeCompare(b.name, "fa");

        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
      }
    });
  }, [
    products,
    search,
    sort,
    category,
    price,
    onlyAvailable,
  ]);

  const hasFilters =
    search ||
    category !== "all" ||
    price !== "all" ||
    onlyAvailable;

  const clearFilters = () => {
    setSearch("");
    setSort("newest");
    setCategory("all");
    setPrice("all");
    setOnlyAvailable(false);
  };

  return (
    <>
      {/* دسته‌بندی */}
      <section className="shop-category-filter">
        <div className="container">
          <div className="shop-category-filter-inner">
            <div className="shop-category-title">
              <span>دسته‌بندی</span>
            </div>

            <div className="shop-category-list">
              {categories.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={
                    category === item.value
                      ? "shop-category-button is-active"
                      : "shop-category-button"
                  }
                  onClick={() => setCategory(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* جستجو و مرتب‌سازی */}
      <FilterBar
        search={search}
        sort={sort}
        onSearchChange={setSearch}
        onSortChange={setSort}
      />

      {/* فیلترهای تکمیلی */}
      <section className="shop-advanced-filter">
        <div className="container">
          <div className="shop-advanced-filter-inner">

            <label className="shop-price-filter">
              <span>محدوده قیمت</span>

              <select
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                aria-label="فیلتر قیمت"
              >
                {priceFilters.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="shop-available-filter">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(event) =>
                  setOnlyAvailable(event.target.checked)
                }
              />

              <span className="shop-checkmark">
                ✓
              </span>

              <span>
                فقط محصولات موجود
              </span>
            </label>

            {hasFilters && (
              <button
                type="button"
                className="shop-clear-filters"
                onClick={clearFilters}
              >
                حذف همه فیلترها
                <span>×</span>
              </button>
            )}

          </div>
        </div>
      </section>

      {/* محصولات */}
      <section className="shop-products">
        <Container>
          <div className="shop-products-heading">
            <div>
              <span>COLLECTION / EVA MODE</span>

              <strong>
                {filteredProducts.length.toLocaleString("fa-IR")} محصول
              </strong>
            </div>
          </div>

          <ProductGrid items={filteredProducts} />
        </Container>
      </section>
    </>
  );
}