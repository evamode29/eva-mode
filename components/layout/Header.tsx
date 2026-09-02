"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { MiniCart } from "@/components/cart/MiniCart";

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
      <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20" r="1.2" fill="currentColor" />
      <circle cx="18" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 20c.7-3.3 3.1-5 7-5s6.3 1.7 7 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="brand" aria-label="EVA MODE">EVA MODE</Link>

        <div className="header-search">
          <Link href="/shop" aria-label="جستجوی محصولات">
            <span className="search-icon">⌕</span>
            <span>جستجو در محصولات، دسته‌بندی‌ها...</span>
          </Link>
        </div>

        <nav className="desktop-nav" aria-label="منوی اصلی">
          <Link href="/shop">فروشگاه</Link>
          <Link href="/shop?category=bra">سوتین</Link>
          <Link href="/shop?category=sets">ست‌ها</Link>
          <Link href="/shop?category=brief">شورت</Link>
          <Link href="/shop?category=sleepwear">لباس خواب</Link>
          <Link href="/shop?sort=new">جدیدها</Link>
        </nav>

        <div className="header-actions">
          <Link href="/account" className="header-action" aria-label="حساب کاربری">
            <span className="header-action-icon"><UserIcon /></span>
            <span>حساب</span>
          </Link>

          <button type="button" className="header-action header-cart-action" aria-label={`سبد خرید، ${totalItems} کالا`} aria-expanded={cartOpen} onClick={() => setCartOpen(true)}>
            <span className="header-action-icon header-cart-icon">
              <CartIcon />
              {totalItems > 0 && <span className="header-cart-badge" aria-hidden="true">{totalItems > 99 ? "۹۹+" : totalItems.toLocaleString("fa-IR")}</span>}
            </span>
            <span>سبد</span>
          </button>

          <button type="button" className="mobile-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "بستن منو" : "باز کردن منو"} aria-expanded={menuOpen}>
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-nav">
          <div className="container mobile-nav-inner">
            <Link href="/shop" onClick={() => setMenuOpen(false)}>همه محصولات</Link>
            <Link href="/shop?category=bra" onClick={() => setMenuOpen(false)}>سوتین</Link>
            <Link href="/shop?category=sets" onClick={() => setMenuOpen(false)}>ست لباس زیر</Link>
            <Link href="/shop?category=brief" onClick={() => setMenuOpen(false)}>شورت</Link>
            <Link href="/shop?category=sleepwear" onClick={() => setMenuOpen(false)}>لباس خواب</Link>
            <Link href="/shop?sort=new" onClick={() => setMenuOpen(false)}>جدیدترین‌ها</Link>
          </div>
        </div>
      )}

      <MiniCart open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
