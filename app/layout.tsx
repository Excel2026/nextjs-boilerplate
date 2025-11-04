// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import header from "./components/header";

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
        <Header />
        {children}
      </body>
    </html>
  );
}
