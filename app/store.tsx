import { create } from 'zustand'
import type { Season } from './types'
import { useEffect } from 'react'

type State = {
    curSeason: Season
    curGameweek: number
    curTeam: string|null
    gameweekLength: number
  }
  
export const useAppStore = create<State>((set) => ({

    gameweekLength: 38,
    curGameweek: 1,
    curTeam: null,
    curSeason: '2025_2026',
  }));

export const updateSeason = (season: Season) => {
  useAppStore.setState({ curSeason: season });
};
export const updateGameweek = (gameweek: number) => {
  useAppStore.setState({ curGameweek: gameweek });
};
export const updateGameweekLength = (gameweekLength: number) => useAppStore.setState({ gameweekLength: gameweekLength})