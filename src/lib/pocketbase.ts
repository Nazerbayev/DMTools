import PocketBase, { type RecordService } from 'pocketbase'
import type { Combatant } from '../pages/combat-tracker/types'
import type { Enemy } from '../store/enemyStore'
import type { PlayerCharacter } from '../store/playerStore'

interface TypedPocketBase extends PocketBase {
  collection(idOrName: 'players'): RecordService<PlayerCharacter>
  collection(idOrName: 'enemies'): RecordService<Enemy>
  collection(idOrName: 'combatants'): RecordService<Combatant>
  collection(idOrName: string): RecordService
}

export const pb = new PocketBase(
  import.meta.env.VITE_POCKETBASE_URL ?? 'http://127.0.0.1:8090',
) as TypedPocketBase

// Stores fetch on mount; don't let React StrictMode's double-mount cancel the first request.
pb.autoCancellation(false)
