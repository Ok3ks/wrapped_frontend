
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

const TopExpectedAssists = (players:Players[]) => {
    const filteredPlayers = players.sort((a, b) => Number(b.expected_assists) - Number(a.expected_assists))
        .slice(0, 2);
    
        return filteredPlayers;
    };


export function GameweekTile({ gameweek, season }: gameweekTileProps) {
    const [ data, setData ]  = useState<Players[]>([{
        player_id: 0,
        bonus: 0,
        bps: 0,
        clean_sheets: 0,
        clearances_blocks_interceptions: 0,
        creativity: "1",
        defensive_contribution: 0,
        expected_assists: "1",
        expected_goal_involvements: "1", 
        expected_goals: "1",
        expected_goals_conceded: "1",
        gameweek: 0,
        goals_conceded: 0,
        goal_scored: 0,
        ict_index: "1",
        in_dream_team: 0,
        index: 0,
        influence: "1",
        minutes: 0,
        own_goals: 0,
        penalties_missed: 0,
        penalties_saved: 0,
        player_name: "1",
        position: "1",
        recoveries: 0,
        red_cards: 0,
        saves: 0,
        starts: 0,
        tackles: 0,
        team: "1", 
        threat: "1",
        total_points: 0,
        yellow_cards: 0,
    }]);

    const gameweekData = useCallback( async () => {
        try {
        const response = await getGameweekData(gameweek, season)
        setData(response as Players[]);
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
                        const tempDate = new Intl.DateTimeFormat('en-US', {
                            timeZone: userTimezone,
                            weekday: 'short',
                            hour: 'numeric',   
                            minute: '2-digit',
                            hour12: true 
                        }).format(new Date(item.date));

                        const homeWin: Boolean = item.homegoals > item.awaygoals ;
                        const draw: Boolean = item.homegoals == item.awaygoals;

                        return (
                            
                            <h3 key={index}>
                            <div className="h-9"> 
                            <span className="justify-between bg-gray-200">{tempDate}</span>
                            <span className={ draw ? 'bg-sky-200 px-5 font-thin' : !homeWin ? 'bg-sky-200 px-5 font-thin' : 'bg-sky-200 px-5 font-medium'}>{item.home}</span> 
                            <span className={item.finished ? 'bg-green-500' : 'bg-yellow-500'}>
                                <span className="px-2 space-x-24">{item.homegoals} 
                                  -  
                                {item.awaygoals}
                                </span>
                            </span>
                             <span className={ draw ? 'bg-sky-200 px-5 font-thin' : homeWin ? 'bg-sky-200 px-5 font-thin' : 'bg-sky-200 px-5 font-medium' }>{item.away}</span> 
                            </div>
                        </h3> 
                    )})
                }
            </div>
        );
}