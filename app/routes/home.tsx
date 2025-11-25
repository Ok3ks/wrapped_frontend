import { GameweekTile, FixtureTile } from '~/components/gameweek-tile';
import { Button } from '~/components/ui/button';
import { useSeasonStore } from '~/store';
import { updateSeason } from '~/store';
import { type Season } from '~/types';
import { useEffect } from 'react';
export default function LandingPage() {

    const gameweekLength = useSeasonStore((state:any ) => state.gameweekLength);
    const seasons = Array.from<Season>(["2024_2025", "2025_2026"]);

    
    const curSeason = useSeasonStore<Season>((state:any ) => state.curSeason);

    return (
       
        <div className='header'>
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
            <div className="flex grid-cols-2 gap-4">
                <div className='homepage'> 
                {
                    Array.from({length: gameweekLength }, (_, i) => (
                        <GameweekTile gameweek={i+1} key={i+1} season={curSeason}>
                    </GameweekTile> 
                    ))
                }
                </div>
            </div>
        </div>
    )
}

