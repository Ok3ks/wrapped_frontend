import { useCallback, useState } from 'react';
import { GameweekTile, FixtureTile } from '~/components/gameweek-tile';
import { Button } from '~/components/ui/button';
import { getGameweekData } from '~/data';
import { type Season } from '~/types';
export default function LandingPage() {

    const gameweekLength = 38;
    const seasons = Array.from<Season>(["2024_2025", "2025_2026"]);
    const [ curSeason, setCurSeason ] = useState<Season>("2025_2026");

    return (
    
        <div className='header'>
            <div className={`justify-center flex grid-rows-${seasons.length} gap-${seasons.length}`}>
            {
                   seasons.map((season, index, array) => <Button key={season} className='button-filter' onClick={() => setCurSeason(season)}> {season} </Button>
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
                };
                    <FixtureTile gameweek={1} season={'2025_2026'}></FixtureTile>
                </div>
            </div>
        </div>
    )
}

