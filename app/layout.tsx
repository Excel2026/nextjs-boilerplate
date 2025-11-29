import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Bet — NC Pick 3",
  description: "The Most Accurate Pick 3 Predictions On The Planet!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        {/* HEADER */}
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-3 md:flex-row md:justify-between">
            {/* Brand: hidden on mobile, visible on md+ */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-300">Run by</span>
              <Link
                href="/"
                className="bg-clip-text text-lg font-semibold text-transparent [background-image:linear-gradient(90deg,#ffd34d,#ad7aff)]"
              >
                Best Bet
              </Link>
            </div>

            {/* NAVIGATION */}
            <nav className="w-full md:w-auto mt-4 md:mt-0">
              {/* 
                Mobile: stacked vertically, centered, big gaps (space-y-6)
                Desktop (md+): inline row with gap-6
              */}
              <div className="w-full text-center space-y-6 md:space-y-0 md:flex md:items-center md:justify-center md:gap-6">
                <Link
                  href="/pick3"
                  className="block text-lg font-semibold text-white hover:text-yellow-300 transition-colors md:text-sm"
                >
                  Predictions
                </Link>

                <Link
                  href="/draw-history"
                  className="block text-lg font-semibold text-white hover:text-yellow-300 transition-colors md:text-sm"
                >
                  Draw History
                </Link>

                <Link
                  href="/plans"
                  className="block text-lg font-semibold text-white hover:text-yellow-300 transition-colors md:text-sm"
                >
                  Subscription Plans
                </Link>
              </div>
            </nav>
          </div>
        </header>

        {/* PAGE CONTENT */}
        {children}
      </body>
    </html>
  );
}
