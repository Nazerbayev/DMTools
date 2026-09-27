import { useEffect, useState, type ReactNode } from 'react'
import { Button, Callout, Dialog, Tabs, Text, TextField } from '@radix-ui/themes'
import { CircleAlert, Dices, Plus } from 'lucide-react'
import { Link } from 'wouter'
import { useCombatStore } from '../../store/combatStore'
import { useEnemyStore, type Enemy } from '../../store/enemyStore'
import { usePlayerStore, type PlayerCharacter } from '../../store/playerStore'
import type { NewCombatant } from './types'

function rollInitiative(dex: number) {
  return Math.floor(Math.random() * 20) + 1 + Math.floor((dex - 10) / 2)
}

function playerCombatant(player: PlayerCharacter, initiative: number): NewCombatant {
  return {
    name: player.name,
    subtitle: player.characterClass ? `PLAYER (${player.characterClass.toUpperCase()})` : 'PLAYER',
    kind: 'player',
    initiative,
    ac: player.armorClass,
    hp: player.maxHp,
    maxHp: player.maxHp,
    statuses: [],
    player: player.id,
    enemy: '',
  }
}

function enemyCombatant(enemy: Enemy, name: string, initiative: number): NewCombatant {
  return {
    name,
    subtitle: [enemy.type, enemy.size].filter(Boolean).join(', ').toUpperCase(),
    kind: 'monster',
    initiative,
    ac: enemy.armorClass,
    hp: enemy.hitPoints,
    maxHp: enemy.hitPoints,
    statuses: [],
    player: '',
    enemy: enemy.id,
  }
}

interface AddCombatantDialogProps {
  trigger: ReactNode
}

