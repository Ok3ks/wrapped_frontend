import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { GameweekTile } from '~/components/gameweek-tile';
import { Button } from '~/components/ui/button';
import { updateGameweek, useAppStore } from '~/store';
import { updateSeason } from '~/store';
import { type Season } from '~/types';

export default function LandingPage() {
    const { curSeason, curGameweek } = useAppStore();
    const seasons = Array.from<Season>(["2025_2026", "2024_2025" ]);

    return (
        <div className="flex w-full max-w-full overflow-x-hidden">
            {/* Sticky gameweek sidebar */}
            <aside className="sticky top-[49px] h-[calc(100vh-49px)] w-10 shrink-0 flex-col bg-surface border-r border-gold-border overflow-y-auto gw-sidebar">
                {Array.from({ length: 38 }, (_, i) => i + 1).sort((a,b) => b-a).map((gw) => (
                    <button
                        key={gw}
                        onClick={() => updateGameweek(gw)}
                        className={`w-full py-1.5 text-[10px] font-mono font-semibold transition-colors cursor-pointer border-none
                            ${gw === curGameweek
                                ? "bg-gold text-surface"
                                : "text-text-secondary hover:text-text-primary hover:bg-gold-subtle"
                            }`}
                    >
                        {gw}
                    </button>
                ))}
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0 px-3 py-3 sm:px-6 sm:py-4">
                {/* Season selector + GW nav row */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <select
                        value={curSeason}
                        onChange={(e) => updateSeason(e.target.value as Season)}
                        className="h-8 px-2 mt-3 w-36 flex justify-center text-xs font-semibold bg-surface border-2 border-gold-border text-text-primary cursor-pointer transition-colors hover:border-gold focus:border-gold outline-none sm:text-sm sm:h-9 sm:px-3"
                    >
                        {seasons.map((season) => (
                            <option key={season} value={season}>
                                {season.replace("_", "/")}
                            </option>
                        ))}
                    </select>

                    {/* Gameweek navigator */}
                    <div className="hidden sm:flex flex items-center sm:gap-2">
                        <Button className="nav-btn" onClick={() => updateGameweek(Math.max(1, curGameweek - 1))} disabled={curGameweek === 1}>
                            <ArrowLeftCircle size={20} />
                        </Button>
                        <div className="gameweek-nav-label">
                            GW <span>{curGameweek}</span>
                        </div>
                        <Button className="nav-btn" onClick={() => updateGameweek(Math.min(38, curGameweek + 1))} disabled={curGameweek === 38}>
                            <ArrowRightCircle size={20} />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <GameweekTile gameweek={curGameweek} season={curSeason} />
            </div>
        </div>
    );
}
