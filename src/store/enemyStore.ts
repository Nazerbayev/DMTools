import { create } from 'zustand'

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
  addEnemy: (enemy: Omit<Enemy, 'id'>) => void
}

export const useEnemyStore = create<EnemyStore>((set) => ({
  enemies: [],
  addEnemy: (enemy) =>
    set((state) => ({
      enemies: [...state.enemies, { ...enemy, id: crypto.randomUUID() }],
    })),
}))