export function AddCombatantDialog({ trigger }: AddCombatantDialogProps) {
  const [open, setOpen] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const players = usePlayerStore((state) => state.players)
  const fetchPlayers = usePlayerStore((state) => state.fetchPlayers)
  const enemies = useEnemyStore((state) => state.enemies)
  const fetchEnemies = useEnemyStore((state) => state.fetchEnemies)

  useEffect(() => {
    if (!open) return
    setLoadError(null)
    Promise.all([fetchPlayers(), fetchEnemies()]).catch((err) =>
      setLoadError(err instanceof Error ? err.message : String(err)),
    )
  }, [open, fetchPlayers, fetchEnemies])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Content maxWidth="560px">
        <Dialog.Title>Add Combatant</Dialog.Title>
        <Dialog.Description size="2" color="gray" mb="3">
          Pick saved players and enemies to join the combat.
        </Dialog.Description>

        {loadError && (
          <Callout.Root color="red" role="alert" mb="3">
            <Callout.Icon>
              <CircleAlert size={16} />
            </Callout.Icon>
            <Callout.Text>Could not load library: {loadError}</Callout.Text>
          </Callout.Root>
        )}

        <Tabs.Root defaultValue="players">
          <Tabs.List>
            <Tabs.Trigger value="players">Players ({players.length})</Tabs.Trigger>
            <Tabs.Trigger value="enemies">Enemies ({enemies.length})</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="players" className="add-combatant-list">
            {players.length === 0 ? (
              <EmptyLibrary href="/players/new" label="Create a player" />
            ) : (
              players.map((player) => <PlayerRow key={player.id} player={player} />)
            )}
          </Tabs.Content>

          <Tabs.Content value="enemies" className="add-combatant-list">
            {enemies.length === 0 ? (
              <EmptyLibrary href="/enemies/new" label="Create an enemy" />
            ) : (
              enemies.map((enemy) => <EnemyRow key={enemy.id} enemy={enemy} />)
            )}
          </Tabs.Content>
        </Tabs.Root>

        <div className="add-combatant-footer">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Done
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

function EmptyLibrary({ href, label }: { href: string; label: string }) {
  return (
    <Text as="p" size="2" color="gray" className="add-combatant-empty">
      Nothing saved yet. <Link href={href}>{label}</Link>
    </Text>
  )
}

function useAddAction() {
  const addCombatants = useCombatStore((state) => state.addCombatants)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function add(combatants: NewCombatant[]) {
    setSaving(true)
    setError(null)
    try {
      await addCombatants(combatants)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      return false
    } finally {
      setSaving(false)
    }
  }

  return { add, saving, error }
}

function PlayerRow({ player }: { player: PlayerCharacter }) {
  const [initiative, setInitiative] = useState('')
  const { add, saving, error } = useAddAction()
  const inCombat = useCombatStore((state) =>
    state.combatants.some((c) => c.player === player.id),
  )

  async function handleAdd() {
    if (await add([playerCombatant(player, Number(initiative) || 0)])) setInitiative('')
  }

  return (
    <div className="add-combatant-row">
      <div className="add-combatant-info">
        <Text as="div" size="2" weight="medium">
          {player.name}
        </Text>
        <Text as="div" size="1" color="gray">
          {player.characterClass || 'Player'} · AC {player.armorClass} · HP {player.maxHp}
          {inCombat && ' · in combat'}
        </Text>
        {error && (
          <Text as="div" size="1" color="red">
            {error}
          </Text>
        )}
      </div>
      <TextField.Root
        className="add-combatant-init"
        type="number"
        placeholder="Init"
        aria-label={`Initiative for ${player.name}`}
        value={initiative}
        onChange={(event) => setInitiative(event.target.value)}
      />
      <Button onClick={handleAdd} loading={saving} disabled={initiative === ''}>
        <Plus size={14} />
        Add
      </Button>
    </div>
  )
}

function EnemyRow({ enemy }: { enemy: Enemy }) {
  const [initiative, setInitiative] = useState('')
  const [quantity, setQuantity] = useState('1')
  const { add, saving, error } = useAddAction()
  const alreadyInCombat = useCombatStore(
    (state) => state.combatants.filter((c) => c.enemy === enemy.id).length,
  )

  async function handleAdd() {
    const count = Math.max(1, Number(quantity) || 1)
    const numbered = count > 1 || alreadyInCombat > 0
    const combatants = Array.from({ length: count }, (_, i) =>
      enemyCombatant(
        enemy,
        numbered ? `${enemy.name} ${alreadyInCombat + i + 1}` : enemy.name,
        // A typed initiative applies to the whole group; blank rolls each one separately.
        initiative === '' ? rollInitiative(enemy.abilityScores?.dex ?? 10) : Number(initiative),
      ),
    )
    if (await add(combatants)) {
      setInitiative('')
      setQuantity('1')
    }
  }

  return (
    <div className="add-combatant-row">
      <div className="add-combatant-info">
        <Text as="div" size="2" weight="medium">
          {enemy.name}
        </Text>
        <Text as="div" size="1" color="gray">
          CR {enemy.challengeRating || '?'} · AC {enemy.armorClass} · HP {enemy.hitPoints}
          {alreadyInCombat > 0 && ` · ${alreadyInCombat} in combat`}
        </Text>
        {error && (
          <Text as="div" size="1" color="red">
            {error}
          </Text>
        )}
      </div>
      <TextField.Root
        className="add-combatant-qty"
        type="number"
        min={1}
        aria-label={`Quantity of ${enemy.name}`}
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
      >
        <TextField.Slot>×</TextField.Slot>
      </TextField.Root>
      <TextField.Root
        className="add-combatant-init"
        type="number"
        placeholder="Roll"
        aria-label={`Initiative for ${enemy.name} (blank to roll)`}
        value={initiative}
        onChange={(event) => setInitiative(event.target.value)}
      >
        {initiative === '' && (
          <TextField.Slot side="right">
            <Dices size={14} />
          </TextField.Slot>
        )}
      </TextField.Root>
      <Button onClick={handleAdd} loading={saving}>
        <Plus size={14} />
        Add
      </Button>
    </div>
  )
}
