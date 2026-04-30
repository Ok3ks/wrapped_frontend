import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowLeft, ExternalLink, FileBarChart, BarChart2, HelpCircle } from "lucide-react";

const ReportPage: React.FC = () => {
  const [fplId, setFplId] = useState<string>("");
  const [submittedFplId, setSubmittedFplId] = useState<boolean>(false);

  const handleFplIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fplId && /^\d+$/.test(fplId)) {
      setSubmittedFplId(true);
      console.log("Submitted FPL ID:", fplId);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 text-gray-900 relative overflow-hidden">
      {/* Corner flags */}
      <svg className="absolute top-0 left-0 w-10 h-10 text-gray-300 sm:w-14 sm:h-14" viewBox="0 0 40 40">
        <path d="M 2 2 Q 2 2 2 2 L 2 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <polygon points="2,2 14,5 2,10" fill="currentColor" opacity="0.4" />
        <path d="M 0 0 Q 8 0 8 8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      </svg>
      <svg className="absolute top-0 right-0 w-10 h-10 text-gray-300 sm:w-14 sm:h-14" viewBox="0 0 40 40">
        <path d="M 38 2 L 38 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <polygon points="38,2 26,5 38,10" fill="currentColor" opacity="0.4" />
        <path d="M 40 0 Q 32 0 32 8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      </svg>
      <svg className="absolute bottom-0 left-0 w-10 h-10 text-gray-300 sm:w-14 sm:h-14" viewBox="0 0 40 40">
        <path d="M 2 38 L 2 22" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <polygon points="2,38 14,35 2,30" fill="currentColor" opacity="0.4" />
        <path d="M 0 40 Q 8 40 8 32" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-10 h-10 text-gray-300 sm:w-14 sm:h-14" viewBox="0 0 40 40">
        <path d="M 38 38 L 38 22" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <polygon points="38,38 26,35 38,30" fill="currentColor" opacity="0.4" />
        <path d="M 40 40 Q 32 40 32 32" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      </svg>

      <div className="mx-auto px-3 py-6 sm:px-6 sm:py-10 max-w-[960px]">

        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-900 mb-6 no-underline uppercase tracking-wider font-medium">
          <ArrowLeft size={12} /> Dashboard
        </Link>

        {/* Hero — combined ID entry + guide */}
        <div className="bg-white border border-gray-200 mb-10 sm:mb-14">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Form */}
            <div className="p-5 sm:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <FileBarChart size={20} />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Manager Report</span>
              </div>
              <h1 className="text-2xl font-bold mb-4 sm:text-3xl sm:mb-6">
                Generate your<br />FPL report
              </h1>

              {!submittedFplId ? (
                <form onSubmit={handleFplIdSubmit}>
                  <label htmlFor="fplId" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Enter your Manager ID
                  </label>
                  <div className="flex gap-0">
                    <input
                      id="fplId"
                      type="text"
                      value={fplId}
                      onChange={(e) => setFplId(e.target.value)}
                      placeholder="1234567"
                      className="flex-1 h-11 px-4 text-base bg-white border-2 border-r-0 border-gray-900 text-gray-900 placeholder:text-gray-300 outline-none focus:border-gray-900 font-mono"
                      required
                      pattern="[0-9]+"
                      title="Please enter a valid numeric ID"
                    />
                    <button
                      type="submit"
                      className="h-11 px-5 bg-gray-900 text-white text-sm font-semibold uppercase tracking-wider hover:bg-gray-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                      disabled={!fplId || !/^\d+$/.test(fplId)}
                    >
                      Go <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart2 size={28} className="text-gray-900 shrink-0" />
                    <div>
                      <p className="font-bold text-lg">Processing</p>
                      <p className="text-gray-500 text-sm">FPL ID: <span className="font-mono font-bold text-gray-900">{fplId}</span></p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Generating season performance, transfer analysis, captain choices, and more.
                  </p>
                  <button
                    onClick={() => { setFplId(""); setSubmittedFplId(false); }}
                    className="text-sm font-semibold text-gray-900 underline underline-offset-2 hover:text-gray-600 cursor-pointer"
                  >
                    Try a different ID
                  </button>
                </div>
              )}
            </div>

            {/* Right: How-to guide */}
            <div className="bg-gray-900 text-white p-5 sm:p-8 flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">How to find your ID</p>
              <ol className="space-y-2.5 text-sm text-gray-300">
                <li className="flex gap-2">
                  <span className="text-white font-bold shrink-0">1.</span>
                  <span>
                    Go to{" "}
                    <a href="https://fantasy.premierleague.com/" target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-2 inline-flex items-center gap-1">
                      fantasy.premierleague.com <ExternalLink className="h-3 w-3" />
                    </a>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-white font-bold shrink-0">2.</span>
                  <span>Click <strong className="text-white">"Points"</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-white font-bold shrink-0">3.</span>
                  <span>Copy the number from the URL</span>
                </li>
              </ol>
              <div className="mt-4 p-3 bg-black/30 font-mono text-xs break-all text-gray-500 border border-gray-700 sm:text-sm">
                /entry/<span className="text-white font-bold">1234567</span>/event/8
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder grid — report sections preview */}
        <div className="mb-10 sm:mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Report Preview</p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {/* Tall left column */}
            <div className="col-span-2 row-span-2 bg-white border border-gray-200 p-5 flex flex-col justify-between min-h-[200px] sm:min-h-[280px]">
              <div>
                <div className="w-10 h-1 bg-gray-900 mb-3" />
                <p className="text-sm font-bold uppercase tracking-wider">Season Overview</p>
                <p className="text-xs text-gray-400 mt-1">Points, rank, and trajectory</p>
              </div>
              <div className="flex gap-1 items-end mt-4">
                {[40, 65, 50, 80, 55, 70, 90, 60, 75, 85, 45, 95].map((h, i) => (
                  <div key={i} className="flex-1 bg-gray-100" style={{ height: `${h}%`, minHeight: `${h * 0.8}px` }} />
                ))}
              </div>
            </div>

            {/* Top right small cards */}
            <div className="bg-white border border-gray-200 p-4 flex flex-col justify-between min-h-[120px] sm:min-h-[130px]">
              <div className="w-8 h-1 bg-gray-900" />
              <div>
                <p className="text-2xl font-bold text-gray-200 sm:text-3xl">—</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Overall Rank</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-4 flex flex-col justify-between min-h-[120px] sm:min-h-[130px]">
              <div className="w-8 h-1 bg-gray-900" />
              <div>
                <p className="text-2xl font-bold text-gray-200 sm:text-3xl">—</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Total Points</p>
              </div>
            </div>

            {/* Bottom right small cards */}
            <div className="bg-white border border-gray-200 p-4 flex flex-col justify-between min-h-[120px] sm:min-h-[130px]">
              <div className="w-8 h-1 bg-gray-900" />
              <div>
                <p className="text-2xl font-bold text-gray-200 sm:text-3xl">—</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Best GW</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-4 flex flex-col justify-between min-h-[120px] sm:min-h-[130px]">
              <div className="w-8 h-1 bg-gray-900" />
              <div>
                <p className="text-2xl font-bold text-gray-200 sm:text-3xl">—</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Transfers</p>
              </div>
            </div>
          </div>

          {/* Second row — wide cards */}
          <div className="grid grid-cols-1 gap-3 mt-3 sm:grid-cols-3 sm:gap-4 sm:mt-4">
            <div className="bg-white border border-gray-200 p-5 min-h-[140px] sm:min-h-[160px]">
              <div className="w-10 h-1 bg-gray-900 mb-3" />
              <p className="text-sm font-bold uppercase tracking-wider">Captain Picks</p>
              <p className="text-xs text-gray-400 mt-1">Your captaincy decisions and hit rates</p>
              <div className="flex gap-2 mt-4">
                {[60, 40, 80, 30, 70].map((w, i) => (
                  <div key={i} className="h-2 bg-gray-100" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 min-h-[140px] sm:min-h-[160px]">
              <div className="w-10 h-1 bg-gray-900 mb-3" />
              <p className="text-sm font-bold uppercase tracking-wider">Transfer History</p>
              <p className="text-xs text-gray-400 mt-1">Moves, hits, and value changes</p>
              <div className="flex items-end gap-1 mt-4">
                {[20, 35, 15, 50, 25, 40, 30, 45].map((h, i) => (
                  <div key={i} className="flex-1 bg-gray-100" style={{ height: `${h}px` }} />
                ))}
              </div>
            </div>

            <div className="bg-[#1a472a] text-white p-0 min-h-[200px] sm:min-h-[240px] relative overflow-hidden">
              {/* Half pitch SVG */}
              <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
                {/* Pitch background */}
                <rect x="0" y="0" width="300" height="400" fill="#1a472a" />
                {/* Mow stripes */}
                <rect x="0" y="0" width="300" height="50" fill="#1d5230" />
                <rect x="0" y="100" width="300" height="50" fill="#1d5230" />
                <rect x="0" y="200" width="300" height="50" fill="#1d5230" />
                <rect x="0" y="300" width="300" height="50" fill="#1d5230" />

                {/* Pitch lines */}
                {/* Outer boundary */}
                <rect x="15" y="15" width="270" height="370" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                {/* Halfway line */}
                <line x1="15" y1="15" x2="285" y2="15" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                {/* Center circle (half) */}
                <path d="M 105 15 A 45 45 0 0 1 195 15" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                {/* Center spot */}
                <circle cx="150" cy="15" r="2.5" fill="rgba(255,255,255,0.3)" />

                {/* Penalty box */}
                <rect x="55" y="280" width="190" height="105" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                {/* Goal area (6-yard box) */}
                <rect x="100" y="340" width="100" height="45" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                {/* Penalty arc */}
                <path d="M 105 280 A 40 40 0 0 0 195 280" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                {/* Penalty spot */}
                <circle cx="150" cy="320" r="2.5" fill="rgba(255,255,255,0.3)" />
                {/* Goal */}
                <rect x="125" y="383" width="50" height="4" fill="rgba(255,255,255,0.15)" />

                {/* Player dots — 4-4-2 formation */}
                {/* GK */}
                <circle cx="150" cy="360" r="6" fill="rgba(255,255,255,0.7)" />
                {/* DEF */}
                <circle cx="60"  cy="280" r="6" fill="rgba(255,255,255,0.5)" />
                <circle cx="120" cy="270" r="6" fill="rgba(255,255,255,0.5)" />
                <circle cx="180" cy="270" r="6" fill="rgba(255,255,255,0.5)" />
                <circle cx="240" cy="280" r="6" fill="rgba(255,255,255,0.5)" />
                {/* MID */}
                <circle cx="60"  cy="170" r="6" fill="rgba(255,255,255,0.5)" />
                <circle cx="120" cy="160" r="6" fill="rgba(255,255,255,0.5)" />
                <circle cx="180" cy="160" r="6" fill="rgba(255,255,255,0.5)" />
                <circle cx="240" cy="170" r="6" fill="rgba(255,255,255,0.5)" />
                {/* FWD */}
                <circle cx="110" cy="70" r="6" fill="rgba(255,255,255,0.5)" />
                <circle cx="190" cy="70" r="6" fill="rgba(255,255,255,0.5)" />
              </svg>

              {/* Label overlay */}
              <div className="relative z-10 p-4 sm:p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">Best XI</p>
                <p className="text-[10px] text-white/30 mt-0.5">Highest-scoring possible lineup</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ link */}
        <div className="border-t border-gray-200 pt-6 sm:pt-8 flex items-center justify-between">
          <Link to="/faq" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-900 no-underline uppercase tracking-wider">
            <HelpCircle size={14} /> FAQ
          </Link>
          <span className="text-xs text-gray-300">FPL Wrapped</span>
        </div>

      </div>
    </div>
  );
};

export default ReportPage;
