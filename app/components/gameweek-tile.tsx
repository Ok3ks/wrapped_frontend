
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
            points: 8,
        },
        {
            id: "2",
            name: "Sarr",
            team: "Crystal Palace",
            points: 4,
        },
        {
            id: "3",
            name: "Mateta",
            team: "Crystal Palace",
            points: 9,
        },
        {
            id: "4",
            name: "Saka",
            team: "Arsenal",
            points: 5,
        },
        {
            id: "3",
            name: "Gravenberch",
            team: "Liverpool",
            points: 11,
        },
        {
            id: "4",
            name: "Cunha",
            team: "Manchester United",
            points: 1,
        },

        {
            id: "5",
            name: "Xhaka",
            team: "Sunderland",
            points: 10,
        },
        
    ]
}
export default async function gameweekTile({gameweek}: gameweekTileProps) {
    const data = await getGameweekData();
    return (
            <div className="gameweek-tile">
                <h2> Gameweek {gameweek}</h2>
                <DataTable columns={columns} data={data} />
            </div>
        
    );
}

