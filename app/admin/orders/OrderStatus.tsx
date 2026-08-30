"use client";

import { useState } from "react";

const statuses = [
  ["pending", "در انتظار"],
  ["paid", "پرداخت شده"],
  ["processing", "در حال پردازش"],
  ["shipped", "ارسال شده"],
  ["delivered", "تحویل شده"],
  ["cancelled", "لغو شده"],
];

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
        throw new Error();
      }

      setStatus(value);
    } catch {
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
    >
      {statuses.map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}