<section className="hidden md:block w-[420px] rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-md p-5 shadow-lg">
  <h2 className="text-lg font-semibold text-white mb-4">Recent Draws (Top 20)</h2>

  <div className="max-h-[560px] overflow-y-auto pr-2 space-y-2">
    {history.slice(0, 20).map((row, idx) => (
      <div
        key={idx}
        className="flex items-center justify-between bg-gray-800/60 rounded-lg px-4 py-2 text-white text-sm"
      >
        <span className="w-6">{idx + 1}</span>

        <span className="w-28">{row.Date}</span>

        <span
          className={`px-2 py-0.5 rounded text-xs font-bold ${
            row.Draw === "MID"
              ? "bg-blue-500 text-white"
              : "bg-orange-400 text-black"
          }`}
        >
          {row.Draw}
        </span>

        <span className="w-10 text-right font-semibold">
          {`${row.P1}${row.P2}${row.P3}`}
        </span>
      </div>
    ))}
  </div>
</section>
