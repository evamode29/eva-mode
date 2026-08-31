import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

const statuses = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    if (!statuses.includes(body.status)) {
      return NextResponse.json(
        {
          error: "وضعیت سفارش نامعتبر است.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await supabaseServer
      .from("orders")
      .update({
        status: body.status,
      })
      .eq("id", id)
      .select("id, order_number, status")
      .single();

    if (error) {
      console.error("Update order status error:", error);

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      order: data,
    });
  } catch (error) {
    console.error("Order status error:", error);

    return NextResponse.json(
      {
        error: "خطا در تغییر وضعیت سفارش.",
      },
      {
        status: 500,
      }
    );
  }
}