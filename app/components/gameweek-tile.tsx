import { getFixturesData, getGameweekData } from "~/data";
import { type Fixtures, type Players, type Season } from "~/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { buildColumns, DataTable } from "./data-table";
import { useIsMobile } from "~/components/ui/use-mobile";
import { teamAbbreviations } from "~/lib/team-abbreviations";
import { PlayerChartsDashboard } from "./player-dashboard";
import { TeamChartsDashboard } from "./team-dashboard";
import { TopPerformers } from "./top-performers";

interface gameweekTileProps {
    gameweek: number,
    season: Season
}

export type TeamFixture = {
    opponent: string;
    isHome: boolean;
    finished: boolean;
};

export function buildTeamFixtureMap(fixtures: Fixtures[] | undefined): Map<string, TeamFixture> {
    const map = new Map<string, TeamFixture>();
    if (!fixtures) return map;
    for (const f of fixtures) {
        map.set(f.home, { opponent: f.away, isHome: true, finished: f.finished });
        map.set(f.away, { opponent: f.home, isHome: false, finished: f.finished });
    }
    return map;
}

export function GameweekTile({ gameweek, season }: gameweekTileProps) {
    const [data, setData] = useState<Players[]>([]);
    const [fixtures, setFixtures] = useState<Fixtures[] | undefined>();

    const gameweekData = useCallback(async () => {
        try {
            const response = await getGameweekData(gameweek, season);
            setData(response as Players[]);
        } catch (e) {
            console.log(e);
            throw new Error("Error fetching data");
        }
    }, [gameweek, season]);

    const fixtureData = useCallback(async () => {
        try {
            const response = await getFixturesData(gameweek, season);
            setFixtures(response as Fixtures[]);
        } catch (e) {
            console.log(e);
            setFixtures(undefined);
        }
    }, [gameweek, season]);

    useEffect(() => {
        gameweekData();
        fixtureData();
    }, [season, gameweek]);

    const teamFixtures = useMemo(() => buildTeamFixtureMap(fixtures), [fixtures]);
    const columns = useMemo(() => buildColumns(teamFixtures), [teamFixtures]);

    if (!data) {
        return;
    }

    return (
        <>
            <div className="gameweek-tile w-full max-w-full">
                <div className="fixture-tile-wrapper">
                    <FixtureTile fixtures={fixtures} />
                </div>
                <TopPerformers data={data} />
                <DataTable columns={columns} data={data} />
            </div>

            {data && <div className="w-full max-w-full overflow-x-hidden">
                <PlayerChartsDashboard data={data} />
                <TeamChartsDashboard data={data} />
            </div>}
        </>
    );
}

interface FixtureTileProps {
    fixtures: Fixtures[] | undefined;
}

export function FixtureTile({ fixtures }: FixtureTileProps) {
    const isMobile = useIsMobile();

    if (!fixtures) {
        return null;
    }

    return (
        <div className="px-2 md:px-12 justify-between fixture-tile">
            {fixtures
                .slice()
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((item, index) => {
                    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    const tempDate = new Intl.DateTimeFormat('en-UK', {
                        timeZone: userTimezone,
                        weekday: 'short',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: false,
                    }).format(new Date(item.date));

                    const homeWin: boolean = item.homegoals > item.awaygoals;
                    const draw: boolean = item.homegoals === item.awaygoals;

                    return (
                        <div key={index} className="flex items-center justify-between gap-2 px-3 py-2 rounded-none bg-surface-2 border border-gold-subtle hover:border-gold-muted transition-all duration-200 text-text-primary">
                            <span className="text-[0.6rem] font-mono font-normal text-text-secondary w-10 shrink-0">
                                {tempDate}
                            </span>

                            <span className={`text-xs font-mono truncate text-right w-20 shrink-0 ${
                                draw ? 'font-normal opacity-60' : homeWin ? 'font-semibold text-gold' : 'font-normal opacity-60'
                            }`}>
                                {isMobile ? teamAbbreviations[item.home] || item.home.substring(0, 3).toUpperCase() : item.home}
                            </span>

                            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded shrink-0 ${
                                item.finished ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                                {item.homegoals} – {item.awaygoals}
                            </span>

                            <span className={`text-xs font-mono truncate text-left w-20 shrink-0 ${
                                draw ? 'font-normal opacity-60' : !homeWin ? 'font-semibold text-gold' : 'font-normal opacity-60'
                            }`}>
                                {isMobile ? teamAbbreviations[item.away] || item.away.substring(0, 3).toUpperCase() : item.away}
                            </span>

                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.finished ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        </div>
                    );
                })}
        </div>
    );
}
