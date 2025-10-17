
import { getGameweekData } from "~/data";
import { columns, DataTable } from "./data-table";
import {type Players } from "~/types";
import { useCallback, useEffect, useState } from "react";

interface gameweekTileProps {
    gameweek: number,
}


export default function GameweekTile({ gameweek }: gameweekTileProps) {
    const [ data, setData ]  = useState(null);
    const gameweekData = useCallback( async () => {
        try {
        const response = await getGameweekData(gameweek)
        setData(response);
        } catch {
            throw new Error("Error fetching data");
        }
    }, [gameweek]);

    useEffect(() =>{
        gameweekData();
    }, [gameweekData]);

    
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

