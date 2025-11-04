// app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";

const TWO_DRAW_STATES = [
  "Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
  "Idaho","Illinois","Indiana","Kansas","Kentucky","Maine","Maryland","Michigan",
  "Mississippi","Missouri","North Carolina","New Hampshire","New Jersey","New Mexico",
  "New York","Ohio","Pennsylvania","South Carolina","Virginia","Vermont","Wisconsin",
];

function getWeekOfMonth(date: Date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const day = date.getDate();
  return Math.ceil((firstDay + day) / 7);
}

function getMonthAbbr(date: Date) {
  return date.toLocaleString("default", { month: "short" });
}

export default function Page() {
  const today = new Date();
  const currentWeek = getWeekOfMonth(today);
  const currentMonth = getMonthAbbr(today);

  const SHARED_MAX_W = "max-w-[648px]";
  const scrollContainer = useRef<HTMLDivElement>(null);
  const statesList = useRef<HTMLDivElement>(null);
  const trackerList = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sc = scrollContainer.current;
    const sList = statesList.current;
    const tList = trackerList.current;
    if (!sc || !sList || !tList) return;
    const syncScroll = () => {
      sList.scrollTop = sc.scrollTop;
      tList.scrollTop = sc.scrollTop;
    };
    sc.addEventListener("scroll", syncScroll);
    return () => sc.removeEventListener("scroll", syncScroll);
  }, []);

  const gridBackground: React.CSSProperties = {
    backgroundImage:
      "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, rgba(255,255,255,0.15) 27px, rgba(255,255,255,0.15) 28px)",
    backgroundRepeat: "repeat",
    backgroundSize: "100% 28px",
  };

  const trackerGridBackground: React.CSSProperties = {
    backgroundImage: `
      linear-gradient(to right, transparent 49.5%, rgba(255,255,255,0.85) 50%, transparent 50.5%),
      repeating-linear-gradient(to bottom, transparent 0, transparent 27px, rgba(255,255,255,0.15) 27px, rgba(255,255,255,0.15) 28px)
    `,
    backgroundRepeat: "repeat",
    backgroundSize: "100% 28px",
  };

  return (
    <main className="relative min-h-screen text-white">
      <div className="absolute inset-0 z-0 bg-black" />

      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-no-repeat"
        style={{
          backgroundImage: 'url("/Landing%20page%20background%20v2.png")',
          backgroundSize: "70%",
          backgroundPosition: "calc(50% + 1in) center",
          transform: "scaleX(-1) rotate(180deg)",
          transformOrigin: "center",
          opacity: 1,
          filter: "none",
        }}
      />

      <style jsx global>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.25); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.45); }
        ::-webkit-scrollbar-track { background: transparent; }
        * { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.25) transparent; }
      `}</style>

      <div
        ref={scrollContainer}
        className="fixed top-[64px] left-0 z-30 flex h-[calc(100vh-64px)] overflow-y-auto scroll-smooth"
      >
        {/* Servicing / States */}
        <aside className="w-44 sm:w-52 bg-black/45 backdrop-blur-md border-r border-white/10 flex-shrink-0">
          <div className="px-3 py-4 border-b border-white/10">
            <h3 className="mb-2 text-lg font-bold text-yellow-300 text-center underline">
              Servicing
            </h3>
            <p className="text-center text-xs leading-snug text-white px-1">
              States in orange are currently being serviced, more states coming soon
            </p>
          </div>

          <div ref={statesList} style={{ ...gridBackground, marginTop: "-8px" }}>
            <ul className="text-sm leading-tight text-center">
              {TWO_DRAW_STATES.map((s) => (
                <li key={s} className="h-[28px] flex items-center justify-center">
                  {s === "North Carolina" ? (
                    <span className="inline-flex items-center justify-center rounded-full bg-orange-500 px-3 py-[1px] text-white font-bold leading-tight">
                      North Carolina
                    </span>
                  ) : (
                    s
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Hit Tracker */}
        <aside className="w-44 sm:w-52 bg-black/45 backdrop-blur-md border-r border-white/10 flex-shrink-0">
          <div className="px-3 pt-2 pb-1 border-b border-white/10 bg-black/60 backdrop-blur-md">
            <h3 className="text-lg font-bold text-yellow-300 text-center underline mb-1">
              Hit Tracker
            </h3>
            <p className="text-xs text-center text-white leading-snug mb-2">
              Best Bet Performance (Hits Per week / Per Month)
            </p>
          </div>
          <div className="flex justify-between px-2 pt-1 pb-1 text-xs text-yellow-200 font-semibold border-b border-white/10 bg-black/60 backdrop-blur-md">
            <p className="w-1/2 text-center">Week {currentWeek}</p>
            <p className="w-1/2 text-center">Month {currentMonth}</p>
          </div>

          <div ref={trackerList} style={trackerGridBackground}>
            <div className="flex text-xs text-gray-300">
              <div className="w-1/2">
                <ul className="text-center">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <li key={i} className="h-[28px]" />
                  ))}
                </ul>
              </div>
              <div className="w-1/2">
                <ul className="text-center">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <li key={i} className="h-[28px]" />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-20">
        <div className="mx-auto max-w-[90rem] px-6 pl-[26rem]">
          <div className="w-full flex flex-col items-center gap-6 mt-[80px] pb-10">
            {/* Logo (nudged right) */}
            <div className={`w-full ${SHARED_MAX_W} -ml-[34rem]`}>
              <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl aspect-[16/10]">
                <Image
                  src="/Best Bet Logo v1 - 10-28-2025.png"
                  alt="Best Bet Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Welcome panel (nudged right) */}
            <div className={`w-full ${SHARED_MAX_W} -ml-[34rem]`}>
              <div className="rounded-2xl bg-black/55 backdrop-blur-md p-8 shadow-2xl w-full">
                <h1 className="text-3xl font-extrabold text-yellow-400 mb-2 text-center">
                  Welcome to your VIP Source!
                </h1>

                <div className="space-y-2 mb-6">
                  <p className="text-emerald-300 font-semibold text-center">
                    The Most Accurate Pick 3 Predictions On The Planet!
                  </p>
                  <p className="invisible select-none">placeholder</p>
                  <p className="text-gray-300 text-center">
                    Real time draw history and live predictions Daily!
                  </p>
                </div>

                <div className="flex justify-center">
                  <Link href="/plans" className="btn btn-secondary">
                    Become a Member
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
