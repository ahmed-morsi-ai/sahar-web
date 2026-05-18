"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { SaharLogo } from "@/components/ui/sahar-logo";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gold/10 bg-night/85 p-4 backdrop-blur-2xl lg:hidden">
      <div className="flex items-center justify-between">
        <Link href="/admin/dashboard" aria-label="Sahar admin dashboard">
          <SaharLogo className="h-12 w-32 rounded-2xl p-1.5" imageClassName="p-0" fallbackClassName="text-xl" />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-full border border-gold/20 text-gold"
          aria-label="Open admin navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open ? (
        <div className="mt-4 grid gap-2">
          {[
            ["Dashboard", "/admin/dashboard"],
            ["Analytics", "/admin/analytics"],
            ["Orders", "/admin/orders"],
            ["Products", "/admin/products"],
            ["Settings", "/admin/settings"]
          ].map(([label, href]) => (
            <Link key={href} href={href} className="rounded-xl border border-gold/10 px-4 py-3 text-sm text-ivory/75">
              {label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-2 rounded-xl border border-red-400/20 px-4 py-3 text-sm text-red-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
