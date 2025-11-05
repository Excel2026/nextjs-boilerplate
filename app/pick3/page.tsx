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
    .map((x) => x.toString().trim().padStart(3, "0"))
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

  // instructions modal
  const [showInstructions, setShowInstructions] = useState(false);

  // filter state
  const [filterValue, setFilterValue] = useState("");
  const [filteredNumbers, setFilteredNumbers] = useState<string[] | null>(null); // null = no filter

  useEffect(() => {
    (async () => {
      const res = await fetch("/predictions.json", { cache: "no-store" });
      const j = (await res.json()) as PredictionsJSON;
      setData(j);
    })();
  }, []);

  // base list (sorted)
  const game1 = useMemo(
    () => sort3Digits(data?.["Game 1"]?.flat?.() ?? []),
    [data]
  );

  // what we actually render (filtered or full)
  const displayList = filteredNumbers ?? game1;

  const tabular: React.CSSProperties = {
    fontVariantNumeric: "tabular-nums",
    fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
    fontSize: "18px",
    fontWeight: 700,
    lineHeight: 1,
  };

  const lastUpdated = formatLastUpdated(data?.last_updated);

  // ---- FILTER LOGIC (1 digit or a 2-digit pair) ----
  const handleFilter = () => {
    const raw = filterValue.trim();
    if (!raw) {
      setFilteredNumbers(null);
      return;
    }

    // accept input like "3", "12", "1 2", "1,2"
    const cleaned = raw.replace(/[^\d]/g, "");
    if (!/^\d{1,2}$/.test(cleaned)) {
      // invalid entry – show nothing but keep panel
      setFilteredNumbers([]);
      return;
    }

    if (cleaned.length === 1) {
      const d = cleaned;
      setFilteredNumbers(game1.filter((n) => n.includes(d)));
      return;
    }

    // pair, order-agnostic
    const a = cleaned[0];
    const b = cleaned[1];
    setFilteredNumbers(game1.filter((n) => n.includes(a) && n.includes(b)));
  };

  const clearFilter = () => {
    setFilterValue("");
    setFilteredNumbers(null);
  };

  return (
    <main className="relative min-h-screen text-black">
      {/* Base layer */}
      <div className="absolute inset-0 z-0 bg-[#F7F4EE]" />

      {/* Background image */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/Prediction%20Page%20Background%20v2.png")',
          opacity: 1,
          filter: "none",
        }}
      />

      {/* Content */}
      <div className="relative z-20">
        <div className="mx-auto max-w-7xl px-4 py-10">
          {/* Title + Buttons */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <h1 className="text-3xl font-extrabold text-white drop-shadow">
                NC Pick 3 Predictions
              </h1>
              <div className="mt-1">
                <span className="text-3xl font-extrabold text-white drop-shadow">
                  Game 1
                </span>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              {/* Yellow ? icon */}
              <button
                onClick={() => setShowInstructions(true)}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400 text-black font-bold shadow-md hover:bg-yellow-300 transition"
                aria-label="Instructions"
                title="Instructions"
              >
                ?
              </button>

              {/* Animated gradient pill */}
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

          {/* Main grid */}
          <div className="flex items-start gap-6">
            {/* Predictions list */}
            <section className="w-1/2 max-w-[560px] rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-md p-5 shadow-lg">
              <h2 className="mb-3">
                <span className="text-lg font-semibold text-white">
                  {displayList.length} Numbers
                </span>
                {filteredNumbers && (
                  <span className="ml-2 text-xs text-yellow-300">
                    (filtered)
                  </span>
                )}
              </h2>

              <div className="grid grid-cols-6 gap-4 justify-items-center">
                {displayList.map((n, i) => (
                  <div
                    key={`g1-${i}`}
                    className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center shadow-md"
                    style={tabular}
                  >
                    {n}
                  </div>
                ))}
              </div>
            </section>

            {/* Custom Pick panel */}
            <section className="w-[300px] rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-md p-5 shadow-lg text-white">
              <h2 className="text-lg font-semibold text-yellow-400 mb-3">
                Custom Pick
              </h2>
              <p className="text-sm mb-2">
                Filter Main List for specific digits or pairs
              </p>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g., 3 or 23"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleFilter();
                  }}
                  className="flex-1 rounded px-2 py-1 text-black text-sm focus:outline-none"
                />
                <button
                  onClick={handleFilter}
                  className="bg-yellow-400 text-black text-sm font-semibold px-3 py-1 rounded hover:bg-yellow-300"
                >
                  Filter
                </button>
                <button
                  onClick={clearFilter}
                  className="bg-gray-700 text-white text-sm font-semibold px-3 py-1 rounded hover:bg-gray-600"
                  title="Clear"
                >
                  Reset
                </button>
              </div>

              <div className="min-h-[120px] bg-black/40 rounded p-3 text-gray-300 text-sm">
                {!filteredNumbers && (
                  <p className="italic">
                    Type a digit (0–9) or pair (e.g., 23), then click{" "}
                    <b>Filter</b>.
                  </p>
                )}
                {filteredNumbers && filteredNumbers.length === 0 && (
                  <p className="text-red-200">
                    No matches. Try a single digit (e.g., 7) or a pair (e.g.,
                    17). Input can be “1 7” or “1,7” too.
                  </p>
                )}
                {filteredNumbers && filteredNumbers.length > 0 && (
                  <div className="text-gray-100">
                    <div className="mb-2 text-xs opacity-80">
                      Showing {filteredNumbers.length} result
                      {filteredNumbers.length === 1 ? "" : "s"}:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filteredNumbers.map((n, i) => (
                        <span
                          key={`f-${i}`}
                          className="bg-white text-black rounded-full px-2 py-[2px] text-xs font-bold"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ====== Fade-in INSTRUCTIONS modal ====== */}
      {showInstructions && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="g1-instructions-title"
        >
          <div className="relative w-[90%] max-w-[640px] rounded-2xl bg-gray-900/90 text-gray-100 p-8 shadow-2xl animate-fadeIn">
            <h2
              id="g1-instructions-title"
              className="text-2xl font-bold text-yellow-400 mb-4 text-center"
            >
              How to play Game 1
            </h2>
            <p className="text-base leading-relaxed text-gray-200 whitespace-pre-line">
              Review the 3-digit predictions shown on the main panel (left).
              You can either simply play all the numbers in the list or custom
              pick from the list by using the "Custom Filter" tool.
              {"\n\n"}Type one digit to show every prediction that contains it
              (in any position). Or type a 2-digit pair to show only the
              predictions that contain both digits (any order).
            </p>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowInstructions(false)}
                className="px-5 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CSS animations ===== */}
      <style jsx global>{`
        @keyframes colorMorph {
          0% {
            background-color: #ffffff;
          }
          25% {
            background-color: #38bdf8;
          }
          50% {
            background-color: #9333ea;
          }
          75% {
            background-color: #10b981;
          }
          100% {
            background-color: #ffffff;
          }
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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
