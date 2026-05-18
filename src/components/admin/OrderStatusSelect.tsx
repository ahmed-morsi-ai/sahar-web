"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { orderStatusLabels, type OrderStatusValue } from "@/types/order";

const statuses: OrderStatusValue[] = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatusValue }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function update(nextStatus: OrderStatusValue) {
    setValue(nextStatus);
    setMessage("");

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus })
        });

        if (!response.ok) {
          const result = (await response.json().catch(() => null)) as { error?: string } | null;
          setValue(status);
          setMessage(result?.error ?? "Could not update status.");
          return;
        }

        setMessage("Status saved.");
        router.refresh();
      } catch {
        setValue(status);
        setMessage("Network error. Check the dev server port and try again.");
      }
    });
  }

  return (
    <div>
      <select
        value={value}
        disabled={isPending}
        onChange={(event) => update(event.target.value as OrderStatusValue)}
        className="h-11 rounded-full border border-gold/20 bg-night px-4 text-sm text-ivory focus:border-gold/50 focus:ring-gold/20"
      >
        {statuses.map((item) => (
          <option key={item} value={item}>
            {orderStatusLabels[item]}
          </option>
        ))}
      </select>
      {message ? <p className="mt-2 text-xs text-gold/80">{message}</p> : null}
    </div>
  );
}
