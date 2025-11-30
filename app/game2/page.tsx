// app/game2/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PredictionsJSON = {
  ["Game 2"]?: string[][];
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

export default function Game2Page() {
  const [data, setData] = useState<PredictionsJSON | null>(null);
  const [selectedDigit, setSelectedDigit] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/predictions.json", { cache: "no-store" });
      const j = (await res.json()) as PredictionsJSON;
      setData(j);
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

      <div className="relative z-20 mx-auto max-w-7xl px-4 py-10">

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
                style={{ color: "#4B9CD3" }}
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

        {/* SHIFTED LEFT BY 120px */}
        <div className="relative left-[-120px]">

          {/* Number Selector */}
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
          <section className="rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-md p-5 shadow-lg w-[440px] mx-auto">
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
      </div>

      {/* Mini Draw History (unchanged except width from earlier) */}
      <aside className="hidden md:block absolute right-8 top-[260px] w-[500px] rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-md p-5 shadow-lg text-white h-[600px] overflow-y-auto">
        <h2 className="text-lg font-semibold text-white mb-4">
          Recent Draws (Top 20)
        </h2>

        <ul className="space-y-3">
          {Array.from({ length: 20 }).map((_, index) => {
            const row = (data as any)?.history?.[index];
            if (!row) return null;

            return (
              <li
                key={index}
                className="rounded-lg bg-gray-800/60 p-3 flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{row.Date}</span>
                  <span
                    className={`mt-1 px-2 py-0.5 text-xs font-bold rounded-full w-fit ${
                      row.Draw === "Mid"
                        ? "bg-blue-500 text-white"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {row.Draw}
                  </span>
                </div>

                <span className="text-lg font-bold">
                  {row.P1}
                  {row.P2}
                  {row.P3}
                </span>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Modal and animations unchanged */}
      {showInstructions && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowInstructions(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-[90%] rounded-2xl bg-gray-900/90 text-white p-8 shadow-2xl border border-white/10 animate-fadeIn"
          >
            <h2 className="text-xl font-bold text-yellow-400 mb-4 text-center">
              Instructions
            </h2>

            <p className="text-[17px] leading-relaxed text-gray-200 mb-4">
              Click a red number to set your target front digit. We adjust the
              entire prediction list automatically.
            </p>

            <div className="flex justify-center">
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

      <style jsx global>{`
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
