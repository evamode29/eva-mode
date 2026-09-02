import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseServer } from "@/lib/supabase-server";

const ZARINPAL_REQUEST_URL = "https://api.zarinpal.com/pg/v4/payment/request.json";
const ZARINPAL_START_PAY_URL = "https://payment.zarinpal.com/pg/StartPay/";

export async function POST(request: Request) {
  try {
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "برای پرداخت وارد حساب کاربری شوید." }, { status: 401 });
    }

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    if (!merchantId) {
      return NextResponse.json({ success: false, error: "درگاه پرداخت هنوز پیکربندی نشده است." }, { status: 503 });
    }

    const body = (await request.json()) as { orderId?: unknown };
    const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
    if (!orderId) {
      return NextResponse.json({ success: false, error: "شناسه سفارش نامعتبر است." }, { status: 400 });
    }

    const { data: order, error: orderError } = await supabaseServer
      .from("orders")
      .select("id, order_number, total_amount, payment_status, customer_mobile")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ success: false, error: "سفارش پیدا نشد." }, { status: 404 });
    }

    if (order.payment_status === "paid") {
      return NextResponse.json({ success: false, error: "این سفارش قبلاً پرداخت شده است." }, { status: 409 });
    }

    const amountToman = Math.round(Number(order.total_amount));
    if (!Number.isFinite(amountToman) || amountToman < 1000) {
      return NextResponse.json({ success: false, error: "مبلغ سفارش برای پرداخت معتبر نیست." }, { status: 400 });
    }

    const callbackUrl = `${new URL(request.url).origin}/api/payments/zarinpal/callback`;
    const response = await fetch(ZARINPAL_REQUEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: amountToman * 10,
        callback_url: callbackUrl,
        description: `EVA MODE ${order.order_number}`,
        mobile: order.customer_mobile,
        order_id: order.order_number,
      }),
      cache: "no-store",
    });

    const result = (await response.json()) as {
      data?: { code?: number; authority?: string };
      errors?: unknown;
    };

    const code = Number(result.data?.code);
    const authority = result.data?.authority;
    if (!response.ok || code !== 100 || !authority) {
      console.error("ZarinPal request failed:", result);
      return NextResponse.json({ success: false, error: "ایجاد تراکنش پرداخت ناموفق بود." }, { status: 502 });
    }

    const { error: updateError } = await supabaseServer
      .from("orders")
      .update({ payment_authority: authority, payment_status: "pending" })
      .eq("id", order.id)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("ZarinPal authority save failed:", updateError);
      return NextResponse.json({ success: false, error: "اطلاعات پرداخت ذخیره نشد." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      authority,
      paymentUrl: `${ZARINPAL_START_PAY_URL}${authority}`,
    });
  } catch (error) {
    console.error("ZarinPal request unexpected error:", error);
    return NextResponse.json({ success: false, error: "خطایی در اتصال به درگاه پرداخت رخ داد." }, { status: 500 });
  }
}
