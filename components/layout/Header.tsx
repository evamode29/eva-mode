"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/Container";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <Container>
        <div className="header-inner">
          <button
            type="button"
            className="mobile-menu-button"
            aria-label="باز کردن منو"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            ☰
          </button>

          <Link
            href="/"
            className="wordmark"
            aria-label="EVA MODE - صفحه اصلی"
          >
            EVA <span>MODE</span>
          </Link>

          <nav
            className={`desktop-nav ${
              menuOpen ? "is-open" : ""
            }`}
            aria-label="ناوبری اصلی"
          >
            <Link href="/shop">فروشگاه</Link>
            <Link href="/#categories">دسته‌بندی‌ها</Link>
            <Link href="/shop?sort=newest">
              جدیدترین‌ها
            </Link>
            <Link href="/shop?filter=bestseller">
              پرفروش‌ها
            </Link>
          </nav>

          <div className="header-actions">
            <Link
              href="/shop"
              className="icon-button"
              aria-label="جستجوی محصولات"
            >
              <span aria-hidden="true">⌕</span>
              <span className="action-label">جستجو</span>
            </Link>

            <Link
              href="/admin"
              className="icon-button"
              aria-label="حساب کاربری"
            >
              <span aria-hidden="true">♙</span>
              <span className="action-label">حساب</span>
            </Link>

            <Link
              href="/cart"
              className="icon-button cart-button"
              aria-label="سبد خرید"
            >
              <span aria-hidden="true">🛍</span>
              <span className="action-label">سبد</span>
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}