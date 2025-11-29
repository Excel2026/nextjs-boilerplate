// app/pick3/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/** ▸▸ Game 1 Help Text (updated: removed "(left)") ◂◂ */
const HELP_HTML = `
<h2 class="text-xl font-semibold text-yellow-400 text-center mb-4">How to play Game 1</h2>
<p class="text-sm text-gray-200 leading-relaxed text-center">
Review the 3-digit predictions shown on the main panel. You can either simply play all the numbers in the list or custom pick from the list by using the “Custom Filter” tool.
</p>
<p class="text-sm text-gray-200 leading-relaxed text-center mt-4">
In the Custom Filter tool, type in just (1) number you want to target and it will pull up every 3-digit number that has your selected number in it (in any position).<br/>
Or type in pairs and it will pull up only the 3-digit numbers that contain your 2-digit pairs (in any order).
</p>
<p class="text-sm text-gray-200 leading-relaxed text-center mt-4">
Simply take a screenshot or photo with your phone and take it to your local store to fill out your play slips.
</p>
<p class="text-sm text-gray-200 leading-relaxed text-center mt-4">
<b>*Note:</b> As with all predictions, (these included), we are obviously targeting exact hits and you will get exact hits just by playing the prediction numbers as they are displayed but there absolutely will also be hits that are in “any” / “box” order from the prediction list so you have to decide on your own how you are going to play these numbers.
</p>
<p class="text-sm text-gray-200 leading-relaxed text-center mt-4">
As you know, Pick 3 and all lottery ball games are punishing, brutal and require a lot of patience and discipline. Play consistently yet responsibly. If you don’t see it jumping out in your face, might be better to not play some draws if the numbers just don’t feel right.
</p>
<div class="flex justify-center mt-6">
  <button
    id="closeHelp"
    class="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-yellow-300 transition"
  >
    Close
  </button>
</div>
`;

type PredictionsJSON = {
  ["Game 1"]?: string[][];
  last_updated?: string;
};

function sort3Digits(list: string[]): string[] {
  return [...list].filter(Boolean).map((x) => x.padStart(3, "0")).sort((a, b) => Number(a) - Number(b));
}

