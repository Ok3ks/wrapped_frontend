
import { columns, type Players, DataTable } from "./data-table";

interface gameweekTileProps {
    gameweek: number,
}

async function getGameweekData() : Promise<Players[]> {
    return [
        {
            id: "1",
            name: "Salah",
            team: "Liverpool",
            points: 11,
        },
        {
            id: "2",
            name: "Sarr",
            team: "Crystal Palace",
            points: 80,
        },
        {
            id: "3",
            name: "Mateta",
            team: "Crystal Palace",
            points: 70,
        },
        {
            id: "4",
            name: "Saka",
            team: "Crystal Palace",
            points: 70,
        }
    ]
}
export default async function gameweekTile({gameweek}: gameweekTileProps) {
    const data = await getGameweekData();
    return (
            <div className="gameweek-tile">
                <h2> Gameweek {gameweek}</h2>
                <div>
                    <DataTable columns={columns} data={data} />
                </div>

            </div>
        
    );
}

