"use client";

import { useMemo, useState } from "react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { FilterBar } from "@/components/shop/FilterBar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Container } from "@/components/ui/Container";

import type { ProductCardData } from "@/lib/products";

export default function ShopPage() {
  const [products] = useState<ProductCardData[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase().trim())
    );

    return [...result].sort((a, b) => {
      if (sort === "price-low") {
        return a.basePrice - b.basePrice;
      }

      if (sort === "price-high") {
        return b.basePrice - a.basePrice;
      }

      if (sort === "name") {
        return a.name.localeCompare(b.name, "fa");
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });
  }, [products, search, sort]);

  return (
    <>
      <Header />

      <main>
        <ShopHeader />

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
      </main>

      <Footer />
    </>
  );
}