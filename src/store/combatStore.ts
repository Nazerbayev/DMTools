import { create } from 'zustand'
import { pb } from '../lib/pocketbase'
import type { Combatant, NewCombatant } from '../pages/combat-tracker/types'

interface CombatStore {
  combatants: Combatant[]
  activeId: string | null
  round: number
  loading: boolean
  error: string | null
  fetchCombatants: () => Promise<void>
  addCombatants: (combatants: NewCombatant[]) => Promise<void>
  setHp: (id: string, hp: number) => Promise<void>
  removeCombatant: (id: string) => Promise<void>
  endEncounter: () => Promise<void>
  goToTurn: (offset: 1 | -1) => void
}

function byInitiative(a: Combatant, b: Combatant) {
  return b.initiative - a.initiative
}

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : String(err)
}

export const useCombatStore = create<CombatStore>((set, get) => ({
  combatants: [],
  activeId: null,
  round: 1,
  loading: false,
  error: null,

  fetchCombatants: async () => {
    set({ loading: true, error: null })
    try {
      const combatants = await pb
        .collection('combatants')
        .getFullList({ sort: '-initiative,created' })
      set((state) => ({
        combatants,
        activeId: combatants.some((c) => c.id === state.activeId)
          ? state.activeId
          : (combatants[0]?.id ?? null),
      }))
    } catch (err) {
      set({ error: errorMessage(err) })
    } finally {
      set({ loading: false })
    }
  },

  addCombatants: async (newCombatants) => {
    const created = await Promise.all(
      newCombatants.map((c) => pb.collection('combatants').create(c)),
    )
    set((state) => {
      const combatants = [...state.combatants, ...created].sort(byInitiative)
      return { combatants, activeId: state.activeId ?? combatants[0]?.id ?? null }
    })
  },

  setHp: async (id, hp) => {
    // Optimistic: HP buttons get clicked rapidly, so update locally first.
    set((state) => ({
      combatants: state.combatants.map((c) => (c.id === id ? { ...c, hp } : c)),
    }))
    try {
      await pb.collection('combatants').update(id, { hp })
    } catch (err) {
      set({ error: errorMessage(err) })
      await get().fetchCombatants()
    }
  },

  removeCombatant: async (id) => {
    try {
      await pb.collection('combatants').delete(id)
    } catch (err) {
      set({ error: errorMessage(err) })
      return
    }
    set((state) => {
      const index = state.combatants.findIndex((c) => c.id === id)
      const combatants = state.combatants.filter((c) => c.id !== id)
      let activeId = state.activeId
      if (activeId === id) {
        // Hand the turn to whoever was next in order.
        activeId = combatants.length ? combatants[index % combatants.length].id : null
      }
      return { combatants, activeId }
    })
  },

  endEncounter: async () => {
    try {
      await Promise.all(get().combatants.map((c) => pb.collection('combatants').delete(c.id)))
      set({ combatants: [], activeId: null, round: 1, error: null })
    } catch (err) {
      set({ error: errorMessage(err) })
      await get().fetchCombatants()
    }
  },

  goToTurn: (offset) => {
    const { combatants, activeId } = get()
    if (combatants.length === 0) return
    const nextIndex = combatants.findIndex((c) => c.id === activeId) + offset
    if (nextIndex >= combatants.length) {
      set((state) => ({ round: state.round + 1, activeId: combatants[0].id }))
    } else if (nextIndex < 0) {
      set((state) => ({
        round: Math.max(1, state.round - 1),
        activeId: combatants[combatants.length - 1].id,
      }))
    } else {
      set({ activeId: combatants[nextIndex].id })
    }
  },
}))
