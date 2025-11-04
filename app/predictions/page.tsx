"use client";
import { useEffect, useMemo, useState } from "react";

type Row = string[]; // [Date,P1,P2,P3,Draw,3-Digit,#]

export default function Page() {
  const [history, setHistory] = useState<Row[] | null>(null);
  const [results, setResults] = useState<string[][] | null>(null);
  const [pairs, setPairs] = useState<string[][] | null>(null);
  const [updated, setUpdated] = useState("");
  const [nowNy, setNowNy] = useState("");

  // ---------- robust date helpers ----------
  const parseDateMs = (v: unknown): number => {
    if (v == null) return 0;
    if (typeof v === "string") {
      const s = v.trim();
      let m =
        s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/) ||
        s.match(/^(\d{1,2})\/(\d{1,2})\s+(\d{2,4})$/) ||
        s.match(/^(\d{1,2})\/(\d{1,2})(\d{2,4})$/);
      if (m) {
        const mm = +m[1], dd = +m[2]; let yy = +m[3];
        if (yy < 100) yy += 2000;
        const t = new Date(yy, mm - 1, dd).getTime();
        return Number.isNaN(t) ? 0 : t;
      }
      m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (m) {
        const t = new Date(+m[1], +m[2] - 1, +m[3]).getTime();
        return Number.isNaN(t) ? 0 : t;
      }
      const t = new Date(s).getTime();
      return Number.isNaN(t) ? 0 : t;
    }
    if (v instanceof Date) return v.getTime();
    const t = new Date(String(v)).getTime();
    return Number.isNaN(t) ? 0 : t;
  };

  const niceDate = (v: unknown) => {
    const ms = parseDateMs(v);
    if (!ms) return String(v ?? "");
    const d = new Date(ms);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  const fmtNy = (d: Date | string) => {
    const dt = d instanceof Date ? d : new Date(d);
    try {
      return dt.toLocaleString("en-US", { timeZone: "America/New_York" });
    } catch {
      return String(d);
    }
  };

  const badge = (draw: string) => {
    const isMid = String(draw).toLowerCase().startsWith("mid");
    const bg = isMid ? "#F6EFD0" : "#DDEBFF";
    const bd = isMid ? "#E3D3A3" : "#BBD5FF";
    const fg = isMid ? "#6B4E00" : "#0B3A7A";
    return (
      <span
        style={{
          fontSize: 11,
          padding: "2px 6px",
          borderRadius: 999,
          background: bg,
          color: fg,
          border: `1px solid ${bd}`,
          fontWeight: 600,
          display: "inline-block",
          minWidth: 30,
          textAlign: "center",
          lineHeight: 1.35,
        }}
      >
        {draw || ""}
      </span>
    );
  };

  // ---------- data load ----------
  const load = () =>
    fetch("/predictions.json?t=" + Date.now(), { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        const hist = (j?.History ?? []) as Row[];
        const withTs = hist.map((row) => ({ row, ts: parseDateMs(row?.[0]) }));
        const parsed = withTs
          .filter((x) => x.ts > 0)
          .sort((a, b) => b.ts - a.ts)
          .map((x) => x.row);
        const unparsed = withTs.filter((x) => x.ts === 0).map((x) => x.row);
        setHistory([...parsed, ...unparsed]);
        setResults((j?.Results ?? []) as string[][]);
        setPairs((j?.Pairs ?? []) as string[][]);
        setUpdated(j?.updated ?? "");
      })
      .catch(console.error);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const tick = () => setNowNy(fmtNy(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const latestDraw = history?.[0]?.[4] || "";
  const predictionsTitle = useMemo(() => {
    const v = String(latestDraw).toLowerCase();
    if (v.startsWith("mid")) return "Midday Predictions";
    if (v.startsWith("eve")) return "Evening Predictions";
    return "Today’s Predictions";
  }, [latestDraw]);

  const num = (s: string) => {
    const n = parseInt(String(s).replace(/[^\d]/g, ""), 10);
    return Number.isNaN(n) ? Number.POSITIVE_INFINITY : n;
  };
  const asc = (a: string, b: string) => num(a) - num(b);

  const game1FlatSorted = useMemo(
    () => (results ? results.flat() : []).slice().sort(asc),
    [results]
  );
  const game2FlatSorted = useMemo(
    () => (pairs ? pairs.flat() : []).slice().sort(asc),
    [pairs]
  );

  const countChip = (n: number) => (
    <span
      style={{
        marginLeft: 8,
        fontSize: 11,
        fontWeight: 700,
        padding: "2px 6px",
        borderRadius: 999,
        background: "#111",
        color: "#fff",
        lineHeight: 1,
      }}
    >
      {n}
    </span>
  );

  // ---------- Render guards ----------
  if (!history || !results || !pairs)
    return (
      <div style={{ padding: 20, textAlign: "center", color: "#666" }}>
        <h2>Loading predictions…</h2>
      </div>
    );

  // ---------- UI ----------
  return (
    <div style={{ padding: 10, fontFamily: "ui-sans-serif,system-ui" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <h1 style={{ fontSize: 24, margin: 0, fontWeight: 800 }}>
          North Carolina — Pick 3 Dashboard
        </h1>
        <button
          onClick={load}
          style={{
            padding: "6px 10px",
            borderRadius: 10,
            border: "1px solid #d0d0d0",
          }}
        >
          Refresh
        </button>
      </div>
      <div style={{ marginBottom: 8, color: "#666" }}>
        <b>Last updated:</b> {updated ? fmtNy(updated) : "—"} &nbsp;•&nbsp;{" "}
        <b>Now (EST):</b> {nowNy || "—"}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(470px, 1fr) 760px 1fr",
          alignItems: "start",
          gap: 10,
        }}
      >
        {/* History */}
        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 12,
            padding: 6,
            maxWidth: 680,
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr style={{ background: "#0f0f0f", color: "#fff" }}>
                {["DATE", "P1", "P2", "P3", "DRAW", "3-DIGIT", "#"].map((h) => (
                  <th
                    key={h}
                    style={{ padding: "6px 6px", fontSize: 12, textAlign: "center" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((r, i) => (
                <tr key={i}>
                  <td style={{ padding: "6px 4px" }}>{niceDate(r?.[0])}</td>
                  <td style={{ textAlign: "center" }}>{r?.[1] ?? ""}</td>
                  <td style={{ textAlign: "center" }}>{r?.[2] ?? ""}</td>
                  <td style={{ textAlign: "center" }}>{r?.[3] ?? ""}</td>
                  <td style={{ textAlign: "center" }}>{badge(String(r?.[4] ?? ""))}</td>
                  <td style={{ textAlign: "center", fontWeight: 700 }}>
                    {r?.[5] ?? ""}
                  </td>
                  <td style={{ textAlign: "center" }}>{r?.[6] ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Predictions */}
        <aside
          style={{
            gridColumn: 2,
            justifySelf: "center",
            width: "100%",
            maxWidth: 760,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <h3
            style={{
              gridColumn: "1 / -1",
              margin: "2px 0 6px",
              fontWeight: 800,
              fontSize: 18,
              textAlign: "center",
            }}
          >
            {predictionsTitle}
          </h3>

          {/* Game 1 */}
          <section
            style={{
              border: "2px solid #000",
              borderRadius: 12,
              padding: 10,
              background: "#fff",
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "#C32020",
                fontWeight: 700,
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>Game 1</span>
              {countChip(game1FlatSorted.length)}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: 8,
              }}
            >
              {game1FlatSorted.map((v, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: 10,
                    padding: "6px 8px",
                    fontWeight: 700,
                    textAlign: "center",
                    background: "#fff",
                  }}
                >
                  {v}
                </div>
              ))}
            </div>
          </section>

          {/* Game 2 */}
          <section
            style={{
              border: "2px solid #000",
              borderRadius: 12,
              padding: 10,
              background: "#fff",
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "#C32020",
                fontWeight: 700,
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>Game 2</span>
              {countChip(game2FlatSorted.length)}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 8,
              }}
            >
              {game2FlatSorted.map((v, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: 10,
                    padding: "6px 8px",
                    fontWeight: 700,
                    textAlign: "center",
                    background: "#fff",
                  }}
                >
                  {v}
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
