import { create } from 'zustand'
import type { Season } from './types'
import { useEffect } from 'react'

type State = {
    curSeason: Season
    curGameweek: number
    curTeam: string|null
    gameweekLength: number
    summary: boolean
  }
  
export const useSeasonStore = create((set) => ({

    gameweekLength: 38,
    curGameweek: 1,
    curTeam: null,
    curSeason: '2025_2026',
    summary: false,
    toggleSummary: () => set((state: State) => ({ summary: !state.summary })),
  }));

export const updateSeason = (season: Season) => {
  useSeasonStore.setState({ curSeason: season });
};
export const updateGameweekLength = (gameweekLength: number) => useSeasonStore.setState({ gameweekLength: gameweekLength})
export const updateGameweek = (gameweek: number) => useSeasonStore.setState({ gameweek: gameweek})
