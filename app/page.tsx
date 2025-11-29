// app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";

const TWO_DRAW_STATES = [
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Idaho",
  "Illinois",
  "Indiana",
  "Kansas",
  "Kentucky",
  "Maine",
  "Maryland",
  "Michigan",
  "Mississippi",
  "Missouri",
  "North Carolina",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "Ohio",
  "Pennsylvania",
  "South Carolina",
  "Virginia",
  "Vermont",
  "Wisconsin",
];

// Week 1 = days 1–7, Week 2 = 8–14, etc.
function getWeekOfMonth(date: Date) {
  return Math.ceil(date.getDate() / 7);
}

function getMonthAbbr(date: Date) {
  return date.toLocaleString("default", { month: "short" });
}

export default function Page() {
  const today = new Date();
  const currentWeek = getWeekOfMonth(today);
  const currentMonth = getMonthAbbr(today);

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

      {/* GLOBAL SCROLLBAR STYLING */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.25);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.45);
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
        }
      `}</style>

      {/* MOBILE NAV LINKS – STACKED TEXT, NO PILLS */}
      <div className="md:hidden text-center pt-10 pb-6 space-y-8">
        <Link href="/predictions" className="text-2xl font-bold">
          Predictions
        </Link>
        <Link href="/draw-history" className="text-2xl font-bold">
          Draw History
        </Link>
        <Link href="/plans" className="text-2xl font-bold">
          Subscription Plans
        </Link>
      </div>

      {/* DESKTOP LEFT PANELS */}
      <div
        ref={scrollContainer}
        className="hidden md:flex fixed top-[64px] left-0 z-30 h-[calc(100vh-64px)] overflow-y-auto scroll-smooth"
      >
        {/* Servicing (desktop) */}
        <aside className="w-52 bg-black/45 backdrop-blur-md border-r border-white/10 flex-shrink-0">
          <div className="px-3 py-4 border-b border-white/10">
            <h3 className="mb-2 text-lg font-bold text-yellow-300 text-center underline">
              Servicing
            </h3>

            <p className="text-center text-sm leading-snug text-white px-1">
              States in orange are currently being serviced,
              more states coming soon
            </p>

            <p className="mt-1 text-center text-xs text-emerald-300 font-semibold">
              Click your state name to see detailed performance stats.
            </p>
          </div>

          <div ref={statesList} style={{ ...gridBackground, marginTop: "-8px" }}>
            <ul className="text-base leading-[28px] text-center">
              {TWO_DRAW_STATES.map((s) => (
                <li
                  key={s}
                  className="h-[28px] flex items-center justify-center"
                >
                  {s === "North Carolina" ? (
                    <Link
                      href={`/state/${encodeURIComponent(
                        s.toLowerCase().replace(/\s+/g, "-")
                      )}`}
                      className="inline-flex items-center justify-center rounded-full bg-orange-500 px-3 h-[24px] text-white font-bold leading-none hover:bg-orange-400 transition-colors text-base"
                    >
                      North Carolina
                    </Link>
                  ) : (
                    <Link
                      href={`/state/${encodeURIComponent(
                        s.toLowerCase().replace(/\s+/g, "-")
                      )}`}
                      className="hover:text-yellow-200 transition-colors"
                    >
                      {s}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Hit Tracker (desktop) */}
        <aside className="w-52 bg-black/45 backdrop-blur-md border-r border-white/10 flex-shrink-0">
          <div className="px-3 py-4 border-b border-white/10">
            <h3 className="mb-2 text-lg font-bold text-yellow-300 text-center underline">
              Hit Tracker
            </h3>

            <p className="text-center text-sm text-white leading-snug px-1">
              Best Bet Performance (Hits Per week / Per Month)
            </p>
          </div>

          <div
            ref={trackerList}
            style={trackerGridBackground}
            className="text-xs text-gray-300"
          >
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
      <div className="relative z-20 md:ml-[26rem] pr-6">
        <div className="max-w-[900px] mx-auto flex flex-col items-center gap-6 mt-[30px] pb-10">
          {/* Logo */}
          <div className="w-full max-w-[650px]">
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

          {/* Welcome Panel */}
          <div className="w-full max-w-[650px]">
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
            </div>
          </div>

          {/* Servicing heading (mobile) */}
          <h2 className="md:hidden text-center text-yellow-300 text-2xl font-bold underline mt-4">
            Servicing
          </h2>

          {/* Servicing text (mobile) */}
          <div className="md:hidden text-center text-white px-6 mt-3">
            <p className="text-base leading-snug">
              States in orange are currently being serviced,
              more states coming soon
            </p>

            <p className="mt-2 text-emerald-300 font-semibold">
              Tap your state name to see performance stats.
            </p>
          </div>

          {/* States list (mobile only) */}
          <ul className="md:hidden text-center text-yellow-300 text-xl space-y-3 mt-6">
            {TWO_DRAW_STATES.map((s) => (
              <li key={s}>
                {s === "North Carolina" ? (
                  <Link
                    href={`/state/${encodeURIComponent(
                      s.toLowerCase().replace(/\s+/g, "-")
                    )}`}
                    className="inline-block bg-orange-500 px-4 py-1 rounded-full font-bold text-white"
                  >
                    North Carolina
                  </Link>
                ) : (
                  <Link
                    href={`/state/${encodeURIComponent(
                      s.toLowerCase().replace(/\s+/g, "-")
                    )}`}
                    className="hover:text-yellow-100"
                  >
                    {s}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Hit Tracker summary */}
          <div className="md:hidden text-center mt-10 mb-10 px-6">
            <h3 className="text-emerald-300 text-2xl font-bold mb-3">
              Hit Tracker
            </h3>
            <p className="text-gray-300 text-base leading-snug">
              Tracking coming soon!
            </p>
          </div>

          {/* Become a Member (mobile) – bulletproof centered & tight */}
          <div className="md:hidden flex justify-center items-center w-screen mt-2 mb-8 px-0">
            <Link
              href="/plans"
              className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-yellow-400 text-black font-semibold shadow-lg hover:bg-yellow-300 hover:shadow-xl transition-all duration-150"
            >
              Become a Member
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
