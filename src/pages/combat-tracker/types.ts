export type CombatantKind = 'player' | 'monster'

export type StatusTone = 'danger' | 'info' | 'neutral'

export interface StatusEffect {
  label: string
  tone: StatusTone
}

export interface Combatant {
  id: string
  name: string
  subtitle: string
  kind: CombatantKind
  initiative: number
  ac: number
  hp: number
  maxHp: number
  statuses: StatusEffect[] | null
  /** Source `players` record id ('' when not linked). */
  player: string
  /** Source `enemies` record id ('' when not linked). */
  enemy: string
}

export type NewCombatant = Omit<Combatant, 'id'>
