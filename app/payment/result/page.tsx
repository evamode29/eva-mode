import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ status?: string; order?: string }> };

export default async function PaymentResultPage({ searchParams }: Props) {
  const params = await searchParams;
  const status = params.status;
  const success = status === "success";
  const cancelled = status === "cancelled";

  return (
    <>
      <Header />
      <main>
        <section className="page-section">
          <Container>
            <div className="cart-empty">
              <span className="eyebrow">EVA MODE / PAYMENT</span>
              <h1>{success ? "پرداخت با موفقیت انجام شد" : cancelled ? "پرداخت لغو شد" : "پرداخت ناموفق بود"}</h1>
              {params.order && <p>شماره سفارش: <strong>{params.order}</strong></p>}
              <p>
                {success
                  ? "پرداخت سفارش شما تأیید شد و سفارش برای پردازش آماده است."
                  : cancelled
                    ? "پرداخت انجام نشد. می‌توانید دوباره از حساب کاربری خود اقدام کنید."
                    : "در تأیید پرداخت مشکلی رخ داد. در صورت کسر وجه، نتیجه تراکنش پس از بررسی مشخص می‌شود."}
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginTop: "24px" }}>
                <Link href="/account"><Button>مشاهده سفارش‌ها</Button></Link>
                <Link href="/shop"><Button variant="secondary">بازگشت به فروشگاه</Button></Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
