"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FAQAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.question} className="rounded-2xl border border-gold/15 bg-white/[0.04]">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
            onClick={() => setOpen(open === index ? -1 : index)}
          >
            <span className="font-serif text-xl text-ivory">{item.question}</span>
            <ChevronDown className={cn("h-4 w-4 shrink-0 text-gold transition", open === index && "rotate-180")} />
          </button>
          {open === index ? <p className="px-5 pb-5 leading-7 text-ivory/62">{item.answer}</p> : null}
        </div>
      ))}
    </div>
  );
}
