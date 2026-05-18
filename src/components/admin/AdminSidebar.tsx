"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BarChart3, Boxes, LineChart, LogOut, Settings, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { SaharLogo } from "@/components/ui/sahar-logo";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/analytics", label: "Analytics", icon: LineChart },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 border-r border-gold/10 bg-black/20 p-5 backdrop-blur-2xl lg:block">
      <Link href="/admin/dashboard" className="mb-10 block">
        <SaharLogo className="h-24 w-40 rounded-[1.5rem] p-3" imageClassName="p-0" fallbackClassName="text-3xl" />
        <span className="mt-3 block">
          <span className="block font-serif text-2xl tracking-[0.22em] text-ivory">SAHAR</span>
          <span className="block text-[10px] uppercase tracking-[0.32em] text-gold/70">Admin</span>
        </span>
      </Link>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition",
                active
                  ? "border-gold/30 bg-gold/10 text-gold"
                  : "border-transparent text-ivory/62 hover:border-gold/15 hover:bg-white/[0.04] hover:text-ivory"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="mt-10 flex w-full items-center gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100 transition hover:border-red-300/40"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
