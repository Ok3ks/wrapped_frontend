import { useCallback, useState } from 'react';
import GameweekTile from '~/components/gameweek-tile';
import { getGameweekData } from '~/data';
export default function LandingPage() {

    const gameweekLength = 38;
    const summary = "";

    return (
        <div className='header'>
            <div className="flex grid-cols-2 gap-4">
                <div className='homepage'> 
                {
                    Array.from({length: gameweekLength }, (_, i) => (
                    <GameweekTile gameweek={i+1} key={i+1}>
                    </GameweekTile>     
                    ))
                };
                </div>
            </div>
        </div>
    );
}

