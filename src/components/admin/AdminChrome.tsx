"use client";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-luxury-radial">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-luxury-radial">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="min-w-0 flex-1 overflow-x-hidden">
          <AdminMobileNav />
          <div className="hidden border-b border-gold/10 bg-night/50 px-10 py-4 backdrop-blur-2xl lg:flex lg:justify-end">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-gold/20 bg-white/[0.04] px-5 text-sm font-semibold text-ivory/75 transition hover:border-red-300/35 hover:bg-red-500/10 hover:text-red-100"
            >
              <LogOut className="h-4 w-4 text-gold" />
              Logout
            </button>
          </div>
          <main className="min-w-0 p-5 sm:p-8 lg:p-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
