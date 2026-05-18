"use client";

import { Send } from "lucide-react";
import { useState } from "react";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="flex w-full max-w-md overflow-hidden rounded-full border border-gold/20 bg-white/[0.04] p-1"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder={submitted ? "Welcome to the night list" : "Email for private releases"}
        className="min-w-0 flex-1 border-0 bg-transparent px-4 text-sm text-ivory placeholder:text-ivory/40 focus:ring-0"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="grid h-11 w-11 place-items-center rounded-full bg-gold text-night transition hover:bg-[#f4d8aa]"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
