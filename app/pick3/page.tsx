import fs from "node:fs/promises";
import path from "node:path";

// Ensure the page is always rendered fresh on Vercel after each deploy
export const revalidate = 0;           // no cache
export const dynamic = "force-dynamic";

type Row = {
  Date: string;        // "MM/DD/YYYY"
  DrawType: string;    // "Mid" | "Eve" (or similar)
  P1: string;
  P2: string;
  P3: string;
  Prediction: string;
  Result: string;
};

function parseUSDate(mmddyyyy: string): number {
  // mm/dd/yyyy -> epoch ms for descending sort
  const [m, d, y] = mmddyyyy.split("/").map((v) => parseInt(v, 10));
  // guard against bad data
  if (!m || !d || !y) return 0;
  return new Date(y, m - 1, d).getTime();
}

function sortRows(rows: Row[]): Row[] {
  // Newest date first; within same date: Eve above Mid
  const drawOrder = (s: string) => (s?.toLowerCase().startsWith("eve") ? 0 : 1);
  return [...rows].sort((a, b) => {
    const da = parseUSDate(a.Date);
    const db = parseUSDate(b.Date);
    if (db !== da) return db - da;                 // date desc
    return drawOrder(a.DrawType) - drawOrder(b.DrawType); // Eve first
  });
}

async function getData(): Promise<Row[]> {
  const file = path.join(process.cwd(), "public", "predictions.json");
  try {
    const raw = await fs.readFile(file, "utf8");
    const json = JSON.parse(raw) as Row[];
    return sortRows(json);
  } catch {
    // If the file isn't present yet, just show an empty table without any spinner.
    return [];
  }
}

export default async function Pick3Page() {
  const data = await getData();

  return (
    <main className="min-h-screen bg-gray-50 p-8 font-sans">
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
              <th className="border p-2 text-left">Draw</th>
              <th className="border p-2 text-left">P1</th>
              <th className="border p-2 text-left">P2</th>
              <th className="border p-2 text-left">P3</th>
              <th className="border p-2 text-left">Prediction</th>
              <th className="border p-2 text-left">Result</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={`${r.Date}-${r.DrawType}-${i}`} className="hover:bg-gray-50">
                <td className="border p-2">{r.Date}</td>
                <td className="border p-2">{r.DrawType}</td>
                <td className="border p-2">{r.P1}</td>
                <td className="border p-2">{r.P2}</td>
                <td className="border p-2">{r.P3}</td>
                <td className="border p-2 text-blue-600 font-semibold">{r.Prediction}</td>
                <td
                  className={`border p-2 ${
                    r.Result?.toLowerCase().includes("hit")
                      ? "text-green-600 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {r.Result}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td className="border p-4 text-gray-500 italic" colSpan={7}>
                  No data available yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-center text-gray-400 text-xs mt-8">
        © 2025 Pick3Predictor — Powered by Excel + Python + Vercel
      </p>
    </main>
  );
}
