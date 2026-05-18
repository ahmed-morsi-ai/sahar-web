"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Copy, MessageCircle, Trash2 } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function OrderActions({
  orderId,
  customerPhone,
  whatsappMessage
}: {
  orderId: string;
  customerPhone: string;
  whatsappMessage: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function copyMessage() {
    navigator.clipboard
      .writeText(whatsappMessage)
      .then(() => setMessage("WhatsApp message copied."))
      .catch(() => setMessage("Could not copy the message."));
  }

  function cancelOrder() {
    if (!window.confirm("Cancel this order?")) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`, { method: "DELETE" });
        if (!response.ok) {
          const result = (await response.json().catch(() => null)) as { error?: string } | null;
          setMessage(result?.error ?? "Could not cancel order.");
          return;
        }
        setMessage("Order cancelled.");
        router.refresh();
      } catch {
        setMessage("Network error. Check the dev server port and try again.");
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={copyMessage}
        className="inline-flex items-center gap-2 rounded-full border border-gold/20 px-4 py-2 text-sm text-gold transition hover:border-gold/45"
      >
        <Copy className="h-4 w-4" />
        Copy WhatsApp
      </button>
      <a
        href={buildWhatsAppUrl(whatsappMessage, customerPhone.replace(/\D/g, "") || undefined)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-emerald/25 bg-emerald/10 px-4 py-2 text-sm text-emerald transition hover:border-emerald/45"
      >
        <MessageCircle className="h-4 w-4" />
        Open Chat
      </a>
      <button
        type="button"
        disabled={isPending}
        onClick={cancelOrder}
        className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-4 py-2 text-sm text-red-100 transition hover:border-red-300/45"
      >
        <Trash2 className="h-4 w-4" />
        Cancel Order
      </button>
      {message ? <p className="basis-full text-xs text-gold/75">{message}</p> : null}
    </div>
  );
}
