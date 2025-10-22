"use client";

import fs from "node:fs/promises";
import path from "node:path";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Row = {
  Date: string;
  P1: string;
  P2: string;
  P3: string;
  Combined: string;
};

async function getData(): Promise<Row[]> {
  const f = path.join(process.cwd(), "public", "predictions.json");
  try {
    const txt = await fs.readFile(f, "utf8");
    const parsed = JSON.parse(txt);
    const rows: any[] = Array.isArray(parsed) ? parsed : parsed?.rows ?? [];
    return rows.map((r) => ({
      Date: String(r.Date ?? ""),
      P1: String(r.P1 ?? ""),
      P2: String(r.P2 ?? ""),
      P3: String(r.P3 ?? ""),
      Combined: String(r.Combined ?? r.Prediction ?? ""),
    }));
  } catch {
    return [];
  }
}

export default async function Page() {
  const data = await getData();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Pick 3 Predictions – North Carolina
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-600 text-sm mb-4">
          Automatically updated from your master Excel workbook
        </p>

        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">P1</th>
              <th className="border p-2 text-left">P2</th>
              <th className="border p-2 text-left">P3</th>
              <th className="border p-2 text-left">Combined</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td className="border p-4 italic text-gray-500" colSpan={5}>
                  No data available yet.
                </td>
              </tr>
            )}
            {data.map((r, i) => (
              <tr key={`${r.Date}-${i}`} className="hover:bg-gray-50">
                <td className="border p-2">{r.Date}</td>
                <td className="border p-2">{r.P1}</td>
                <td className="border p-2">{r.P2}</td>
                <td className="border p-2">{r.P3}</td>
                <td className="border p-2 text-blue-600 font-semibold">
                  {r.Combined}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-gray-400 text-xs mt-8">
        © 2025 Pick3Predictor — Powered by Excel + Python + Vercel
      </p>
    </main>
  );
}
