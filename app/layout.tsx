// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";

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
      <head>
        {/* Ensure correct scaling on iOS/Android */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
