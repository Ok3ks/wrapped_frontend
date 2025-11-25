import { Textarea } from "./ui/textarea"

interface SummaryBoxProps {
    gameweek: number,
    open:boolean
}

export function SummaryBox({ gameweek, open}: SummaryBoxProps) {

    if (open == true)
    return (
        <div className="summary-tile">
            <img></img>
            <h2>Gameweek {gameweek} summary</h2>
            <Textarea></Textarea>
        </div>
    );
}

