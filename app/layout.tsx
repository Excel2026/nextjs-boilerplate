import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Bet — NC Pick 3",
  description: "The Most Accurate Pick 3 Predictions On The Planet!",
};

function Header() {
  const pathname = usePathname();

  // Navigation items
  const nav = [
    { href: "/", label: "Home" },
    { href: "/pick3", label: "Predictions" },
    { href: "/draw-history", label: "Draw History" },
    { href: "/plans", label: "Subscription Plans" },
  ];

  return (
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
          <div className="w-full text-center space-y-6 md:space-y-0 md:flex md:items-center md:justify-center md:gap-6">
            {nav.map((n) => {
              // Hide the link for the current page
              if (pathname === n.href) return null;
              if (pathname === "/" && n.href === "/") return null;

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
