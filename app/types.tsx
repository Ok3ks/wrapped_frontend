export type Players = {
    player_id: number,
    bonus: number,
    bps: number,
    clean_sheets: number
    clearances_blocks_interceptions: number,
    creativity: string, ///
    defensive_contribution: number,
    expected_assists: string, ///
    expected_goal_involvements: string, ///
    expected_goals: string, ///
    expected_goals_conceded: string, ///
    gameweek: number,
    goals_conceded: number,
    goal_scored: number,
    ict_index: string, ///
    in_dream_team: number,
    index: number,
    influence: string, ///
    minutes: number,
    own_goals: number,
    penalties_missed: number,
    penalties_saved: number,
    player_name: string,
    position: string,
    recoveries: number,
    red_cards: number,
    saves: number,
    starts: number,
    tackles: number,
    team: string, 
    threat: string, ///
    total_points: number,
    yellow_cards: number,
}


export type Season = "2024_2025" | "2025_2026";

export type Position = "GK" | "DEF" | "MID" | "FWD" | "ALL";
export type Fixtures = {
    homedifficulty: string,
    awaydifficulty: string,
    home: string,
    away: string,
    gameweek: number,
    season: Season,
    draw: boolean,
    date: Date,
    homegoals: number,
    awaygoals: number,
    finished: boolean;
};

