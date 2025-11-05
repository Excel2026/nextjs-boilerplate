// app/pick3/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PredictionsJSON = {
  ["Game 1"]?: string[][];
  last_updated?: string;
};

function sort3Digits(list: string[]): string[] {
  return [...list]
    .filter(Boolean)
    .map((x) => x.padStart(3, "0"))
    .sort((a, b) => Number(a) - Number(b));
}

function formatLastUpdated(input?: string): string {
  const d = input ? new Date(input.replace(" ", "T")) : new Date();
  const datePart = d.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const hrs = d.getHours();
  const mins = d.getMinutes().toString().padStart(2, "0");
  const h12 = hrs % 12 || 12;
  const ampm = hrs < 12 ? "a.m" : "p.m";
  return `${datePart} ${h12}:${mins} ${ampm} (EST)`;
}

export default function Pick3Page() {
  const [data, setData] = useState<PredictionsJSON | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [filteredNumbers, setFilteredNumbers] = useState<string[] | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/predictions.json", { cache: "no-store" });
      const j = (await res.json()) as PredictionsJSON;
      setData(j);
    })();
  }, []);

  const game1 = useMemo(() => sort3Digits(data?.["Game 1"]?.flat?.() ?? []), [data]);
  const lastUpdated = formatLastUpdated(data?.last_updated);

  const handleFilter = () => {
    const val = filterValue.trim();
    if (!val) {
      setFilteredNumbers(null);
      return;
    }

    const digits = val.split("").filter((d) => /\d/.test(d));
    const result = game1.filter((num) =>
      digits.every((d) => num.includes(d))
    );

    setFilteredNumbers(result);
  };

  const shownList = filteredNumbers ?? game1;

  return (
    <main className="relative min-h-screen text-black">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[#F7F4EE]" />
      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/Prediction%20Page%20Background%20v2.png")',
          opacity: 1,
        }}
      />

      <div className="relative z-20">
        <div className="mx-auto max-w-7xl px-4 py-10">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white drop-shadow">
                NC Pick 3 Predictions
              </h1>
              <span className="text-3xl font-extrabold text-white drop-shadow">
                Game 1
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => setShowInstructions(true)}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400 text-black font-bold shadow-md hover:bg-yellow-300 transition"
              >
                ?
              </button>

              <Link
                href="/game2"
                className="animated-color-pill text-black font-semibold shadow-md"
              >
                Go to Game 2
              </Link>
            </div>
          </div>

          <p className="text-sm text-gray-200 mt-2 mb-6">
            Last updated: {lastUpdated}
          </p>

          {/* Layout */}
          <div className="flex items-start gap-6">
            {/* Predictions */}
            <section className="w-1/2 max-w-[560px] rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-md p-5 shadow-lg">
              <h2 className="mb-3 text-lg font-semibold text-white">
                {shownList.length} Numbers
              </h2>
              <div className="grid grid-cols-6 gap-4 justify-items-center">
                {shownList.map((n, i) => (
                  <div
                    key={`g1-${i}`}
                    className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center shadow-md font-bold text-[18px]"
                  >
                    {n}
                  </div>
                ))}
              </div>
            </section>

            {/* Filter Panel */}
            <section className="w-[300px] rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-md p-5 shadow-lg text-white">
              <h2 className="text-lg font-semibold text-yellow-400 mb-3">
                Custom Pick
              </h2>
              <p className="text-sm mb-2">Filter Main List for specific digits or pairs</p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="e.g. 3 or 14"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="flex-1 rounded px-2 py-1 text-black text-sm focus:outline-none"
                />
                <button
                  onClick={handleFilter}
                  className="bg-yellow-400 text-black text-sm font-semibold px-3 py-1 rounded hover:bg-yellow-300"
                >
                  Filter
                </button>
              </div>

              {filteredNumbers ? (
                <div className="min-h-[120px] bg-black/40 rounded p-3 text-gray-200 text-sm">
                  {filteredNumbers.length === 0
                    ? "No numbers found."
                    : filteredNumbers.join(", ")}
                </div>
              ) : (
                <div className="min-h-[120px] bg-black/40 rounded p-3 text-gray-300 text-sm italic">
                  Type a digit or pair above, then click Filter.
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* CSS animation for the “Go to Game 2” button */}
      <style jsx global>{`
        @keyframes colorMorph {
          0% { background-color: #ffffff; }
          25% { background-color: #38bdf8; }
          50% { background-color: #9333ea; }
          75% { background-color: #10b981; }
          100% { background-color: #ffffff; }
        }
        .animated-color-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          color: #000;
          animation: colorMorph 6s ease-in-out infinite;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .animated-color-pill:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </main>
  );
}
