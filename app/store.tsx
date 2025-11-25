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
    curSeason: '2024_2025',
  }));

export const updateSeason = (season: Season) => {
  useSeasonStore.setState({ curSeason: season });
  window.localStorage.setItem("curSeason", String(season))
};
export const updateGameweekLength = (gameweekLength: number) => useSeasonStore.setState({ gameweekLength: gameweekLength})