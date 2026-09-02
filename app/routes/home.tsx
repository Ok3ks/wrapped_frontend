import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { GameweekTile } from '~/components/gameweek-tile';
import { Button } from '~/components/ui/button';
import { type Season } from '~/types';

const SEASONS: Season[] = ["2026_2027","2025_2026", "2024_2025"];
const DEFAULT_SEASON: Season = "2026_2027";
const DEFAULT_GAMEWEEK = 1;
const MIN_GAMEWEEK = 1;
const MAX_GAMEWEEK = 38;

function parseSeason(value: string | null): Season | null {
    return SEASONS.includes(value as Season) ? (value as Season) : null;
}

function parseGameweek(value: string | null): number | null {
    if (value === null) return null;
    const n = Number(value);
    if (!Number.isInteger(n) || n < MIN_GAMEWEEK || n > MAX_GAMEWEEK) return null;
    return n;
}

export default function LandingPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const seasonParam = parseSeason(searchParams.get('season'));
    const gameweekParam = parseGameweek(searchParams.get('gw'));

    const curSeason: Season = seasonParam ?? DEFAULT_SEASON;
    const curGameweek: number = gameweekParam ?? DEFAULT_GAMEWEEK;

    // Missing or invalid params get replaced with defaults so the URL always
    // reflects the rendered state.
    useEffect(() => {
        if (seasonParam === null || gameweekParam === null) {
            setSearchParams(
                { season: curSeason, gw: String(curGameweek) },
                { replace: true },
            );
        }
    }, [seasonParam, gameweekParam, curSeason, curGameweek, setSearchParams]);

    const setSeason = (season: Season) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set('season', season);
            return next;
        });
    };

    const setGameweek = (gameweek: number) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set('gw', String(gameweek));
            return next;
        });
    };

    return (
        <div className="flex w-full max-w-full overflow-x-hidden">
            {/* Sticky gameweek sidebar */}
            <aside className="sticky top-[49px] h-[calc(100vh-49px)] w-10 shrink-0 flex-col bg-surface border-r border-gold-border overflow-y-auto gw-sidebar">
                {Array.from({ length: 38 }, (_, i) => i + 1).map((gw) => (
                    // .sort((a,b) => b-a
                    <button
                        key={gw}
                        onClick={() => setGameweek(gw)}
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
                        onChange={(e) => setSeason(e.target.value as Season)}
                        className="h-8 px-2 mt-3 w-36 flex justify-center text-xs font-mono font-semibold bg-surface border-2 border-gold-border text-text-primary cursor-pointer transition-colors hover:border-gold focus:border-gold outline-none sm:text-sm sm:h-9 sm:px-3"
                    >
                        {SEASONS.map((season) => (
                            <option key={season} value={season}>
                                {season.replace("_", "/")}
                            </option>
                        ))}
                    </select>

                    {/* Gameweek navigator */}
                    <div className="hidden sm:flex items-center sm:gap-2">
                        <Button className="nav-btn" onClick={() => setGameweek(Math.max(MIN_GAMEWEEK, curGameweek - 1))} disabled={curGameweek === MIN_GAMEWEEK}>
                            <ArrowLeftCircle size={20} />
                        </Button>
                        <div className="gameweek-nav-label">
                            GW <span>{curGameweek}</span>
                        </div>
                        <Button className="nav-btn" onClick={() => setGameweek(Math.min(MAX_GAMEWEEK, curGameweek + 1))} disabled={curGameweek === MAX_GAMEWEEK}>
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
