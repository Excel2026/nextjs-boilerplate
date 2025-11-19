// app/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "../track";

export default function Header() {
  const pathname = usePathname();

  const handleClick = (label: string) => {
    trackEvent("nav_click", { label });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">Run by</span>
          <Link
            href="/"
            onClick={() => handleClick("Home")}
            className="bg-clip-text text-lg font-semibold text-transparent [background-image:linear-gradient(90deg,#ffd34d,#ad7aff)]"
          >
            Best Bet
          </Link>
        </div>

        <nav className="flex gap-6 text-sm">
          <Link
            href="/"
            onClick={() => handleClick("Home")}
            className={pathname === "/" ? "text-yellow-300" : "text-gray-300"}
          >
            Home
          </Link>

          <Link
            href="/predictions"
            onClick={() => handleClick("Predictions")}
            className={
              pathname === "/predictions" ? "text-yellow-300" : "text-gray-300"
            }
          >
            Predictions
          </Link>

          <Link
            href="/draw-history"
            onClick={() => handleClick("Draw History")}
            className={
              pathname === "/draw-history" ? "text-yellow-300" : "text-gray-300"
            }
          >
            Draw History
          </Link>

          <Link
            href="/subscription"
            onClick={() => handleClick("Subscription Plans")}
            className={
              pathname === "/subscription" ? "text-yellow-300" : "text-gray-300"
            }
          >
            Subscription Plans
          </Link>
        </nav>
      </div>
    </header>
  );
}
