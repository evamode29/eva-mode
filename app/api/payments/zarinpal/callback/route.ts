import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

const ZARINPAL_VERIFY_URL = "https://api.zarinpal.com/pg/v4/payment/verify.json";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const authority = url.searchParams.get("Authority")?.trim() ?? "";
  const status = url.searchParams.get("Status")?.trim().toUpperCase() ?? "";

  if (!authority) {
    return NextResponse.redirect(new URL("/payment/result?status=failed", request.url));
  }

  const { data: order, error: orderError } = await supabaseServer
    .from("orders")
    .select("id, order_number, total_amount, payment_status, payment_authority")
    .eq("payment_authority", authority)
    .single();

  if (orderError || !order) {
    return NextResponse.redirect(new URL("/payment/result?status=failed", request.url));
  }

  if (order.payment_status === "paid") {
    return NextResponse.redirect(new URL(`/payment/result?status=success&order=${encodeURIComponent(order.order_number)}`, request.url));
  }

  if (status !== "OK") {
    await supabaseServer.from("orders").update({ payment_status: "failed" }).eq("id", order.id);
    return NextResponse.redirect(new URL(`/payment/result?status=cancelled&order=${encodeURIComponent(order.order_number)}`, request.url));
  }

  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  if (!merchantId) {
    return NextResponse.redirect(new URL("/payment/result?status=failed", request.url));
  }

  const amountRial = Math.round(Number(order.total_amount) * 10);
  const response = await fetch(ZARINPAL_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ merchant_id: merchantId, amount: amountRial, authority }),
    cache: "no-store",
  });

  const result = (await response.json()) as {
    data?: { code?: number; ref_id?: number | string };
    errors?: unknown;
  };

  const code = Number(result.data?.code);
  const refId = result.data?.ref_id != null ? String(result.data.ref_id) : null;

  if (code === 100 || code === 101) {
    const { error: updateError } = await supabaseServer
      .from("orders")
      .update({
        payment_status: "paid",
        payment_ref_id: refId ?? undefined,
        payment_paid_at: new Date().toISOString(),
      })
      .eq("id", order.id)
      .eq("payment_authority", authority);

    if (!updateError) {
      return NextResponse.redirect(new URL(`/payment/result?status=success&order=${encodeURIComponent(order.order_number)}`, request.url));
    }
  }

  console.error("ZarinPal verify failed:", result);
  await supabaseServer.from("orders").update({ payment_status: "failed" }).eq("id", order.id);
  return NextResponse.redirect(new URL(`/payment/result?status=failed&order=${encodeURIComponent(order.order_number)}`, request.url));
}
