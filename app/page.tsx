// app/page.tsx
"use client";

export default function HomePage() {
  return (
    <main
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        // Money background
        backgroundImage:
          "url('/Landing%20page%20background%20v2.png')",
      }}
    >
      {/* Centered content container with padding that scales for mobile */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
        {/* HERO IMAGE — the “balls” logo */}
        <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10">
          <img
            src="/Best%20Bet%20Logo%20v1%20-%2010-28-2025.png"
            alt="Best Bet Hero"
            className="block h-auto w-full"
          />
        </div>

        {/* Intro / CTA card */}
        <section className="mt-6 sm:mt-8 lg:mt-10">
          <div className="rounded-2xl bg-black/70 p-5 sm:p-6 lg:p-8 shadow-lg ring-1 ring-white/10 backdrop-blur">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-300 tracking-tight">
              Welcome to your VIP Source!
            </h1>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-200">
              The Most Accurate Pick 3 Predictions On The Planet!
            </p>

            <p className="mt-4 text-sm sm:text-base text-gray-300">
              Real-time draw history and live predictions daily.
            </p>

            <div className="mt-5">
              <a
                href="/plans"
                className="inline-block rounded-full px-5 py-2 text-sm sm:text-base font-semibold shadow-md ring-1 ring-white/10 bg-indigo-500 hover:bg-indigo-400 transition"
              >
                Become a Member
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
