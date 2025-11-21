// app/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { trackEvent } from "../track";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = [
    { href: "/", label: "Home", tag: "nav_home" },
    { href: "/pick3", label: "Predictions", tag: "nav_predictions" },
    { href: "/draw-history", label: "Draw History", tag: "nav_draw_history" },
    {
      href: "/plans",
      label: "Subscription Plans",
      tag: "nav_plans_subscribe",
    },
  ];

  function handleNavClick(item: (typeof nav)[number]) {
    // Generic nav click event
    trackEvent("nav_click", {
      href: item.href,
      label: item.label,
      tag: item.tag,
    });

    // Extra special events for key links
    if (item.href === "/pick3") {
      trackEvent("open_predictions_page", {});
    }
    if (item.href === "/plans") {
      trackEvent("open_subscription_plans", {});
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur">
      {/* ⭐ HEADER ROW — full width now */}
      <div className="flex w-full items-center justify-between px-3 py-3 sm:px-4 lg:px-6">
        {/* ⭐ LEFT SIDE — “Run by Best Bet” */}
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-gray-400">Run by</span>
          <Link
            href="/"
            onClick={() =>
              trackEvent("logo_click", {
                location: "header",
              })
            }
            className="bg-clip-text text-lg font-semibold text-transparent [background-image:linear-gradient(90deg,#ffd34d,#ad7aff)]"
          >
            Best Bet
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {nav.map((n) => {
            if (pathname === "/" && n.href === "/") return null;

            const active =
              pathname === n.href ||
              (n.href !== "/" && pathname.startsWith(n.href));

            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => handleNavClick(n)}
                className={`transition-colors hover:text-white ${
                  active ? "text-white" : "text-gray-300"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm text-gray-200 ring-1 ring-white/15 hover:bg-white/5 md:hidden"
          onClick={() => {
            setOpen((v) => !v);
            trackEvent("mobile_menu_toggle", {
              open: !open,
              location: "header",
            });
          }}
          aria-label="Toggle navigation"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-white/10 bg-black/90 backdrop-blur md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-3 py-2 sm:px-4 lg:px-6">
            {nav.map((n) => {
              if (pathname === "/" && n.href === "/") return null;

              const active =
                pathname === n.href ||
                (n.href !== "/" && pathname.startsWith(n.href));

              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => {
                    handleNavClick(n);
                    setOpen(false);
                  }}
                  className={`rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 ${
                    active ? "text-white" : "text-gray-300"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
