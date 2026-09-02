import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseServer } from "@/lib/supabase-server";

type OrderItemInput = { productId: string; variantId: string; quantity: number };
type CreateOrderBody = {
  customerFullName?: unknown; customerMobile?: unknown; province?: unknown;
  city?: unknown; address?: unknown; postalCode?: unknown; items?: unknown;
};

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const validUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const validMobile = (value: string) => /^09\d{9}$/.test(value);
const validPostalCode = (value: string) => /^\d{10}$/.test(value);

export async function POST(request: Request) {
  try {
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: "برای ثبت سفارش ابتدا وارد حساب کاربری شوید." }, { status: 401 });

    const body = (await request.json()) as CreateOrderBody;
    const customerFullName = text(body.customerFullName);
    const customerMobile = text(body.customerMobile);
    const province = text(body.province);
    const city = text(body.city);
    const address = text(body.address);
    const postalCode = text(body.postalCode);

    if (!customerFullName || !customerMobile || !province || !city || !address || !postalCode)
      return NextResponse.json({ success: false, error: "لطفاً همه اطلاعات ارسال را کامل کنید." }, { status: 400 });
    if (customerFullName.length > 120 || province.length > 80 || city.length > 80 || address.length > 500)
      return NextResponse.json({ success: false, error: "یکی از اطلاعات واردشده بیش از حد مجاز است." }, { status: 400 });
    if (!validMobile(customerMobile)) return NextResponse.json({ success: false, error: "شماره موبایل واردشده معتبر نیست." }, { status: 400 });
    if (!validPostalCode(postalCode)) return NextResponse.json({ success: false, error: "کد پستی باید ۱۰ رقم باشد." }, { status: 400 });

    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50)
      return NextResponse.json({ success: false, error: "سبد خرید خالی یا نامعتبر است." }, { status: 400 });

    const merged = new Map<string, OrderItemInput>();
    for (const raw of body.items) {
      if (!raw || typeof raw !== "object") return NextResponse.json({ success: false, error: "اطلاعات یکی از محصولات نامعتبر است." }, { status: 400 });
      const item = raw as Record<string, unknown>;
      const productId = text(item.productId);
      const variantId = text(item.variantId);
      const quantity = Number(item.quantity);
      if (!validUuid(productId) || !validUuid(variantId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20)
        return NextResponse.json({ success: false, error: "اطلاعات یکی از محصولات سفارش نامعتبر است." }, { status: 400 });
      const key = `${productId}:${variantId}`;
      const nextQuantity = (merged.get(key)?.quantity ?? 0) + quantity;
      if (nextQuantity > 20) return NextResponse.json({ success: false, error: "تعداد یک محصول بیشتر از حد مجاز است." }, { status: 400 });
      merged.set(key, { productId, variantId, quantity: nextQuantity });
    }

    const { data, error } = await supabaseServer.rpc("create_order_atomic", {
      p_user_id: user.id,
      p_customer_full_name: customerFullName,
      p_customer_mobile: customerMobile,
      p_province: province,
      p_city: city,
      p_address: address,
      p_postal_code: postalCode,
      p_items: [...merged.values()],
    });

    if (error || !data?.[0]) {
      console.error("Create order RPC error:", error);
      const message = error?.message ?? "";
      const conflict = message.includes("insufficient stock") || message.includes("product unavailable");
      const status = message.includes("invalid variant") || message.includes("invalid quantity") ? 400 : conflict ? 409 : 500;
      const userMessage = message.includes("insufficient stock") ? "موجودی یکی از محصولات کافی نیست." : message.includes("product unavailable") ? "یکی از محصولات دیگر قابل سفارش نیست." : message.includes("invalid variant") ? "یکی از محصولات انتخاب‌شده معتبر نیست." : message.includes("invalid quantity") ? "تعداد یکی از محصولات نامعتبر است." : "ثبت سفارش انجام نشد.";
      return NextResponse.json({ success: false, error: userMessage }, { status });
    }

    const order = data[0];
    return NextResponse.json({
      success: true,
      message: "سفارش با موفقیت ثبت شد.",
      order: {
        id: order.id,
        orderNumber: order.order_number,
        subtotal: Number(order.subtotal),
        shippingAmount: Number(order.shipping_amount),
        totalAmount: Number(order.total_amount),
        status: order.status,
        paymentStatus: order.payment_status,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Create order unexpected error:", error);
    return NextResponse.json({ success: false, error: "خطایی در ثبت سفارش رخ داد." }, { status: 500 });
  }
}
