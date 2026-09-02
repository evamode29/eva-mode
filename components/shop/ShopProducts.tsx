"use client";

import { useMemo, useState } from "react";
import type { ProductCardData } from "@/lib/products";
import { FilterBar } from "@/components/shop/FilterBar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Container } from "@/components/ui/Container";

const categories = [
  { value: "all", label: "همه محصولات" },
  { value: "bra", label: "سوتین" },
  { value: "sets", label: "ست لباس زیر" },
  { value: "brief", label: "شورت" },
  { value: "bodysuit", label: "بادی" },
  { value: "sleepwear", label: "لباس خواب" },
];

const priceFilters = [
  { value: "all", label: "همه قیمت‌ها" },
  { value: "under-500", label: "زیر ۵۰۰ هزار تومان" },
  { value: "500-1000", label: "۵۰۰ هزار تا ۱ میلیون" },
  { value: "over-1000", label: "بالای ۱ میلیون" },
];

function normalizeCategory(value: string | undefined) {
  if (!value) return "all";
  if (value === "bras") return "bra";
  if (value === "underwear") return "brief";
  return categories.some((item) => item.value === value) ? value : "all";
}

export function ShopProducts({
  products,
  initialCategory = "all",
}: {
  products: ProductCardData[];
  initialCategory?: string;
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState(normalizeCategory(initialCategory));
  const [price, setPrice] = useState("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fa-IR");

    const result = products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLocaleLowerCase("fa-IR").includes(query) ||
        product.brand.toLocaleLowerCase("fa-IR").includes(query);

      const matchesCategory =
        category === "all" || product.categorySlug === category;

      const matchesPrice =
        price === "all" ||
        (price === "under-500" && product.basePrice < 500000) ||
        (price === "500-1000" &&
          product.basePrice >= 500000 &&
          product.basePrice <= 1000000) ||
        (price === "over-1000" && product.basePrice > 1000000);

      const matchesAvailability = !onlyAvailable || product.isActive;

      return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
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
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [products, search, sort, category, price, onlyAvailable]);

  const hasFilters =
    Boolean(search) || category !== "all" || price !== "all" || onlyAvailable;

  const clearFilters = () => {
    setSearch("");
    setSort("newest");
    setCategory("all");
    setPrice("all");
    setOnlyAvailable(false);
  };

  return (
    <>
      <section className="shop-category-filter">
        <div className="container">
          <div className="shop-category-filter-inner">
            <div className="shop-category-title"><span>دسته‌بندی</span></div>
            <div className="shop-category-list">
              {categories.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={category === item.value ? "shop-category-button is-active" : "shop-category-button"}
                  onClick={() => setCategory(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FilterBar
        search={search}
        sort={sort}
        onSearchChange={setSearch}
        onSortChange={setSort}
      />

      <div className="shop-mobile-filter-trigger">
        <div className="container">
          <button
            type="button"
            className="shop-mobile-filter-button"
            onClick={() => setMobileFiltersOpen((open) => !open)}
            aria-expanded={mobileFiltersOpen}
          >
            <span className="shop-mobile-filter-icon">☷</span>
            <span>فیلترها</span>
            {hasFilters && <span className="shop-mobile-filter-count">فعال</span>}
            <span className="shop-mobile-filter-arrow">{mobileFiltersOpen ? "↑" : "↓"}</span>
          </button>
        </div>
      </div>

      <section className={mobileFiltersOpen ? "shop-advanced-filter is-open" : "shop-advanced-filter"}>
        <div className="container">
          <div className="shop-advanced-filter-inner">
            <div className="shop-mobile-category">
              <span>دسته‌بندی</span>
              <div>
                {categories.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={category === item.value ? "is-active" : ""}
                    onClick={() => setCategory(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="shop-price-filter">
              <span>محدوده قیمت</span>
              <select value={price} onChange={(event) => setPrice(event.target.value)} aria-label="فیلتر قیمت">
                {priceFilters.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>

            <label className="shop-available-filter">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(event) => setOnlyAvailable(event.target.checked)}
              />
              <span className="shop-checkmark">✓</span>
              <span>فقط محصولات موجود</span>
            </label>

            {hasFilters && (
              <button type="button" className="shop-clear-filters" onClick={clearFilters}>
                حذف همه فیلترها <span>×</span>
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="shop-products">
        <Container>
          <div className="shop-products-heading">
            <div>
              <span>COLLECTION / EVA MODE</span>
              <strong>{filteredProducts.length.toLocaleString("fa-IR")} محصول</strong>
            </div>
          </div>
          <ProductGrid items={filteredProducts} />
        </Container>
      </section>
    </>
  );
}
