// app/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = [
    { href: "/", label: "Home" },
    { href: "/pick3", label: "Predictions" },
    { href: "/draw-history", label: "Draw History" },
    { href: "/plans", label: "Subscription Plans" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur">
      {/* TOP ROW */}
      <div className="flex w-full items-center justify-between px-3 py-3 sm:px-4 lg:px-6">
        
        {/* LEFT — “Run by Best Bet” */}
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-gray-400">Run by</span>
          <Link
            href="/"
            className="bg-clip-text text-lg font-semibold text-transparent [background-image:linear-gradient(90deg,#ffd34d,#ad7aff)]"
          >
            Best Bet
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {nav.map((n) => {
            // hide current page
            if (pathname === n.href) return null;
            if (pathname === "/" && n.href === "/") return null;

            const active =
              pathname === n.href ||
              (n.href !== "/" && pathname.startsWith(n.href));

            return (
              <Link
                key={n.href}
                href={n.href}
                className={`transition-colors hover:text-white ${
                  active ? "text-white" : "text-gray-300"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm text-gray-200 ring-1 ring-white/15 hover:bg-white/5"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* MOBILE DRAWER — BIG CENTERED PILLS + FADE DOWN */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur animate-fadeDown">
          <nav className="mx-auto flex w-full flex-col gap-3 px-4 py-4">
            {nav.map((n) => {
              if (pathname === n.href) return null;
              if (pathname === "/" && n.href === "/") return null;

              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="
                    w-full text-center rounded-full
                    bg-white/10 text-white
                    py-3 text-lg font-semibold
                    hover:bg-white/20
                    transition-all duration-200
                  "
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* FADE-DOWN ANIMATION */}
      <style jsx global>{`
        @keyframes fadeDown {
          0% {
            opacity: 0;
            transform: translateY(-6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeDown {
          animation: fadeDown 0.25s ease-out;
        }
      `}</style>
    </header>
  );
}
