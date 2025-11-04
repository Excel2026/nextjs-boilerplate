// app/draw-history/page.tsx
"use client";

export default function DrawHistoryPage() {
  return (
    <main
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('/Draw%20History%20Page%20Background%20v1.png')",
      }}
    >
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-5 lg:px-8 py-5 sm:py-8 lg:py-10">
        <div className="rounded-2xl bg-black/70 p-4 sm:p-5 lg:p-6 shadow-lg ring-1 ring-white/10 backdrop-blur">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            Draw History
          </h1>

          {/* ====== YOUR EXISTING HISTORY TABLE/COMPONENTS GO HERE ====== */}
          {/* Example placeholder (remove when you drop in your table): */}
          <p className="mt-3 text-sm sm:text-base text-gray-200">
            Your draw history table renders here.
          </p>
        </div>
      </div>
    </main>
  );
}
