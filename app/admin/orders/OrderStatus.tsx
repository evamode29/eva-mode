"use client";

import { useState } from "react";

const statuses = [
  ["pending", "در انتظار"],
  ["paid", "پرداخت شده"],
  ["processing", "در حال پردازش"],
  ["shipped", "ارسال شده"],
  ["delivered", "تحویل شده"],
  ["cancelled", "لغو شده"],
] as const;

export default function OrderStatus({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function updateStatus(value: string) {
    if (value === status) {
      return;
    }

    const previousStatus = status;

    setStatus(value);
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: value,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }
    } catch {
      setStatus(previousStatus);
      alert("تغییر وضعیت انجام نشد.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={status}
      disabled={loading}
      onChange={(event) =>
        updateStatus(event.target.value)
      }
      aria-label="وضعیت سفارش"
      className="rounded-lg border border-[#ded5cc] bg-white px-3 py-2 text-sm text-[#24211f] outline-none transition focus:border-[#9a8170]"
    >
      {statuses.map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}