"use client";

export default function CheckoutButton() {
  const handleClick = () => {
    alert("Checkout feature coming soon!");
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 transition"
    >
      Buy Now
    </button>
  );
}
