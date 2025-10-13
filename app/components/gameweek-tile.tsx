
interface gameweekTileProps {
    gameweek: number,
}

export default function gameweekTile({gameweek}: gameweekTileProps) {

    return (
            <div className="gameweek-tile">
                <h2> Gameweek {gameweek}</h2>
            </div>
        
    );
}

