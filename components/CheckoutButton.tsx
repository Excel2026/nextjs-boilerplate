"use client";
import { useState } from "react";

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  const go = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: 1 }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else alert(data?.error ?? "Unable to start checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={go} disabled={loading} style={{ padding: "10px 16px", fontSize: 16 }}>
      {loading ? "Redirecting..." : "Buy Now"}
    </button>
  );
}
