
import { getFixturesData, getGameweekData } from "~/data";
import { columns, DataTable } from "./data-table";
import {type Players, type Season } from "~/types";
import { useCallback, useEffect, useState } from "react";

interface gameweekTileProps {
    gameweek: number,
    season: Season
}

export function GameweekTile({ gameweek, season }: gameweekTileProps) {
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

export function FixtureTile({gameweek, season}: gameweekTileProps) {
    const [ data, setData ]  = useState(null);
    const fixtureData = useCallback( async () => {
        try {
        const response = await getFixturesData(1, "2025_2026")
        console.log(response);
        setData(response);
        } catch {
            throw new Error("Error fetching data");
        }
    }, [season]);

    useEffect(() =>{
        fixtureData();
    },  [season]);

    
    if (!data) {
        return
      }
    return (
        <div className="gameweek-tile">
                <h2> Fixtures {data}</h2>
            </div>
        );
}