function formatLastUpdated(input?: string): string {
  const d = input ? new Date(input.replace(" ", "T")) : new Date();
  const datePart = d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
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
  const [hydrated, setHydrated] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/predictions.json", { cache: "no-store" });
      const j = (await res.json()) as PredictionsJSON;
      setData(j);
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!showHelp) return;
    const btn = document.getElementById("closeHelp");
    const handler = () => setShowHelp(false);
    btn?.addEventListener("click", handler);
    return () => btn?.removeEventListener("click", handler);
  }, [showHelp]);

  const game1 = useMemo(() => sort3Digits(data?.["Game 1"]?.flat?.() ?? []), [data]);
  const shownList = filteredNumbers ?? game1;

  const handleFilter = () => {
    const val = filterValue.trim();
    if (!val) {
      setFilteredNumbers(null);
      return;
    }
    const digits = val.split("").filter((d) => /\d/.test(d));
    const result = game1.filter((num) => digits.every((d) => num.includes(d)));
    setFilteredNumbers(result);
  };

  const handleReset = () => {
    setFilterValue("");
    setFilteredNumbers(null);
  };

  const lastUpdated = hydrated && data?.last_updated ? formatLastUpdated(data.last_updated) : "";

  return (
    <main className="relative min-h-screen text-black overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[#0b0b0b]" />
      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/Prediction%20Page%20Background%20v2.png")', opacity: 1 }}
      />

      <div className="relative z-20">
        <div className="mx-auto max-w-7xl px-4 py-10">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white drop-shadow">NC Pick 3 Predictions</h1>
              <span className="text-3xl font-extrabold text-white drop-shadow">Game 1</span>
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => setShowHelp(true)}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400 text-black font-bold shadow-md hover:bg-yellow-300 transition"
                aria-label="How to play Game 1"
              >
                ?
              </button>

              <Link href="/game2" className="animated-color-pill text-black font-semibold shadow-md">
                Go to Game 2
              </Link>
            </div>
          </div>

          {hydrated && <p className="text-sm text-gray-200 mt-2 mb-6">Last updated: {lastUpdated}</p>}

          {/* DESKTOP VIEW */}
          <div className="hidden md:flex items-start gap-6">
            <section className="w-1/2 max-w-[560px] rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-md p-5 shadow-lg">
              <h2 className="mb-3 text-lg font-semibold text-white">{shownList.length} Numbers</h2>
              <div className="grid grid-cols-6 gap-4 justify-items-center">
                {shownList.map((n, i) => (
                  <div
                    key={`g1-desktop-${i}`}
                    className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center shadow-md font-bold text-[18px]"
                  >
                    {n}
                  </div>
                ))}
              </div>
            </section>

            <section className="W-[300px] w-[300px] rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-md p-5 shadow-lg text-white">
              <h2 className="text-lg font-semibold text-yellow-400 mb-3">Custom Pick</h2>
              <p className="text-sm mb-2">Filter Main List for specific digits or pairs</p>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. 3 or 14"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="flex-1 rounded px-2 py-1 text-black text-sm focus:outline-none"
                />
                <button onClick={handleFilter} className="bg-yellow-400 text-black text-sm font-semibold px-3 py-1 rounded hover:bg-yellow-300">
                  Filter
                </button>
              </div>
              <button onClick={handleReset} className="w-full bg-gray-600 text-white text-sm font-semibold px-3 py-1 rounded hover:bg-gray-500 transition">
                Reset
              </button>
              <p className="text-xs text-gray-300 mt-3">Type a digit or pair above, then click Filter. Click Reset to show all again.</p>
            </section>
          </div>

          {/* MOBILE VIEW */}
          <div className="block md:hidden mt-8 pb-16 overflow-y-auto max-h-[95vh]">
            <h2 className="mb-4 text-lg font-semibold text-white text-center">{shownList.length} Numbers</h2>
            <div className="numbers-grid">
              {shownList.map((n, i) => (
                <div key={`g1-mobile-${i}`} className="pill">
                  {n}
                </div>
              ))}
            </div>

            <section className="mt-10 mb-8 w-full rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-md p-6 shadow-lg text-white min-h-[320px]">
              <h2 className="text-lg font-semibold text-yellow-400 mb-3 text-center">Custom Pick</h2>
              <p className="text-sm mb-3 text-center">Filter Main List for specific digits or pairs</p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="e.g. 3 or 14"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="flex-1 rounded px-3 py-2 text-black text-sm focus:outline-none"
                />
                <button onClick={handleFilter} className="bg-yellow-400 text-black text-sm font-semibold px-4 py-2 rounded hover:bg-yellow-300">
                  Filter
                </button>
              </div>
              <button onClick={handleReset} className="w-full bg-gray-600 text-white text-sm font-semibold px-4 py-3 rounded hover:bg-gray-500 transition">
                Reset
              </button>
              <p className="text-xs text-gray-300 mt-4 text-center leading-snug">
                Type a digit or pair above, then click Filter.<br />Click Reset to show all again.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Help Modal (centered) */}
      {showHelp && (
        <div
          onClick={() => setShowHelp(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative mx-auto bg-gray-900/90 text-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-yellow-400/40"
          >
            <div className="[&_h1]:text-yellow-400 [&_*]:select-text" dangerouslySetInnerHTML={{ __html: HELP_HTML }} />
          </div>
        </div>
      )}

      {/* Styles */}
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
          color: #000;
          animation: colorMorph 6s ease-in-out infinite;
          box-shadow: 0 2px 5px rgba(0,0,0,0.25);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .animated-color-pill:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 12px rgba(255,255,255,0.3);
        }

        @media (max-width: 640px) {
          .numbers-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            width: 100vw;
            margin: 0;
            padding: 0 8px;
            gap: 10px;
            justify-items: center;
          }
          .pill {
            width: 58px;
            height: 58px;
            background: white;
            color: black;
            border-radius: 50%;
            font-weight: 700;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          }
        }
      `}</style>
    </main>
  );
}
