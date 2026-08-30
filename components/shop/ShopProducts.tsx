"use client";

import { useMemo, useState } from "react";
import type { ProductCardData } from "@/lib/products";
import { FilterBar } from "@/components/shop/FilterBar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Container } from "@/components/ui/Container";

export function ShopProducts({
  products,
}: {
  products: ProductCardData[];
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );

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
  }, [products, search, sort]);

  return (
    <>
      <FilterBar
        search={search}
        sort={sort}
        onSearchChange={setSearch}
        onSortChange={setSort}
      />

      <section className="shop-products">
        <Container>
          <ProductGrid items={filteredProducts} />
        </Container>
      </section>
    </>
  );
}