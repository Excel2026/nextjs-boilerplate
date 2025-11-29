import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure standard Node runtime (has env vars)

export async function GET() {
  const present = (k: string) => (process.env[k] ? "yes" : "no");
  const len = (k: string) => (process.env[k]?.length ?? 0);

  return NextResponse.json({
    STRIPE_SECRET_KEY: { present: present("STRIPE_SECRET_KEY"), length: len("STRIPE_SECRET_KEY") },
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
      present: present("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
      length: len("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
    },
    STRIPE_PRICE_ID: { present: present("STRIPE_PRICE_ID"), length: len("STRIPE_PRICE_ID") },
    NEXT_PUBLIC_SITE_URL: { present: present("NEXT_PUBLIC_SITE_URL"), value: process.env.NEXT_PUBLIC_SITE_URL },
    note: "No secret values are returned—only presence/length."
  });
}
