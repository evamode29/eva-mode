import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Header() {
  return (
    <header className="site-header">
      <Container>
        <div className="header-inner">
          <Link href="/" className="wordmark" aria-label="EVA MODE - صفحه اصلی">
            EVA <span>MODE</span>
          </Link>

          <nav className="desktop-nav" aria-label="ناوبری اصلی">
            <Link href="/shop">فروشگاه</Link>
            <Link href="/shop#categories">دسته‌بندی‌ها</Link>
          </nav>

          <div className="header-actions">
            <button className="icon-button search-trigger" aria-label="جستجو" type="button">
              <span aria-hidden="true">⌕</span>
              <span className="action-label">جستجو</span>
            </button>
            <button className="icon-button" aria-label="حساب کاربری" type="button">
              <span aria-hidden="true">♙</span>
              <span className="action-label">حساب</span>
            </button>
            <Link href="/cart" className="icon-button" aria-label="سبد خرید">
              <span aria-hidden="true">◌</span>
              <span className="action-label">سبد</span>
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
