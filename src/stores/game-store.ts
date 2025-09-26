"use client"

import { create } from "zustand"

interface GameState {
  currentRound: RoundStartEvent | null
  setCurrentRound: (round: RoundStartEvent) => void
  clearRound: () => void
}

export const useGameStore = create<GameState>((set) => ({
  currentRound: null,
  setCurrentRound: (round) => set({ currentRound: round }),
  clearRound: () => set({ currentRound: null }),
}))