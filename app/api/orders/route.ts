import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

type OrderItemInput = {
  productId: string;
  variantId: string;
  quantity: number;
};

type OrderRequest = {
  customer: {
    fullName: string;
    mobile: string;
    province: string;
    city: string;
    address: string;
    postalCode: string;
  };
  items: OrderItemInput[];
};

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `EVA-${timestamp}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as OrderRequest;

    /* =========================================
       VALIDATE CUSTOMER
    ========================================= */

    if (
      !body.customer ||
      !body.customer.fullName?.trim() ||
      !body.customer.mobile?.trim() ||
      !body.customer.province?.trim() ||
      !body.customer.city?.trim() ||
      !body.customer.address?.trim() ||
      !body.customer.postalCode?.trim()
    ) {
      return NextResponse.json(
        {
          error: "اطلاعات گیرنده کامل نیست.",
        },
        { status: 400 }
      );
    }

    /* =========================================
       VALIDATE CART
    ========================================= */

    if (
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        {
          error: "سبد خرید خالی است.",
        },
        { status: 400 }
      );
    }

    /* =========================================
       VALIDATE ITEMS
    ========================================= */

    for (const item of body.items) {
      if (
        !item.variantId ||
        !item.productId ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "اطلاعات یکی از محصولات نامعتبر است.",
          },
          { status: 400 }
        );
      }
    }

    /* =========================================
       GET VARIANTS FROM SUPABASE
    ========================================= */

    const variantIds = [
      ...new Set(
        body.items.map(
          (item) => item.variantId
        )
      ),
    ];

    const { data: variants, error } =
      await supabaseServer
        .from("product_variants")
        .select(
          `
          id,
          product_id,
          sku,
          price,
          stock,
          is_active,

          color:colors (
            name
          ),

          size:sizes (
            name
          ),

          product:products (
            name
          )
        `
        )
        .in("id", variantIds);

    if (error) {
      throw new Error(
        `خطا در دریافت محصولات: ${error.message}`
      );
    }

    if (
      !variants ||
      variants.length !== variantIds.length
    ) {
      return NextResponse.json(
        {
          error:
            "یکی از محصولات دیگر در دسترس نیست.",
        },
        { status: 400 }
      );
    }

    /* =========================================
       CALCULATE ORDER
    ========================================= */

    let subtotal = 0;

    const orderItems: {
      product_id: string;
      variant_id: string;
      product_name: string;
      sku: string;
      color_name: string | null;
      size_name: string | null;
      unit_price: number;
      quantity: number;
      line_total: number;
    }[] = [];

    for (const item of body.items) {
      const variant = variants.find(
        (value) =>
          value.id === item.variantId
      );

      if (!variant) {
        return NextResponse.json(
          {
            error:
              "Variant محصول پیدا نشد.",
          },
          { status: 400 }
        );
      }

      /* =====================================
         PRODUCT CHECK
      ===================================== */

      if (
        variant.product_id !==
        item.productId
      ) {
        return NextResponse.json(
          {
            error:
              "اطلاعات محصول معتبر نیست.",
          },
          { status: 400 }
        );
      }

      /* =====================================
         ACTIVE CHECK
      ===================================== */

      if (!variant.is_active) {
        return NextResponse.json(
          {
            error:
              "یکی از محصولات غیرفعال شده است.",
          },
          { status: 400 }
        );
      }

      /* =====================================
         STOCK CHECK
      ===================================== */

      if (
        variant.stock < item.quantity
      ) {
        return NextResponse.json(
          {
            error:
              "موجودی یکی از محصولات کافی نیست.",
          },
          { status: 400 }
        );
      }

      /* =====================================
         PRICE
      ===================================== */

      const unitPrice = Number(
        variant.price
      );

      const lineTotal =
        unitPrice * item.quantity;

      subtotal += lineTotal;

      /* =====================================
         RELATIONS
      ===================================== */

      const color = Array.isArray(
        variant.color
      )
        ? variant.color[0]
        : variant.color;

      const size = Array.isArray(
        variant.size
      )
        ? variant.size[0]
        : variant.size;

      const product = Array.isArray(
        variant.product
      )
        ? variant.product[0]
        : variant.product;

      orderItems.push({
        product_id:
          variant.product_id,

        variant_id:
          variant.id,

        product_name:
          product?.name ?? "محصول",

        sku:
          variant.sku,

        color_name:
          color?.name ?? null,

        size_name:
          size?.name ?? null,

        unit_price:
          unitPrice,

        quantity:
          item.quantity,

        line_total:
          lineTotal,
      });
    }

    /* =========================================
       SHIPPING
    ========================================= */

    const shippingAmount = 0;

    const totalAmount =
      subtotal + shippingAmount;

    /* =========================================
       ORDER NUMBER
    ========================================= */

    const orderNumber =
      generateOrderNumber();

    /* =========================================
       CREATE ORDER
    ========================================= */

    const {
      data: order,
      error: orderError,
    } = await supabaseServer
      .from("orders")
      .insert({
        order_number:
          orderNumber,

        customer_full_name:
          body.customer.fullName.trim(),

        customer_mobile:
          body.customer.mobile.trim(),

        province:
          body.customer.province.trim(),

        city:
          body.customer.city.trim(),

        address:
          body.customer.address.trim(),

        postal_code:
          body.customer.postalCode.trim(),

        subtotal,

        shipping_amount:
          shippingAmount,

        total_amount:
          totalAmount,

        status:
          "pending",

        payment_status:
          "pending",
      })
      .select(
        "id, order_number"
      )
      .single();

    if (
      orderError ||
      !order
    ) {
      throw new Error(
        orderError?.message ??
          "ثبت سفارش ناموفق بود."
      );
    }

    /* =========================================
       CREATE ORDER ITEMS
    ========================================= */

    const itemsWithOrderId =
      orderItems.map(
        (item) => ({
          ...item,
          order_id:
            order.id,
        })
      );

    const {
      error: itemsError,
    } = await supabaseServer
      .from("order_items")
      .insert(
        itemsWithOrderId
      );

    /* =========================================
       ROLLBACK ORDER
    ========================================= */

    if (itemsError) {
      await supabaseServer
        .from("orders")
        .delete()
        .eq(
          "id",
          order.id
        );

      throw new Error(
        itemsError.message
      );
    }

    /* =========================================
       SUCCESS
    ========================================= */

    return NextResponse.json({
      success: true,

      orderId:
        order.id,

      orderNumber:
        order.order_number,

      subtotal,

      shippingAmount,

      totalAmount,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "خطایی در ثبت سفارش رخ داد.",
      },
      {
        status: 500,
      }
    );
  }
}