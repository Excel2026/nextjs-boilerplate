"use client";

import { useEffect, useState } from "react";

type GameRow = string[];
type Game2Row = [string | "", string | ""];
type HistoryRow = (string | number)[];
type PredictionsJSON = {
  ["Game 1"]?: GameRow[];
  ["Game 2"]?: Game2Row[];
  ["History"]?: HistoryRow[];
};

function formatMDY(value: string) {
  const d = new Date(value);
  if (!isNaN(d.getTime())) {
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (m) return `${Number(m[2])}/${Number(m[3])}/${m[1]}`;
  return value;
}

function sort3Digits(list: string[]): string[] {
  return [...list]
    .filter(Boolean)
    .map((x) => x.padStart(3, "0"))
    .sort((a, b) => Number(a) - Number(b));
}

export default function Page() {
  const [data, setData] = useState<PredictionsJSON | null>(null);
  const [selectedDigit, setSelectedDigit] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  async function loadPredictions() {
    try {
      const res = await fetch("/predictions.json", { cache: "no-store" });
      const j = await res.json();
      setData(j);
    } catch (e) {
      console.error("Error loading predictions:", e);
    }
  }

  useEffect(() => {
    loadPredictions();
  }, []);

  async function handleDigitChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newDigit = Number(e.target.value);
    setSelectedDigit(newDigit);
    setLoading(true);

    try {
      await fetch(`/api/update-selection?digit=${newDigit}`);
      await new Promise((r) => setTimeout(r, 2000));
      await loadPredictions();
    } catch (err) {
      console.error("Failed to update Excel:", err);
    } finally {
      setLoading(false);
    }
  }

  const game1Sorted = sort3Digits(data?.["Game 1"]?.flat() ?? []);
  const game2Sorted = sort3Digits(data?.["Game 2"]?.flat() ?? []);
  const history = data?.["History"] ?? [];

  // force equal-width digits
  const tabular: React.CSSProperties = { fontVariantNumeric: "tabular-nums" };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="px-6 py-5">
        <h1 className="text-3xl font-extrabold mb-5">
          Pick 3 Predictions – North Carolina
        </h1>

        <div className="flex gap-5 items-start">
          {/* History */}
          <section className="bg-white border border-gray-200 rounded-md shadow-sm px-3 py-2 w-[400px]">
            <h2 className="text-lg font-semibold mb-2 text-center">History</h2>
            <div className="max-h-[550px] overflow-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-1 py-1 w-[90px]">Date</th>
                    <th className="text-center px-1 py-1 w-[30px]">P1</th>
                    <th className="text-center px-1 py-1 w-[30px]">P2</th>
                    <th className="text-center px-1 py-1 w-[30px]">P3</th>
                    <th className="text-center px-1 py-1 w-[40px]">Draw</th>
                    <th className="text-center px-1 py-1 w-[50px]">Pick3</th>
                    <th className="text-center px-1 py-1 w-[30px]">#</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((r, i) => (
                    <tr key={i} className={i % 2 ? "bg-gray-50" : ""}>
                      <td className="px-1 py-1 text-left">
                        {formatMDY(String(r[0] ?? ""))}
                      </td>
                      <td className="text-center">{r[1]}</td>
                      <td className="text-center">{r[2]}</td>
                      <td className="text-center">{r[3]}</td>
                      <td className="text-center">{r[4]}</td>
                      <td className="text-center">{r[5]}</td>
                      <td className="text-center">{r[6]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Game 1 */}
          <section className="bg-white border border-gray-200 rounded-md shadow-sm px-3 py-2 flex-1 max-w-[420px]">
            <h2 className="text-lg font-semibold mb-2 text-center">Game 1</h2>
            <div className="flex flex-wrap gap-2">
              {game1Sorted.map((num, i) => (
                <div
                  key={i}
                  className="bg-gray-50 text-gray-800 border border-gray-100 rounded w-14 h-9 flex items-center justify-center text-sm font-semibold shadow-sm font-mono"
                  style={tabular}
                >
                  {num}
                </div>
              ))}
            </div>
          </section>

          {/* Game 2 */}
          <section className="bg-white border border-gray-200 rounded-md shadow-sm px-3 py-2 flex-1 max-w-[520px]">
            <div className="flex items-center gap-4 flex-wrap mb-2">
              <h2 className="text-lg font-semibold whitespace-nowrap">
                Game 2 <span className="font-bold text-base">(Target P1)</span>
              </h2>

              <label className="text-sm font-medium whitespace-nowrap">
                Pick Your Target Front Number:
              </label>

              {/* RED + BOLD select */}
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm text-red-600 font-bold"
                value={selectedDigit}
                onChange={handleDigitChange}
                disabled={loading}
              >
                {[...Array(10).keys()].map((n) => (
                  <option
                    key={n}
                    value={n}
                    className="text-red-600 font-bold"
                    style={{ color: "#dc2626", fontWeight: 700 }}
                  >
                    {n}
                  </option>
                ))}
              </select>

              {loading && (
                <span className="text-sm text-gray-500">Updating…</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {game2Sorted.map((num, i) => (
                <div
                  key={i}
                  className="bg-gray-50 text-gray-800 border border-gray-100 rounded w-14 h-9 flex items-center justify-center text-sm font-semibold shadow-sm font-mono"
                  style={tabular}
                >
                  {num}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
