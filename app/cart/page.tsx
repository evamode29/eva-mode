import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  return <><Header /><main><section className="page-section"><Container><div className="page-heading"><span className="eyebrow">BAG / 01</span><h1>سبد خرید</h1></div><div className="cart-layout"><div className="cart-item"><div className="visual-placeholder cart-image"><span>IMAGE</span></div><div className="cart-item-info"><h2>ست مینیمال اِسِنشیال</h2><p>رنگ: مشکی · سایز: M</p><div className="cart-item-bottom"><span>تعداد: ۱</span><strong>۱,۴۹۰,۰۰۰ تومان</strong></div></div><button type="button" className="text-button">حذف</button></div><aside className="summary-card"><h2>خلاصه سفارش</h2><div><span>جمع کل</span><strong>۱,۴۹۰,۰۰۰ تومان</strong></div><Button>ادامه به پرداخت</Button><Button variant="secondary">ادامه خرید</Button></aside></div></Container></section></main><Footer /></>;
}
