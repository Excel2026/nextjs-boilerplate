"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const nav = [
    { href: "/", label: "Home" },
    { href: "/pick3", label: "Predictions" },
    { href: "/draw-history", label: "Draw History" },
    { href: "/plans", label: "Subscription Plans" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-3 md:flex-row md:justify-between">
        {/* Brand */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm text-gray-300">Run by</span>
          <Link
            href="/"
            className="bg-clip-text text-lg font-semibold text-transparent [background-image:linear-gradient(90deg,#ffd34d,#ad7aff)]"
          >
            Best Bet
          </Link>
        </div>

        {/* NAV */}
        <nav className="w-full md:w-auto mt-4 md:mt-0">
          <div className="w-full text-center space-y-6 md:space-y-0 md:flex md:items-center md:justify-center md:gap-6">
            {nav.map((n) => {
              // Hide link for the current page
              if (pathname === n.href) return null;
              if (pathname === "/" && n.href === "/") return null;

              // EXTRA RULE: on Game 2, hide the "Predictions" link (/pick3)
              if (pathname === "/game2" && n.href === "/pick3") return null;

              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className="block text-lg font-semibold text-white hover:text-yellow-300 transition-colors md:text-sm"
                >
                  {n.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
