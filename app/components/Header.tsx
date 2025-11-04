// app/components/Header.tsx
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

  const filteredNav =
    pathname === "/draw-history"
      ? nav.filter((n) => n.href !== "/draw-history")
      : nav;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">Run by</span>
          <Link
            href="/"
            className="bg-clip-text text-lg font-semibold text-transparent [background-image:linear-gradient(90deg,#ffd34d,#ad7aff)]"
          >
            Best Bet
          </Link>
        </div>

        <nav className="flex gap-6 text-sm text-gray-300">
          {filteredNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-white ${
                pathname === item.href ? "text-white font-medium" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
