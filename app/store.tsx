import { create } from 'zustand'
import type { Season } from './types'
import { useEffect } from 'react'

type State = {
    curSeason: Season
    curGameweek: number
    curTeam: string|null
    gameweekLength: number
  }
  
export const useSeasonStore = create<State>((set) => ({

    gameweekLength: 38,
    curGameweek: 1,
    curTeam: null,
    curSeason: '2025_2026',
  }));

export const updateSeason = (season: Season) => {
  useSeasonStore.setState({ curSeason: season });
};
export const updateGameweekLength = (gameweekLength: number) => useSeasonStore.setState({ gameweekLength: gameweekLength})