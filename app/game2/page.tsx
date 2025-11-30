// app/game2/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PredictionsJSON = {
  ["Game 2"]?: string[][];
  last_updated?: string;
};

type HistoryRow = {
  Date: string;
  P1: string;
  P2: string;
  P3: string;
  Draw: string;
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

export default function Game2Page() {
  const [data, setData] = useState<PredictionsJSON | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [selectedDigit, setSelectedDigit] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Load Game 2 predictions
  useEffect(() => {
    (async () => {
      const res = await fetch("/predictions.json", { cache: "no-store" });
      const j = (await res.json()) as PredictionsJSON;
      setData(j);
    })();
  }, []);

  // Load history.json (first 20 rows)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/history.json", { cache: "no-store" });
        const j = await res.json();
        setHistory(j.rows?.slice(0, 20) ?? []);
      } catch (e) {
        console.error("Error loading history:", e);
      }
    })();
  }, []);

  const allNums = useMemo(() => {
    const raw = data?.["Game 2"]?.flat?.() ?? [];
    return sort3Digits(raw);
  }, [data]);

  const transformed = useMemo(() => {
    if (selectedDigit === null) return allNums;
    return allNums.map((n) => {
      const str = n.toString().trim().padStart(3, "0");
      return `${selectedDigit}${str.slice(1)}`;
    });
  }, [allNums, selectedDigit]);

  const lastUpdated = formatLastUpdated(data?.last_updated);

  return (
    <main className="relative min-h-screen text-black">
      {/* Background */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/Prediction%20Page%20Background%20v2.png")',
          opacity: 1,
        }}
      />

      {/* MAIN LAYOUT ROW — Predictions Left, Mini-History Right */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 py-10 flex flex-col lg:flex-row gap-10">

        {/* LEFT SIDE — the ENTIRE ORIGINAL GAME 2 CONTENT */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <h1 className="text-3xl font-extrabold text-white drop-shadow">
                NC Pick 3 Predictions
              </h1>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                <span className="text-3xl font-extrabold text-white drop-shadow">
                  Game 2
                </span>
                <span
                  className="text-2xl font-bold drop-shadow"
                  style={{ color: "#4B9CD3" }} // Carolina Blue
                >
                  (Target The Front Number)
                </span>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => setShowInstructions(true)}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400 text-black font-bold shadow-md hover:bg-yellow-300 transition"
              >
                ?
              </button>

              <Link
                href="/pick3"
                className="animated-color-pill text-black font-semibold shadow-md"
              >
                Go to Game 1
              </Link>
            </div>
          </div>

          <p className="text-sm text-gray-200 mt-2 mb-6">
            Last updated: {lastUpdated}
          </p>

          {/* Front-digit selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Array.from({ length: 10 }, (_, i) => (
              <button
                key={i}
                onClick={() => setSelectedDigit(i)}
                className={`w-11 h-11 text-[20px] font-extrabold rounded-full transition shadow-md ${
                  selectedDigit === i
                    ? "bg-yellow-400 text-black"
                    : "bg-red-600 text-white hover:bg-red-500"
                }`}
              >
                {i}
              </button>
            ))}
            <button
              onClick={() => setSelectedDigit(null)}
              className="ml-4 px-3 py-1 rounded-full bg-gray-700 text-white text-sm hover:bg-gray-600"
            >
              Reset
            </button>
          </div>

          {/* Predictions Panel */}
          <section className="rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-md p-5 shadow-lg w-[440px] mx-auto relative left-[-20px]">
            <h2 className="mb-3 text-lg font-semibold text-white">
              {transformed.length} Numbers
            </h2>

            <div className="flex flex-wrap gap-1.5">
              {transformed.map((n, i) => (
                <div
                  key={`g2-${i}`}
                  className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-md font-extrabold text-[18px]"
                >
                  {n}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT SIDE — MINI DRAW HISTORY (DESKTOP ONLY) */}
        <aside className="hidden lg:block w-[330px]">
          <div className="rounded-2xl bg-gray-900/80 border border-white/10 backdrop-blur-md p-4 shadow-lg text-white">
            <h2 className="text-xl font-bold mb-3">Recent Draws (20)</h2>

            {/* Pills */}
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-yellow-500 text-black text-sm font-bold">
                All
              </span>
            </div>

            {/* Table */}
            <div className="text-sm space-y-2 max-h-[700px] overflow-y-auto pr-2">

              {history.map((row, idx) => {
                const num = `${row.P1}${row.P2}${row.P3}`;
                return (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-white/10 px-3 py-2 rounded-lg"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-yellow-300">{row.Date}</span>
                      <span className="text-gray-300">{row.Draw}</span>
                    </div>
                    <div className="text-lg font-extrabold text-white">{num}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* ===== Instructions Modal ===== */}
      {showInstructions && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setShowInstructions(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-[90%] rounded-2xl bg-gray-900/90 text-white p-8 shadow-2xl border border-white/10 animate-fadeIn"
          >
            <h2 className="text-xl font-bold text-yellow-400 mb-4 text-center">
              Instructions
            </h2>

            <div className="text-[17px] leading-relaxed space-y-4 text-gray-200">
              {/* === (YOUR MODAL CONTENT LEFT UNTOUCHED) === */}
              <p>
                <strong>How to play Game 2:</strong> This is a fun little game where,
                if you have a personal system you use and are pretty good at getting
                the front number right, this is a perfect game!
              </p>

              <p>
                Keep in mind, even though you are targeting only the front number,
                sometimes the actual number that comes out will have all three numbers
                from within the prediction list…
              </p>

              <p>
                Combo numbers locks in an exact hit but be cautious…
              </p>

              <p>
                Pick 3 and other ball lottery games are unforgiving and brutal…
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowInstructions(false)}
                className="px-4 py-1 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Animations & Styles ===== */}
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
          animation: colorMorph 6s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
