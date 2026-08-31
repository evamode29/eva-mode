import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

type OrderItemInput = {
productId: string;
variantId: string;
quantity: number;
};

type CreateOrderBody = {
customerFullName?: string;
customerMobile?: string;
province?: string;
city?: string;
address?: string;
postalCode?: string;
items?: OrderItemInput[];
};

type VariantRow = {
id: string;
product_id: string;
sku: string;
stock: number;
price: number;
is_active: boolean;
color_id: string | null;
size_id: string | null;
};

function normalizeText(value: unknown): string {
return typeof value === "string" ? value.trim() : "";
}

function isValidIranianMobile(mobile: string): boolean {
return /^09\d{9}$/.test(mobile);
}

function isValidPostalCode(postalCode: string): boolean {
return /^\d{10}$/.test(postalCode);
}

function generateOrderNumber(): string {
const now = new Date();

const date =
`${now.getFullYear()}` +
`${String(now.getMonth() + 1).padStart(2, "0")}` +
`${String(now.getDate()).padStart(2, "0")}`;

const random = Math.floor(
100000 + Math.random() * 900000
);

return `EVA-${date}-${random}`;
}

export async function POST(request: Request) {
let createdOrderId: string | null = null;

try {
const body = (await request.json()) as CreateOrderBody;

const customerFullName = normalizeText(
  body.customerFullName
);

const customerMobile = normalizeText(
  body.customerMobile
);

const province = normalizeText(body.province);
const city = normalizeText(body.city);
const address = normalizeText(body.address);
const postalCode = normalizeText(body.postalCode);

if (
  !customerFullName ||
  !customerMobile ||
  !province ||
  !city ||
  !address ||
  !postalCode
) {
  return NextResponse.json(
    {
      success: false,
      error: "لطفاً همه اطلاعات ارسال را کامل کنید.",
    },
    { status: 400 }
  );
}

if (!isValidIranianMobile(customerMobile)) {
  return NextResponse.json(
    {
      success: false,
      error: "شماره موبایل واردشده معتبر نیست.",
    },
    { status: 400 }
  );
}

if (!isValidPostalCode(postalCode)) {
  return NextResponse.json(
    {
      success: false,
      error: "کد پستی باید ۱۰ رقم باشد.",
    },
    { status: 400 }
  );
}

if (!Array.isArray(body.items) || body.items.length === 0) {
  return NextResponse.json(
    {
      success: false,
      error: "سبد خرید خالی است.",
    },
    { status: 400 }
  );
}

const items: OrderItemInput[] = body.items.map(
  (item) => ({
    productId: normalizeText(item.productId),
    variantId: normalizeText(item.variantId),
    quantity: Number(item.quantity),
  })
);

for (const item of items) {
  if (
    !item.productId ||
    !item.variantId ||
    !Number.isInteger(item.quantity) ||
    item.quantity < 1 ||
    item.quantity > 20
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "اطلاعات یکی از محصولات سفارش نامعتبر است.",
      },
      { status: 400 }
    );
  }
}

const variantIds = [
  ...new Set(
    items.map((item) => item.variantId)
  ),
];

const { data: variants, error: variantsError } =
  await supabaseServer
    .from("product_variants")
    .select(
      `
      id,
      product_id,
      sku,
      stock,
      price,
      is_active,
      color_id,
      size_id
    `
    )
    .in("id", variantIds);

if (variantsError) {
  console.error(
    "Load variants error:",
    variantsError
  );

  return NextResponse.json(
    {
      success: false,
      error: "خطا در بررسی موجودی محصولات.",
    },
    { status: 500 }
  );
}

if (
  !variants ||
  variants.length !== variantIds.length
) {
  return NextResponse.json(
    {
      success: false,
      error: "یکی از محصولات دیگر موجود نیست.",
    },
    { status: 400 }
  );
}

const variantMap = new Map<string, VariantRow>();

for (const variant of variants) {
  variantMap.set(
    variant.id,
    variant as VariantRow
  );
}

const orderItems = [];
let totalAmount = 0;

