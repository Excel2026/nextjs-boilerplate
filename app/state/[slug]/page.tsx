// app/state/[slug]/page.tsx
"use client";

import Link from "next/link";

export default function StatePage({ params }: { params: { slug: string } }) {
  const state = params.slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      {/* BACK LINK */}
      <div className="mb-6">
        <Link href="/" className="text-gray-300 hover:text-white text-sm">
          ← Back to Home
        </Link>
      </div>

      {/* TITLE */}
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-2">
        {state} — Performance Overview (Sample)
      </h1>

      <p className="text-gray-300 max-w-3xl mb-10">
        Sample performance overview for Best Bet's Pick 3 predictions in{" "}
        <strong>{state}</strong>. All statistics below are placeholders and will
        be replaced with live data once we connect our final pipeline — stay
        tuned, we are working hard on our site!
      </p>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* WEEK */}
        <div className="rounded-2xl bg-black/40 border border-white/10 p-6">
          <p className="text-gray-300 text-sm mb-1">This Week (Sample)</p>
          <p className="text-3xl font-bold text-emerald-400 mb-1">4/14</p>
          <p className="text-gray-400 text-sm">Hit rate ~ 28.5%</p>
        </div>

        {/* MONTH */}
        <div className="rounded-2xl bg-black/40 border border-white/10 p-6">
          <p className="text-gray-300 text-sm mb-1">This Month (Sample)</p>
          <p className="text-3xl font-bold text-emerald-400 mb-1">32/60</p>
          <p className="text-gray-400 text-sm">Hit rate ~ 53.3%</p>
        </div>

        {/* YEAR */}
        <div className="rounded-2xl bg-black/40 border border-white/10 p-6">
          <p className="text-gray-300 text-sm mb-1">Year 2025 (Sample)</p>
          <p className="text-3xl font-bold text-emerald-400 mb-1">265/720</p>
          <p className="text-gray-400 text-sm">Hit rate ~ 36.8%</p>
        </div>
      </div>

      {/* WEEKLY PERFORMANCE TABLE */}
      <h2 className="text-2xl font-bold text-yellow-300 mb-4">
        Weekly Performance (Sample)
      </h2>

      <div className="overflow-hidden rounded-xl border border-white/10 mb-12">
        <table className="w-full text-sm">
          <thead className="bg-[#1c2530] text-yellow-200">
            <tr>
              <th className="px-4 py-3 text-left">Week</th>
              <th className="px-4 py-3 text-center">Hits</th>
              <th className="px-4 py-3 text-center">Total Plays</th>
              <th className="px-4 py-3 text-center">Hit %</th>
            </tr>
          </thead>
          <tbody className="bg-black/40">
            {[
              { label: "This Week", hits: 4, plays: 14 },
              { label: "Last Week", hits: 6, plays: 14 },
              { label: "2 Weeks Ago", hits: 7, plays: 14 },
              { label: "3 Weeks Ago", hits: 5, plays: 14 },
            ].map((row, i) => (
              <tr key={i} className="border-t border-white/10">
                <td className="px-4 py-3">{row.label}</td>
                <td className="px-4 py-3 text-center">{row.hits}</td>
                <td className="px-4 py-3 text-center">{row.plays}</td>
                <td className="px-4 py-3 text-center">
                  {(row.hits / row.plays * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MONTHLY PERFORMANCE TABLE */}
      <h2 className="text-2xl font-bold text-yellow-300 mb-4">
        Monthly Performance (Sample)
      </h2>

      <div className="overflow-hidden rounded-xl border border-white/10 mb-12">
        <table className="w-full text-sm">
          <thead className="bg-[#1c2530] text-yellow-200">
            <tr>
              <th className="px-4 py-3 text-left">Month</th>
              <th className="px-4 py-3 text-center">Hits</th>
              <th className="px-4 py-3 text-center">Total Plays</th>
              <th className="px-4 py-3 text-center">Hit %</th>
            </tr>
          </thead>
          <tbody className="bg-black/40">
            {[
              { month: "November 2025", hits: 32, plays: 60 },
              { month: "October 2025", hits: 28, plays: 60 },
              { month: "September 2025", hits: 35, plays: 60 },
            ].map((row, i) => (
              <tr key={i} className="border-t border-white/10">
                <td className="px-4 py-3">{row.month}</td>
                <td className="px-4 py-3 text-center">{row.hits}</td>
                <td className="px-4 py-3 text-center">{row.plays}</td>
                <td className="px-4 py-3 text-center">
                  {(row.hits / row.plays * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* YEARLY PERFORMANCE TABLE */}
      <h2 className="text-2xl font-bold text-yellow-300 mb-4">
        Yearly Performance (Sample)
      </h2>

      <div className="overflow-hidden rounded-xl border border-white/10 mb-20">
        <table className="w-full text-sm">
          <thead className="bg-[#1c2530] text-yellow-200">
            <tr>
              <th className="px-4 py-3 text-left">Year</th>
              <th className="px-4 py-3 text-center">Hits</th>
              <th className="px-4 py-3 text-center">Total Plays</th>
              <th className="px-4 py-3 text-center">Hit %</th>
            </tr>
          </thead>
          <tbody className="bg-black/40">
            {[
              { year: "2025", hits: 265, plays: 720 },
              { year: "2024", hits: 240, plays: 720 },
              { year: "2023", hits: 255, plays: 720 },
            ].map((row, i) => (
              <tr key={i} className="border-t border-white/10">
                <td className="px-4 py-3">{row.year}</td>
                <td className="px-4 py-3 text-center">{row.hits}</td>
                <td className="px-4 py-3 text-center">{row.plays}</td>
                <td className="px-4 py-3 text-center">
                  {(row.hits / row.plays * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
