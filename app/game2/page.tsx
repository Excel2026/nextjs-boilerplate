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
  Draw: string;
  P1: string | number;
  P2: string | number;
  P3: string | number;
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

  /** LOAD PREDICTIONS */
  useEffect(() => {
    (async () => {
      const res = await fetch("/predictions.json", { cache: "no-store" });
      setData((await res.json()) as PredictionsJSON);
    })();
  }, []);

  /** LOAD DRAW HISTORY (MATCHING GAME 1 FORMAT) */
  useEffect(() => {
    (async () => {
      const res = await fetch("/history.json", { cache: "no-store" });
      const j = await res.json();
      setHistory(j.rows || []);
    })();
  }, []);

  const allNums = useMemo(() => {
    const raw = data?.["Game 2"]?.flat?.() ?? [];
    return sort3Digits(raw);
  }, [data]);

  const transformed = useMemo(() => {
    if (selectedDigit === null) return allNums;
    return allNums.map((n) => {
      const str = n.toString().padStart(3, "0");
      return `${selectedDigit}${str.slice(1)}`;
    });
  }, [allNums, selectedDigit]);

  const lastUpdated = formatLastUpdated(data?.last_updated);

  return (
    <main className="relative min-h-screen text-black overflow-x-hidden">
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
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow">
              NC Pick 3 Predictions
            </h1>
            <span className="text-3xl font-extrabold text-white drop-shadow">
              Game 2
            </span>
            <span
              className="text-2xl font-bold drop-shadow ml-2"
              style={{ color: "#4B9CD3" }}
            >
              (Target The Front Number)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInstructions(true)}
              className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400 text-black font-bold shadow-md"
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

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* LEFT SIDE (red pills + predictions panel) */}
          <div className="flex flex-col items-center">
            {/* RED PILLS */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {Array.from({ length: 10 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDigit(i)}
                  className={`w-11 h-11 text-[20px] font-extrabold rounded-full shadow-md ${
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
                className="ml-4 px-3 py-1 rounded-full bg-gray-700 text-white text-sm"
              >
                Reset
              </button>
            </div>

            {/* PREDICTION PANE */}
            <div className="w-[440px] max-w-full rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-md p-5 shadow-lg">
              <h2 className="mb-3 text-lg font-semibold text-white">
                {transformed.length} Numbers
              </h2>

              <div className="flex flex-wrap gap-1.5">
                {transformed.map((n, i) => (
                  <div
                    key={i}
                    className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-md font-extrabold text-[18px]"
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — Mini Draw History */}
          <div className="hidden md:block w-[360px] rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-md p-5 shadow-lg max-h-[600px] overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-4">
              Recent Draws (Top 20)
            </h2>

            <div className="space-y-2">
              {history.slice(0, 20).map((row, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-800/60 rounded-lg px-3 py-2"
                >
                  <span className="w-6 text-sm text-gray-300">
                    {index + 1}
                  </span>

                  <span className="w-[90px] text-sm text-white">
                    {row.Date}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      row.Draw.toUpperCase() === "MID"
                        ? "bg-blue-500 text-white"
                        : "bg-orange-400 text-black"
                    }`}
                  >
                    {row.Draw}
                  </span>

                  <span className="font-bold text-white w-10 text-right">
                    {row.P1}
                    {row.P2}
                    {row.P3}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showInstructions && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowInstructions(false)}
        >
          <div
            className="max-w-3xl w-[90%] rounded-2xl bg-gray-900/90 text-white p-8 shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-yellow-400 mb-4 text-center">
              Instructions
            </h2>

            {/* REPLACED FULL HELP TEXT */}
            <p className="text-[17px] leading-relaxed text-gray-200 mb-4">
              <b>How to play Game 2:</b> This is a fun little game where, if you
              have a personal system you use and are pretty good at getting the
              front number right, this is a perfect game! Simply click one of the
              red (0 thru 9) numbers and the entire prediction list will adjust
              to your targeted front number — we’ll handle the other 2 numbers for
              you.
            </p>

            <p className="text-[17px] leading-relaxed text-gray-200 mb-4">
              Keep in mind, even though you are targeting only the front number,
              sometimes the actual number that comes out will have all three
              numbers from within the prediction list but your target front number
              might actually come out in the middle or end position (P2 or P3) but
              “a win is a win”, it will be a “box” / “any” type hit unless you
              combo all of the prediction numbers to get an exact hit.
            </p>

            <p className="text-[17px] leading-relaxed text-gray-200 mb-4">
              Combo numbers locks in an exact hit but be cautious, some of the
              prediction number lists are quite a bit bigger than others and combo
              all six ways is more expensive. As we always say, “the math has to
              work” (financially speaking). That being said, a better bet might be
              to play as “box” / “any” instead of exact order on your play slips
              if the investment cost doesn't make sense.
            </p>

            <p className="text-[17px] leading-relaxed text-gray-200 mb-4">
              Pick 3 and other ball lottery games are unforgiving and brutal so
              play with no emotion, play consistently, with patience and
              discipline and realistic budget because in reality, we lose more
              times than we win, the real talent is not how many wins but the
              quality of the win (investment against profit). If you feel unsure /
              not confident, just don’t play but observe until you feel confident
              about which numbers you are going to play from the list.
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => setShowInstructions(false)}
                className="px-4 py-1 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
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
