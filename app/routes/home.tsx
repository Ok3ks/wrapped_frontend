import GameweekTile from '~/components/gameweek-tile';
export default function LandingPage() {
    
    const gameweek = 5;
    const gameweekLength = 38;
    const summary = "";

    return (
        <div className="flex grid-cols-2 gap-4">
            <div className='homepage w-full h-500 overflow-y-scroll'> 
            {
                Array.from({length: gameweekLength }, (_, i) => (
                <GameweekTile gameweek={i+1}>
                </GameweekTile>     
                ))
            };
            </div>
            <div className="gameweek-info">
                <img></img>
                <h2>Gameweek {gameweek} summary</h2>
                <p>{summary}</p>
            </div>
            </div>
    );
}

