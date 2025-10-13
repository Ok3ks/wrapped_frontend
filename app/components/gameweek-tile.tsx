
interface gameweekTileProps {
    gameweek: number,
    summary: string,
    img: string
}

export default function gameweekTile({gameweek, summary, img}: gameweekTileProps) {

    return (
        <div className="flex grid-cols-2 gap-4">
            <div className="gameweek-tile">
                <h2> Gameweek {gameweek}</h2>
            </div>
            <div className="gameweek-info">
                <img></img>
                <h2>Gameweek {gameweek} summary</h2>
                <p>{summary}</p>
            </div>
    </div>
    );
}

