
"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="brand" aria-label="EVA MODE">
          EVA MODE
        </Link>

        <div className="header-search">
          <Link href="/shop" aria-label="جستجوی محصولات">
            <span className="search-icon">⌕</span>
            <span>جستجو در محصولات، دسته‌بندی‌ها...</span>
          </Link>
        </div>

        <nav className="desktop-nav" aria-label="منوی اصلی">
          <Link href="/shop">فروشگاه</Link>
          <Link href="/shop?category=bras">سوتین</Link>
          <Link href="/shop?category=sets">ست‌ها</Link>
          <Link href="/shop?category=underwear">لباس زیر</Link>
          <Link href="/shop?sort=new">جدیدها</Link>
          <Link href="/shop?discount=true">تخفیف‌ها</Link>
        </nav>

        <div className="header-actions">
          <Link href="/admin" className="header-action" aria-label="حساب کاربری">
            <span className="header-action-icon">♙</span>
            <span>حساب</span>
          </Link>

          <Link href="/cart" className="header-action" aria-label="سبد خرید">
            <span className="header-action-icon">🛒</span>
            <span>سبد</span>
          </Link>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      <div className="header-categories">
        <div className="container header-categories-inner">
          <Link href="/shop">همه محصولات</Link>
          <Link href="/shop?category=bras">سوتین</Link>
          <Link href="/shop?category=sets">ست لباس زیر</Link>
          <Link href="/shop?category=underwear">شورت</Link>
          <Link href="/shop?sort=new">جدیدترین‌ها</Link>
          <Link href="/shop?discount=true" className="header-sale">
            پیشنهادهای ویژه
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-nav">
          <div className="container mobile-nav-inner">
            <Link href="/shop" onClick={() => setMenuOpen(false)}>
              همه محصولات
            </Link>
            <Link href="/shop?category=bras" onClick={() => setMenuOpen(false)}>
              سوتین
            </Link>
            <Link href="/shop?category=sets" onClick={() => setMenuOpen(false)}>
              ست لباس زیر
            </Link>
            <Link
              href="/shop?category=underwear"
              onClick={() => setMenuOpen(false)}
            >
              شورت
            </Link>
            <Link href="/shop?sort=new" onClick={() => setMenuOpen(false)}>
              جدیدترین‌ها
            </Link>
            <Link
              href="/shop?discount=true"
              onClick={() => setMenuOpen(false)}
            >
              پیشنهادهای ویژه
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}