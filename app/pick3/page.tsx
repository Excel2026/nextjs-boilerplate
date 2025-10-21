export default function Pick3Page() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">🎯 North Carolina Pick 3 Predictor</h1>
        <p className="text-center text-gray-600 mb-10">
          Automatically updated from your master Excel workbook
        </p>

        <div className="bg-white rounded-2xl shadow p-6">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border-b p-3 text-left">Date</th>
                <th className="border-b p-3 text-left">Draw Type</th>
                <th className="border-b p-3 text-left">P1</th>
                <th className="border-b p-3 text-left">P2</th>
                <th className="border-b p-3 text-left">P3</th>
                <th className="border-b p-3 text-left">Prediction</th>
                <th className="border-b p-3 text-left">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border-b p-3">10/21/2025</td>
                <td className="border-b p-3">Eve</td>
                <td className="border-b p-3">4</td>
                <td className="border-b p-3">3</td>
                <td className="border-b p-3">2</td>
                <td className="border-b p-3 font-semibold text-blue-700">432</td>
                <td className="border-b p-3 text-green-600 font-semibold">Hit 🎉</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-center text-gray-500 text-xs mt-8">
          © 2025 Pick3Predictor — Powered by Excel + Python + Vercel
        </p>
      </div>
    </main>
  );
}

