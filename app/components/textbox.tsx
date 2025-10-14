
interface textBoxProps {
    img: string,
    gameweek: number,
    summary: string
}

export default function textBox({img, gameweek, summary}: textBoxProps) {

    return (
        <div className="gameweek-tile">
            <img></img>
            <h2>Gameweek {gameweek} summary</h2>
            <p>{summary}</p>
        </div>
    );
}

