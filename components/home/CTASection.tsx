import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function CTASection() {
  return <section className="cta-section"><Container><div className="cta-card"><span className="eyebrow">EVA MODE</span><h2>انتخاب‌های روزمره، با حس بهتر.</h2><p>برای دیدن مجموعه‌ها وارد فروشگاه شوید.</p><Link href="/shop" className="eva-button eva-button--secondary">ورود به فروشگاه</Link></div></Container></section>;
}
