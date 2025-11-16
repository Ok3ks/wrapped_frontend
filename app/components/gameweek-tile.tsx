
import { getFixturesData, getGameweekData } from "~/data";
import {type Fixtures, type Players, type Season } from "~/types";
import { useCallback, useEffect, useState } from "react";
import { columns, DataTable } from "./data-table";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "~/components/ui/carousel"

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
        } catch(e) {
            console.log(e);
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
                    <Carousel>
                    <CarouselPrevious/>
                        <CarouselContent>
                        <CarouselItem>
                            <div className="fixture-tile">
                            <FixtureTile key={gameweek+1} gameweek={gameweek} season={'2025_2026'}></FixtureTile>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <DataTable columns={columns} data={data} />
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselNext/>
                    </Carousel>
            </div>
    );
}

export function FixtureTile({gameweek, season}: gameweekTileProps) {
    const [ data, setData ]  = useState<Fixtures[]>([{
        homedifficulty:"3",
        awaydifficulty:"",
        home: "",
        away: "",
        gameweek: 2,
        season: "2024_2025",
        draw: false,
        date: new Date("1995-12-17T03:24:00"),
        homegoals: 0,
        awaygoals: 0,
        finished: false,
    }]);

    const fixtureData = useCallback( async () => {
        try {
        const response = await getFixturesData(gameweek, "2025_2026")
        setData(response as Fixtures[]);

        } catch(e) {
            console.log(e)
            throw new Error("Error fetching data");
        }
    }, [season]);

    useEffect(() =>{
        fixtureData();
    },  [season, gameweek]);

    
    if (!data) {
        return
      }
    return (
        <div className="px-12 justify-between">
                {   
                    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((item, index, ) => {

                        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                        console.log(userTimezone)
                        const tempDate = new Intl.DateTimeFormat('en-US', {
                            timeZone: userTimezone,
                            weekday: 'short',
                            hour: 'numeric',   
                            minute: '2-digit',
                            hour12: true 
                        }).format(new Date(item.date));

                        console.log(tempDate);
                        const homeWin: Boolean = item.homegoals > item.awaygoals ;
                        const draw: Boolean = item.homegoals == item.awaygoals;

                        return (
                            
                        <div className="h-9">
                        <h3 key={index}>
                            <span className="justify-between bg-gray-200">{tempDate}</span>
                            <span className={ draw ? 'bg-sky-200 px-5 font-thin' : !homeWin ? 'bg-sky-200 px-5 font-thin' : 'bg-sky-200 px-5 font-medium'}>{item.home}</span> 
                            <span className={item.finished ? 'bg-green-500' : 'bg-yellow-500'}>
                                <span className="px-2 space-x-24">{item.homegoals} 
                                  -  
                                {item.awaygoals}
                                </span>
                            </span>
                             <span className={ draw ? 'bg-sky-200 px-5 font-thin' : homeWin ? 'bg-sky-200 px-5 font-thin' : 'bg-sky-200 px-5 font-medium' }>{item.away}</span> 
                        </h3> 
                        </div>
                    )})
                }
            </div>
        );
}