
import { getGameweekData } from "~/data";
import { columns, DataTable } from "./data-table";
import {type Players, type Season } from "~/types";
import { useCallback, useEffect, useState } from "react";

interface gameweekTileProps {
    gameweek: number,
    season: Season
}


export default function GameweekTile({ gameweek, season }: gameweekTileProps) {
    const [ data, setData ]  = useState(null);
    const gameweekData = useCallback( async () => {
        try {
        const response = await getGameweekData(gameweek, season)
        setData(response);
        } catch {
            throw new Error("Error fetching data");
        }
    }, [gameweek]);

    useEffect(() =>{
        gameweekData();
    },  [season]);

    
    if (!data) {
        return
      }
    return (
            <div className="gameweek-tile">
                <h2> Gameweek {gameweek}</h2>
                <DataTable columns={columns} data={data} />
            </div>
    );
}

