import Link from "next/link";
import { CheckCircle2, MessageCircle, ShoppingBag } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default async function OrderSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ orderNumber?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawOrderNumber = Array.isArray(params.orderNumber) ? params.orderNumber[0] : params.orderNumber;
  const orderNumber = rawOrderNumber?.trim();
  const hasOrderNumber = Boolean(orderNumber);

  return (
    <section className="min-h-screen px-4 py-24 sm:px-5 sm:py-32">
      <div className="mx-auto max-w-2xl rounded-[1.25rem] border border-gold/15 bg-white/[0.045] p-6 text-center shadow-gold backdrop-blur-xl sm:rounded-[1.5rem] sm:p-8 sm:shadow-glow sm:backdrop-blur-2xl">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-emerald/35 bg-emerald/10 text-emerald sm:h-16 sm:w-16">
          <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8" />
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.24em] text-gold/70 sm:tracking-[0.34em]">Order Received</p>
        <h1 className="mt-3 font-serif text-4xl leading-none text-ivory sm:text-5xl">Your order has been received</h1>
        {hasOrderNumber ? (
          <p className="mt-5 text-base text-ivory/65 sm:text-lg">
            Order Number: <span className="text-gold">{orderNumber}</span>
          </p>
        ) : (
          <p className="mt-5 rounded-2xl border border-gold/15 bg-white/[0.035] p-4 text-sm text-ivory/60">
            Your order was received, but the order number was not included in this link.
          </p>
        )}
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ivory/55 sm:text-base sm:leading-7">
          We saved your order and prepared the WhatsApp message so Sahar can confirm the details with you.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold text-night transition hover:bg-ivory"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
          <a
            href={buildWhatsAppUrl(
              hasOrderNumber
                ? `Hello Sahar, I want to ask about order ${orderNumber}.`
                : "Hello Sahar, I want to ask about my recent order."
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-emerald/30 px-6 text-sm font-semibold text-emerald transition hover:border-emerald/60"
          >
            <MessageCircle className="h-4 w-4" />
            Contact on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
