"use client";

import { FormEvent, useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { SaharLogo } from "@/components/ui/sahar-logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(searchParams.get("error") ? "Invalid admin credentials." : "");
  const [isPending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Please enter your admin email and password.");
      return;
    }

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: trimmedEmail,
        password,
        redirect: false
      });

      if (result?.error) {
        setError("Invalid admin credentials.");
        return;
      }

      router.replace("/admin/dashboard");
      router.refresh();
    });
  }

  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-[#030605] px-5 py-16 text-[#f8f0df]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-[#2fc48d]/20 blur-[110px]" />
        <div className="absolute bottom-[-8rem] right-[-8rem] h-96 w-96 rounded-full bg-[#e7c58d]/12 blur-[120px]" />
        <div className="absolute left-[-8rem] top-1/3 h-96 w-96 rounded-full bg-[#2fc48d]/10 blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e7c58d]/80 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(248,240,223,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(248,240,223,0.025)_1px,transparent_1px)] bg-[size:84px_84px] opacity-35" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-[#e7c58d]/45 via-[#2fc48d]/15 to-transparent opacity-75 blur-sm" />
        <form
          onSubmit={submit}
          className="relative overflow-hidden rounded-[2rem] border border-[#e7c58d]/18 bg-white/[0.055] p-6 shadow-[0_0_70px_rgba(47,196,141,0.18)] backdrop-blur-2xl sm:p-8"
        >
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#e7c58d] to-transparent" />

          <div className="text-center">
            <motion.div
              initial={{ rotate: -8, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mx-auto w-fit"
            >
              <SaharLogo
                className="h-28 w-40 rounded-[1.6rem] border-[#e7c58d]/35 bg-[#06150f]/70 p-3 shadow-[0_0_45px_rgba(47,196,141,0.24)]"
                imageClassName="p-0"
                fallbackClassName="text-3xl"
              />
            </motion.div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#e7c58d]/15 bg-black/20 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-[#e7c58d]/75">
              <Sparkles className="h-3.5 w-3.5" />
              SAHAR ADMIN
            </div>
            <h1 className="mt-5 font-serif text-5xl leading-none text-[#f8f0df]">Welcome Back</h1>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#f8f0df]/62">
              Private access for managing Sahar orders and store operations
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <label className="block" htmlFor="admin-email">
              <span className="mb-2 block text-sm text-[#f8f0df]/68">Email address</span>
              <div className="group flex h-[52px] items-center gap-3 rounded-full border border-[#e7c58d]/15 bg-[#030605]/70 px-4 transition focus-within:border-[#e7c58d]/55 focus-within:shadow-[0_0_28px_rgba(231,197,141,0.12)]">
                <Mail className="h-4 w-4 text-[#e7c58d]/70" />
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-[52px] min-w-0 flex-1 border-0 bg-transparent px-0 text-sm text-[#f8f0df] placeholder:text-[#f8f0df]/32 focus:ring-0"
                  placeholder="admin@sahar.com"
                />
              </div>
            </label>

            <label className="block" htmlFor="admin-password">
              <span className="mb-2 block text-sm text-[#f8f0df]/68">Password</span>
              <div className="group flex h-[52px] items-center gap-3 rounded-full border border-[#e7c58d]/15 bg-[#030605]/70 px-4 transition focus-within:border-[#e7c58d]/55 focus-within:shadow-[0_0_28px_rgba(231,197,141,0.12)]">
                <Lock className="h-4 w-4 text-[#e7c58d]/70" />
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-[52px] min-w-0 flex-1 border-0 bg-transparent px-0 text-sm text-[#f8f0df] placeholder:text-[#f8f0df]/32 focus:ring-0"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="grid h-9 w-9 place-items-center rounded-full text-[#f8f0df]/55 transition hover:bg-white/5 hover:text-[#e7c58d]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-[#f8f0df]/62">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-[#e7c58d]/35 bg-[#030605] text-[#2fc48d] focus:ring-[#2fc48d]/30"
              />
              Remember me
            </label>
          </div>

          {error ? (
            <p className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="mt-6 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#e7c58d] px-6 text-sm font-semibold uppercase tracking-[0.22em] text-[#030605] shadow-[0_14px_45px_rgba(231,197,141,0.2)] transition hover:-translate-y-0.5 hover:bg-[#f8f0df] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {isPending ? "Entering..." : "Enter Dashboard"}
          </button>

          <p className="mt-6 text-center text-xs leading-5 text-[#f8f0df]/42">
            Protected Sahar operations area. Authorized administrators only.
          </p>
        </form>
      </motion.div>
    </section>
  );
}
