// app/history/layout.tsx
export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative">
      {/* Full-viewport background image for /history only */}
      <div
        aria-hidden
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("/Draw%20History%20Page%20Background%20v1.png")',
        }}
      />
      {/* Subtle veil to keep table readable */}
      <div className="fixed inset-0 z-10 bg-black/25" />

      {/* Page content sits above the background + veil */}
      <div className="relative z-20">{children}</div>
    </section>
  );
}
