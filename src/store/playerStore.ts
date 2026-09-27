import { create } from 'zustand'
import { pb } from '../lib/pocketbase'

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
  fetchPlayers: () => Promise<void>
  addPlayer: (player: Omit<PlayerCharacter, 'id'>) => Promise<PlayerCharacter>
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  players: [],
  fetchPlayers: async () => {
    const players = await pb.collection('players').getFullList({ sort: 'name' })
    set({ players })
  },
  addPlayer: async (player) => {
    const created = await pb.collection('players').create(player)
    set((state) => ({ players: [...state.players, created] }))
    return created
  },
}))
