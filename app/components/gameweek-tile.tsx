






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



  } from "~/components/ui/carousel";



import { useIsMobile } from "~/components/ui/use-mobile";



import { teamAbbreviations } from "~/lib/team-abbreviations";







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



    },  [season, gameweek]);







    



    if (!data) {



        return



      }



    return (


        <div className="gameweek-tile">
            <h3>Fixtures</h3>
        <div className="fixture-tile">
        <FixtureTile key={gameweek+1} gameweek={gameweek} season={season}></FixtureTile>
        </div> 
        <h3>Players</h3>
        <DataTable columns={columns} data={data} />
        </div> 



    );



}







export function FixtureTile({gameweek, season}: gameweekTileProps) {



    const isMobile = useIsMobile();



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



        const response = await getFixturesData(gameweek, season)



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



        <div className="px-2 md:px-12 justify-between fixture-tile">



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


                            <div key={index} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[var(--surface-2)] border border-[rgba(255,215,0,0.08)] hover:border-[rgba(255,215,0,0.25)] transition-all duration-200 text-[var(--text-primary)]">

                                {/* Date */}
                                <span className="text-[0.6rem] text-[var(--text-secondary)] w-10 shrink-0">
                                {tempDate}
                                </span>

                                {/* Home Team */}
                                <span className={`text-xs truncate text-right w-20 shrink-0 ${
                                draw ? 'font-normal opacity-60' : homeWin ? 'font-bold text-[var(--gold)]' : 'font-normal opacity-60'
                                }`}>
                                {isMobile ? teamAbbreviations[item.home] || item.home.substring(0, 3).toUpperCase() : item.home}
                                </span>

                                {/* Score */}
                                <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded shrink-0 ${
                                item.finished ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                }`}>
                                {item.homegoals} – {item.awaygoals}
                                </span>

                                {/* Away Team */}
                                <span className={`text-xs truncate text-left w-20 shrink-0 ${
                                draw ? 'font-normal opacity-60' : !homeWin ? 'font-bold text-[var(--gold)]' : 'font-normal opacity-60'
                                }`}>
                                {isMobile ? teamAbbreviations[item.away] || item.away.substring(0, 3).toUpperCase() : item.away}
                                </span>

                                {/* Status pip */}
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.finished ? 'bg-emerald-400' : 'bg-amber-400'}`} />

</div>



                    )})



                }



            </div>



        );



}