for (const item of items) {
  const variant = variantMap.get(
    item.variantId
  );

  if (!variant) {
    return NextResponse.json(
      {
        success: false,
        error: "تنوع محصول پیدا نشد.",
      },
      { status: 400 }
    );
  }

  if (
    variant.product_id !== item.productId
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "محصول و تنوع انتخاب‌شده هماهنگ نیستند.",
      },
      { status: 400 }
    );
  }

  if (!variant.is_active) {
    return NextResponse.json(
      {
        success: false,
        error: `محصول با SKU ${variant.sku} فعال نیست.`,
      },
      { status: 400 }
    );
  }

  if (
    Number(variant.stock) < item.quantity
  ) {
    return NextResponse.json(
      {
        success: false,
        error: `موجودی محصول با SKU ${variant.sku} کافی نیست.`,
      },
      { status: 400 }
    );
  }

  const unitPrice = Number(
    variant.price
  );

  if (
    !Number.isFinite(unitPrice) ||
    unitPrice < 0
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "قیمت یکی از محصولات نامعتبر است.",
      },
      { status: 400 }
    );
  }

  const lineTotal =
    unitPrice * item.quantity;

  totalAmount += lineTotal;

  orderItems.push({
    product_id: item.productId,
    variant_id: item.variantId,
    product_name: "محصول EVA MODE",
    sku: variant.sku,
    color_name: null,
    size_name: null,
    unit_price: unitPrice,
    quantity: item.quantity,
    line_total: lineTotal,
  });
}

if (
  !Number.isFinite(totalAmount) ||
  totalAmount <= 0
) {
  return NextResponse.json(
    {
      success: false,
      error: "مبلغ سفارش نامعتبر است.",
    },
    { status: 400 }
  );
}

const orderNumber =
  generateOrderNumber();

const { data: order, error: orderError } =
  await supabaseServer
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_full_name:
        customerFullName,
      customer_mobile:
        customerMobile,
      province,
      city,
      address,
      postal_code: postalCode,
      subtotal: totalAmount,
      shipping_amount: 0,
      total_amount: totalAmount,
      status: "pending",
      payment_status: "pending",
    })
    .select(
      "id, order_number, subtotal, shipping_amount, total_amount, status, payment_status"
    )
    .single();

if (orderError || !order) {
  console.error(
    "Create order error:",
    orderError
  );

  return NextResponse.json(
    {
      success: false,
      error: "ثبت سفارش انجام نشد.",
    },
    { status: 500 }
  );
}

createdOrderId = order.id;

const itemsToInsert =
  orderItems.map((item) => ({
    ...item,
    order_id: order.id,
  }));

const { error: itemsError } =
  await supabaseServer
    .from("order_items")
    .insert(itemsToInsert);

if (itemsError) {
  console.error(
    "Create order items error:",
    itemsError
  );

  await supabaseServer
    .from("orders")
    .delete()
    .eq("id", order.id);

  createdOrderId = null;

  return NextResponse.json(
    {
      success: false,
      error: "اقلام سفارش ثبت نشدند.",
    },
    { status: 500 }
  );
}

/*
 * Decrease stock atomically through Supabase RPC.
 */

const { error: stockError } =
  await supabaseServer.rpc(
    "decrement_order_stock",
    {
      p_items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    }
  );

if (stockError) {
  console.error(
    "Decrement stock error:",
    stockError
  );

  await supabaseServer
    .from("order_items")
    .delete()
    .eq("order_id", order.id);

  await supabaseServer
    .from("orders")
    .delete()
    .eq("id", order.id);

  createdOrderId = null;

  return NextResponse.json(
    {
      success: false,
      error:
        stockError.message ===
        "insufficient stock"
          ? "موجودی یکی از محصولات کافی نیست."
          : "رزرو موجودی انجام نشد.",
    },
    { status: 409 }
  );
}

return NextResponse.json(
  {
    success: true,
    message: "سفارش با موفقیت ثبت شد.",
    order: {
      id: order.id,
      orderNumber:
        order.order_number,
      subtotal:
        order.subtotal,
      shippingAmount:
        order.shipping_amount,
      totalAmount:
        order.total_amount,
      status:
        order.status,
      paymentStatus:
        order.payment_status,
    },
  },
  { status: 201 }
);

} catch (error) {
console.error(
"Create order unexpected error:",
error
);

if (createdOrderId) {
  await supabaseServer
    .from("order_items")
    .delete()
    .eq(
      "order_id",
      createdOrderId
    );

  await supabaseServer
    .from("orders")
    .delete()
    .eq("id", createdOrderId);
}

return NextResponse.json(
  {
    success: false,
    error: "خطایی در ثبت سفارش رخ داد.",
  },
  { status: 500 }
);

}
}
