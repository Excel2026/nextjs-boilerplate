"use client";
import { useEffect, useMemo, useState } from "react";

type Row = string[]; // [Date,P1,P2,P3,Draw,3-Digit,#]

export default function Page() {
  const [history, setHistory] = useState<Row[]>([]);
  const [results, setResults] = useState<string[][]>([]);
  const [pairs, setPairs] = useState<string[][]>([]);
  const [updated, setUpdated] = useState("");
  const [nowNy, setNowNy] = useState<string>("");

  // ---------- robust date helpers ----------
  const parseDateMs = (v: unknown): number => {
    if (v == null) return 0;
    if (typeof v === "string") {
      const s = v.trim();

      // MM/DD/YYYY
      let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
      if (m) {
        const mm = Number(m[1]), dd = Number(m[2]); let yy = Number(m[3]);
        if (yy < 100) yy += 2000;
        const t = new Date(yy, mm - 1, dd).getTime();
        return Number.isNaN(t) ? 0 : t;
      }

      // MM/DD YYYY
      m = s.match(/^(\d{1,2})\/(\d{1,2})\s+(\d{2,4})$/);
      if (m) {
        const mm = Number(m[1]), dd = Number(m[2]); let yy = Number(m[3]);
        if (yy < 100) yy += 2000;
        const t = new Date(yy, mm - 1, dd).getTime();
        return Number.isNaN(t) ? 0 : t;
      }

      // MM/DDYYYY (e.g., 9/172025)
      m = s.match(/^(\d{1,2})\/(\d{1,2})(\d{2,4})$/);
      if (m) {
        const mm = Number(m[1]), dd = Number(m[2]); let yy = Number(m[3]);
        if (yy < 100) yy += 2000;
        const t = new Date(yy, mm - 1, dd).getTime();
        return Number.isNaN(t) ? 0 : t;
      }

      // YYYY-MM-DD
      m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (m) {
        const yy = Number(m[1]), mm = Number(m[2]), dd = Number(m[3]);
        const t = new Date(yy, mm - 1, dd).getTime();
        return Number.isNaN(t) ? 0 : t;
      }

      const t = new Date(s).getTime();
      return Number.isNaN(t) ? 0 : t;
    }
    if (v instanceof Date) return v.getTime();
    const t = new Date(String(v)).getTime();
    return Number.isNaN(t) ? 0 : t;
  };

  const niceDate = (v: unknown): string => {
    const ms = parseDateMs(v);
    if (!ms) return typeof v === "string" ? v : String(v ?? "");
    const d = new Date(ms);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  // ---------- UI helpers ----------
  const fmtNy = (d: Date | string) => {
    const dt = d instanceof Date ? d : new Date(d);
    try { return dt.toLocaleString("en-US", { timeZone: "America/New_York" }); }
    catch { return String(d); }
  };

  const badge = (draw: string) => {
    const isMid = String(draw).toLowerCase().startsWith("mid");
    const bg = isMid ? "#F6EFD0" : "#DDEBFF";
    const bd = isMid ? "#E3D3A3" : "#BBD5FF";
    const fg = isMid ? "#6B4E00" : "#0B3A7A";
    return (
      <span style={{
        fontSize:11, padding:"2px 6px", borderRadius:999, background:bg, color:fg,
        border:`1px solid ${bd}`, fontWeight:600, display:"inline-block",
        minWidth:30, textAlign:"center", lineHeight:1.35
      }}>
        {draw || ""}
      </span>
    );
  };

  // ---------- data load ----------
  const load = () =>
    fetch("/predictions.json?t=" + Date.now(), { cache: "no-store" })
      .then(r => r.json())
      .then(j => {
        const hist = (j?.History ?? []) as Row[];
        const withTs = hist.map((row) => ({ row, ts: parseDateMs(row?.[0]) }));
        const parsed = withTs.filter(x => x.ts > 0).sort((a, b) => b.ts - a.ts).map(x => x.row);
        const unparsed = withTs.filter(x => x.ts === 0).map(x => x.row);
        setHistory([...parsed, ...unparsed]);

        setResults((j?.Results ?? []) as string[][]);
        setPairs((j?.Pairs ?? []) as string[][]);
        setUpdated(j?.updated ?? "");
      })
      .catch(console.error);

  useEffect(() => { load(); }, []);

  // live clock
  useEffect(() => {
    const tick = () => setNowNy(fmtNy(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Midday vs Evening from latest row
  const latestDraw = history?.[0]?.[4] || "";
  const predictionsTitle = useMemo(() => {
    const v = String(latestDraw).toLowerCase();
    if (v.startsWith("mid")) return "Midday Predictions";
    if (v.startsWith("eve")) return "Evening Predictions";
    return "Today’s Predictions";
  }, [latestDraw]);

  // ---------- sorting + counts ----------
  const num = (s: string) => {
    const n = parseInt(String(s).replace(/[^\d]/g, ""), 10);
    return Number.isNaN(n) ? Number.POSITIVE_INFINITY : n;
  };
  const asc = (a: string, b: string) => num(a) - num(b);

  // Game 1: FLATTEN + sort the entire list (not per-set)
  const game1FlatSorted = useMemo(
    () => (results.flat?.() ?? ([] as string[])).slice().sort(asc),
    [results]
  );
  const game1Count = game1FlatSorted.length;

  // Game 2: flatten + sort all numbers (already requested)
  const game2FlatSorted = useMemo(
    () => (pairs.flat?.() ?? ([] as string[])).slice().sort(asc),
    [pairs]
  );
  const game2Count = game2FlatSorted.length;

  // styles
  const th = { padding: "6px 6px", fontSize: 12, letterSpacing: 0.2 } as const;
  const td = { padding: "6px 6px", fontSize: 14 } as const;
  const tdC = { ...td, textAlign: "center" as const };

  const countChip = (n: number) => (
    <span style={{
      marginLeft: 8,
      fontSize: 11,
      fontWeight: 700,
      padding: "2px 6px",
      borderRadius: 999,
      background: "#111",
      color: "#fff",
      lineHeight: 1
    }}>
      {n}
    </span>
  );

  return (
    <div style={{ padding: 10, fontFamily: "ui-sans-serif,system-ui" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <h1 style={{ fontSize:24, margin:0, fontWeight:800 }}>North Carolina — Pick 3 Dashboard</h1>
        <button onClick={load} style={{ padding:"6px 10px", borderRadius:10, border:"1px solid #d0d0d0" }}>Refresh</button>
      </div>
      <div style={{ marginBottom:8, color:"#666" }}>
        <b>Last updated:</b> {updated ? fmtNy(updated) : "—"} &nbsp;•&nbsp; <b>Now (EST):</b> {nowNy || "—"}
      </div>

      {/* Layout */}
      <div
        style={{
          display:"grid",
          gridTemplateColumns:"minmax(470px, 1fr) 760px 1fr",
          alignItems:"start",
          gap:10
        }}
      >
        {/* LEFT: History */}
        <div style={{ border:"1px solid #e5e5e5", borderRadius:12, padding:6, maxWidth:680 }}>
          <table style={{ width:"100%", borderCollapse:"collapse", tableLayout:"fixed" }}>
            <colgroup>
              <col style={{ width:"88px" }} />
              <col style={{ width:"44px" }} />
              <col style={{ width:"44px" }} />
              <col style={{ width:"44px" }} />
              <col style={{ width:"58px" }} />
              <col style={{ width:"68px" }} />
              <col style={{ width:"36px" }} />
            </colgroup>
            <thead>
              <tr style={{ background:"#0f0f0f", color:"#fff" }}>
                <th style={{ ...th, textAlign:"left" }}>DATE</th>
                <th style={{ ...th, textAlign:"center" }}>P1</th>
                <th style={{ ...th, textAlign:"center" }}>P2</th>
                <th style={{ ...th, textAlign:"center" }}>P3</th>
                <th style={{ ...th, textAlign:"center" }}>DRAW</th>
                <th style={{ ...th, textAlign:"center" }}>3-DIGIT</th>
                <th style={{ ...th, textAlign:"center" }}>#</th>
              </tr>
            </thead>
            <tbody>
              {history.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...td, padding:"6px 4px" }}>{niceDate(r?.[0])}</td>
                  <td style={tdC}>{r?.[1] ?? ""}</td>
                  <td style={tdC}>{r?.[2] ?? ""}</td>
                  <td style={tdC}>{r?.[3] ?? ""}</td>
                  <td style={tdC}>{badge(String(r?.[4] ?? ""))}</td>
                  <td style={{ ...tdC, fontWeight:700 }}>{r?.[5] ?? ""}</td>
                  <td style={tdC}>{r?.[6] ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CENTER: Game 1 + Game 2 side-by-side */}
        <aside
          style={{
            gridColumn: 2,
            justifySelf: "center",
            width: "100%",
            maxWidth: 760,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16
          }}
        >
          {/* Title */}
          <h3 style={{ gridColumn: "1 / -1", margin:"2px 0 6px", fontWeight:800, fontSize:18, textAlign:"center" }}>
            {predictionsTitle}
          </h3>

          {/* Game 1 (flattened & sorted) */}
          <section style={{ border:"2px solid #000", borderRadius:12, padding:10, background:"#fff" }}>
            <div style={{ fontSize:14, color:"#C32020", fontWeight:700, marginBottom:8, display:"flex", alignItems:"center" }}>
              <span>Game 1</span>{countChip(game1Count)}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(6, 1fr)", gap:8 }}>
              {game1FlatSorted.map((v, i) => (
                <div key={i} style={{
                  border:"1px solid #e5e5e5",
                  borderRadius:10,
                  padding:"6px 8px",
                  fontWeight:700,
                  textAlign:"center",
                  background:"#fff"
                }}>
                  {v}
                </div>
              ))}
            </div>
          </section>

          {/* Game 2 (flattened & sorted) */}
          <section style={{ border:"2px solid #000", borderRadius:12, padding:10, background:"#fff" }}>
            <div style={{ fontSize:14, color:"#C32020", fontWeight:700, marginBottom:8, display:"flex", alignItems:"center" }}>
              <span>Game 2</span>{countChip(game2Count)}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:8 }}>
              {game2FlatSorted.map((v, i) => (
                <div key={i} style={{
                  border:"1px solid #e5e5e5",
                  borderRadius:10,
                  padding:"6px 8px",
                  fontWeight:700,
                  textAlign:"center",
                  background:"#fff"
                }}>
                  {v}
                </div>
              ))}
            </div>
          </section>
        </aside>

        <div />
      </div>
    </div>
  );
}
