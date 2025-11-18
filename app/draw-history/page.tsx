"use client";

import { useEffect, useMemo, useState } from "react";

type Row = {
  Date: string;
  P1: string;
  P2: string;
  P3: string;
  Draw: "Mid" | "Eve" | string;
};

export default function DrawHistoryPage() {
  const [mounted, setMounted] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"All" | "Mid" | "Eve">("All");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    (async () => {
      const res = await fetch("/history.json", { cache: "no-store" });
      const j = await res.json();
      setRows(j?.rows ?? []);
    })();
  }, [mounted]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return rows
      .filter((r) =>
        scope === "All" ? true : r.Draw.toLowerCase() === scope.toLowerCase()
      )
      .filter((r) => {
        if (!q) return true;
        const three = `${r.P1}${r.P2}${r.P3}`;
        return (
          r.Date.includes(q) ||
          r.P1.includes(q) ||
          r.P2.includes(q) ||
          r.P3.includes(q) ||
          three.includes(q)
        );
      });
  }, [rows, query, scope]);

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Title – bumped up ~2 sizes */}
        <h1 className="page-title mb-4 text-4xl sm:text-5xl">Draw History</h1>

        {/* Filters */}
        <div className="mb-4 flex items-center gap-3">
          <button
            className={`pill ${scope === "All" ? "active" : ""} rounded-full text-base px-4`}
            onClick={() => setScope("All")}
          >
            All
          </button>
          <button
            className={`pill ${scope === "Mid" ? "active" : ""} rounded-full text-base px-4`}
            onClick={() => setScope("Mid")}
          >
            Mid
          </button>
          <button
            className={`pill ${scope === "Eve" ? "active" : ""} rounded-full text-base px-4`}
            onClick={() => setScope("Eve")}
          >
            Eve
          </button>

          <div className="relative ml-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find 3-digit (e.g. 432)"
              className="input pl-3 pr-10 h-9"
            />
            {query && (
              <button
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="group absolute right-1 top-1 flex h-7 w-7 items-center justify-center"
                title="Clear"
              >
                <span className="ball sm bg-white text-black group-hover:brightness-95">
                  ×
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Table – black frosted pane backer */}
        <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/60 backdrop-blur-md shadow-2xl">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-gray-200">
              <tr>
                <th className="px-3 py-3 text-center text-base">#</th>
                <th className="px-3 py-3 text-center text-base">Date</th>
                <th className="px-3 py-3 text-center text-base">Draw</th>
                <th className="px-3 py-3 text-center text-base">P1</th>
                <th className="px-3 py-3 text-center text-base">P2</th>
                <th className="px-3 py-3 text-center text-base">P3</th>
                <th className="px-3 py-3 text-center text-base">3-Digit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-8 text-center text-gray-400"
                  >
                    No data available.
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => {
                  const three = `${r.P1}${r.P2}${r.P3}`;
                  const isMid = r.Draw.toLowerCase() === "mid";
                  const badge = isMid ? (
                    <span className="badge bg-blue-600/80">MID</span>
                  ) : (
                    <span className="badge bg-orange-500/80">EVE</span>
                  );

                  return (
                    <tr
                      key={`${r.Date}-${r.Draw}-${i}`}
                      className={i % 2 ? "bg-white/5" : "bg-transparent"}
                    >
                      <td className="px-3 py-3 text-gray-300">{i + 1}</td>
                      <td className="px-3 py-3 text-gray-200">{r.Date}</td>
                      <td className="px-3 py-3">{badge}</td>

                      <td className="px-3 py-3">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-black text-lg font-semibold">
                          {r.P1}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-black text-lg font-semibold">
                          {r.P2}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-black text-lg font-semibold">
                          {r.P3}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-semibold text-lg">
                        {three}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
