"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <h1 className="mb-4 text-3xl font-bold text-[#e7c58d]">
        Something went wrong
      </h1>
      <p className="mb-6 max-w-xl text-white/60">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-full bg-[#e7c58d] px-6 py-3 font-semibold text-black"
      >
        Try Again
      </button>
    </main>
  );
}
