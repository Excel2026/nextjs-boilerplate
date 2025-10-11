import CheckoutButton from "../components/CheckoutButton";

export default function Page() {
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Excel-style App (Payments Starter)</h1>
      <p style={{ color: "#555", marginBottom: 24 }}>
        This is your live site. Click the button below to open Stripe Checkout (Test Mode).
      </p>
      <CheckoutButton />
      <div style={{ marginTop: 24, fontSize: 14, color: "#777" }}>
        Use Stripe test card <code>4242 4242 4242 4242</code>, any future expiry, any CVC, any ZIP.
      </div>
    </main>
  );
}

