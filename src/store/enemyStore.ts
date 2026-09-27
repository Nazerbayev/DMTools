import { create } from 'zustand'
import { pb } from '../lib/pocketbase'

export type EnemySize = 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan'

export interface AbilityScores {
  str: number
  dex: number
  con: number
  int: number
  wis: number
  cha: number
}

export interface Enemy {
  id: string
  name: string
  size: EnemySize
  type: string
  alignment: string
  armorClass: number
  hitPoints: number
  speed: string
  challengeRating: string
  abilityScores: AbilityScores
  traits: string
}

interface EnemyStore {
  enemies: Enemy[]
  fetchEnemies: () => Promise<void>
  addEnemy: (enemy: Omit<Enemy, 'id'>) => Promise<Enemy>
}

export const useEnemyStore = create<EnemyStore>((set) => ({
  enemies: [],
  fetchEnemies: async () => {
    const enemies = await pb.collection('enemies').getFullList({ sort: 'name' })
    set({ enemies })
  },
  addEnemy: async (enemy) => {
    const created = await pb.collection('enemies').create(enemy)
    set((state) => ({ enemies: [...state.enemies, created] }))
    return created
  },
}))
