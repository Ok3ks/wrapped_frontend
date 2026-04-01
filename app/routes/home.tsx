import { ArrowLeftCircle, ArrowRightCircle, Minus, MoveLeft, MoveRight, Plus, FileBarChart } from 'lucide-react';
import { GameweekTile, FixtureTile } from '~/components/gameweek-tile';
import { Button } from '~/components/ui/button';
import { updateGameweek, useAppStore } from '~/store';
import { updateSeason } from '~/store';
import { type Season } from '~/types';
import { Link } from "react-router";
export default function LandingPage() {

    const { gameweekLength, curSeason, curGameweek  } = useAppStore();
    const seasons = Array.from<Season>(["2024_2025", "2025_2026"]);

    const handlePrev = () => {
        updateGameweek( Math.max(1, curGameweek - 1));
    };

    const handleNext = () => {
        updateGameweek(Math.min(38, curGameweek + 1)); // 38 gameweeks in a season
    };

    return (
       
        <div className='header'>
            <div className="flex justify-between items-center w-full mb-4">
                <div className={`justify-center flex grid-rows-${seasons.length} gap-${seasons.length}`}>
                {
                       seasons.map((season, index, array) => <Button key={season} className={
                            `
                            border-2 rounded-[15px] p-2 h-10 box-border overflow-y-hidden hover:text-white
                            ${season == curSeason
                                ? "bg-[#ffd700] border-[#ffd700] text-black"
                                : "bg-white border-[#ffd700] text-black"
                            }
                            `} onClick={() => {
                                updateSeason(season);
                            }
                            }> {season} </Button>
                        )
                }
                </div>
                <Link to="/report">
                    <Button className="bg-[rgba(255,215,0,0.15)] text-[#ffd700] border border-[#ffd700] hover:bg-[rgba(255,215,0,0.25)] flex items-center gap-2">
                        <FileBarChart size={16} />
                        Generate FPL Report
                    </Button>
                </Link>
            </div>
            <div className="flex grid-cols-2 gap-4">
                <div className='homepage'> 
                        <div className='gameweek-nav'>
                            <Button className="nav-btn" onClick={handlePrev} disabled={curGameweek === 1}>
                                <ArrowLeftCircle />
                            </Button>
                            <div className="gameweek-nav-label">Gameweek {curGameweek}</div>
                            <Button className="nav-btn" onClick={handleNext} disabled={curGameweek === 38}>
                                <ArrowRightCircle />
                            </Button>
                        </div>
                        <GameweekTile gameweek={curGameweek} season={curSeason} />
                </div>
            </div>
        </div>
    )
}

