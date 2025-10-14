import GameweekTile from '~/components/gameweek-tile';
export default function LandingPage() {
    
    const gameweek = 5;
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

