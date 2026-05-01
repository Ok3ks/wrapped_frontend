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
        <div className="flex">
            {/* Sticky gameweek sidebar */}
            <aside className="hidden md:flex sticky top-[49px] h-[calc(100vh-49px)] w-10 shrink-0 flex-col bg-surface border-r border-gold-border overflow-y-auto gw-sidebar">
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
                    <div className="flex gap-2">
                        {seasons.map((season) => (
                            <button
                                key={season}
                                className={`px-4 py-1.5 h-8 text-xs font-semibold transition-colors cursor-pointer sm:text-sm sm:h-9 sm:px-5
                                    ${season === curSeason
                                        ? "bg-gold border-2 border-gold text-surface hover:bg-gold-soft"
                                        : "bg-transparent border-2 border-gold-border text-text-secondary hover:border-gold hover:text-text-primary"
                                    }`}
                                onClick={() => updateSeason(season)}
                            >
                                {season.replace("_", "/")}
                            </button>
                        ))}
                    </div>

                    {/* Gameweek navigator */}
                    <div className="flex items-center gap-2 sm:gap-3">
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
