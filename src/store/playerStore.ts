import { create } from 'zustand'

export interface PlayerCharacter {
  id: string
  name: string
  characterClass: string
  armorClass: number
  maxHp: number
  passivePerception: number
  passiveInsight: number
  passiveInvestigation: number
}

interface PlayerStore {
  players: PlayerCharacter[]
  addPlayer: (player: Omit<PlayerCharacter, 'id'>) => void
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  players: [],
  addPlayer: (player) =>
    set((state) => ({
      players: [...state.players, { ...player, id: crypto.randomUUID() }],
    })),
}))
