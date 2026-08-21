import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-grid">
          <div>
            <Link href="/" className="wordmark footer-wordmark">EVA <span>MODE</span></Link>
            <p className="footer-note">سادگی، ظرافت و انتخابی که با شما می‌ماند.</p>
          </div>
          <div className="footer-links">
            <strong>راهنما</strong>
            <Link href="/shop">فروشگاه</Link>
            <Link href="#">تماس با ما</Link>
            <Link href="#">قوانین</Link>
            <Link href="#">حریم خصوصی</Link>
          </div>
          <div className="footer-links">
            <strong>خدمات</strong>
            <Link href="#">پیگیری سفارش</Link>
            <button type="button">اینستاگرام</button>
            <button type="button">شبکه‌های اجتماعی</button>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} EVA MODE — تمامی حقوق محفوظ است.</div>
      </Container>
    </footer>
  );
}
