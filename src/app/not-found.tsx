import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <h1 className="mb-4 text-4xl font-bold text-[#e7c58d]">404</h1>
      <p className="mb-6 text-white/60">Page not found.</p>
      <Link
        href="/"
        className="rounded-full bg-[#e7c58d] px-6 py-3 font-semibold text-black"
      >
        Back Home
      </Link>
    </main>
  );
}
