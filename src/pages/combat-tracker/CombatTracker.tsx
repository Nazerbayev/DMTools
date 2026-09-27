import { useEffect } from 'react'
import {
  AlertDialog,
  Badge,
  Button,
  Callout,
  Flex,
  IconButton,
  Table,
  Text,
  TextField,
} from '@radix-ui/themes'
import {
  BookOpen,
  CircleAlert,
  FileText,
  History,
  Minus,
  PawPrint,
  Plus,
  Search,
  Settings,
  SkipBack,
  SkipForward,
  Square,
  Swords,
  Timer,
  User,
  X,
} from 'lucide-react'
import { Link } from 'wouter'
import { useCombatStore } from '../../store/combatStore'
import { AddCombatantDialog } from './AddCombatantDialog'
import type { Combatant } from './types'
import './CombatTracker.css'

const NAV_ITEMS = [
  { label: 'Encounter', icon: Swords, active: true },
  { label: 'Bestiary', icon: PawPrint, active: false },
  { label: 'Spells', icon: BookOpen, active: false },
  { label: 'Notes', icon: FileText, active: false },
]

function hpRatio(hp: number, maxHp: number) {
  return maxHp > 0 ? hp / maxHp : 0
}

function hpBarTone(
  hp: number,
  maxHp: number,
  kind: Combatant['kind'],
): 'success' | 'info' | 'danger' {
  if (hpRatio(hp, maxHp) <= 0.25) return 'danger'
  return kind === 'player' ? 'info' : 'success'
}

export function CombatTracker() {
  const combatants = useCombatStore((state) => state.combatants)
  const activeId = useCombatStore((state) => state.activeId)
  const round = useCombatStore((state) => state.round)
  const loading = useCombatStore((state) => state.loading)
  const error = useCombatStore((state) => state.error)
  const fetchCombatants = useCombatStore((state) => state.fetchCombatants)
  const setHp = useCombatStore((state) => state.setHp)
  const removeCombatant = useCombatStore((state) => state.removeCombatant)
  const endEncounter = useCombatStore((state) => state.endEncounter)
  const goToTurn = useCombatStore((state) => state.goToTurn)

  useEffect(() => {
    fetchCombatants()
  }, [fetchCombatants])

  function adjustHp(combatant: Combatant, delta: number) {
    const hp = Math.min(combatant.maxHp, Math.max(0, combatant.hp + delta))
    if (hp !== combatant.hp) setHp(combatant.id, hp)
  }

  return (
    <div className="tracker">
      <header className="tracker-topbar">
        <div className="tracker-brand">
          <Swords size={20} />
          <span>Initiative Engine</span>
        </div>

        <div className="tracker-combat-info">
          <span className="label">ACTIVE COMBAT</span>
          <span className="value">The Shadow Realm</span>
        </div>

        <div className="tracker-round-pill">
          <History size={14} />
          Round {round}
        </div>

        <TextField.Root
          className="tracker-search"
          placeholder="Search entity..."
          variant="soft"
        >
          <TextField.Slot>
            <Search size={14} />
          </TextField.Slot>
        </TextField.Root>

        <IconButton className="tracker-icon-btn" variant="ghost" aria-label="Timer">
          <Timer size={18} />
        </IconButton>
        <IconButton className="tracker-icon-btn" variant="ghost" aria-label="History">
          <History size={18} />
        </IconButton>
        <IconButton className="tracker-avatar" radius="full" aria-label="Account">
          <User size={16} />
        </IconButton>
      </header>

      <div className="tracker-body">
        <aside className="tracker-sidebar">
          <div className="tracker-campaign-card">
            <div className="tracker-campaign-portrait">
              <Swords size={18} />
            </div>
            <div>
              <div className="tracker-campaign-name">Campaign Active</div>
              <div className="tracker-campaign-subtitle">The Shadow Realm</div>
            </div>
          </div>

          <AddCombatantDialog
            trigger={
              <Button className="tracker-add-combatant" variant="soft" color="gray">
                <Plus size={14} />
                Add Combatant
              </Button>
            }
          />

          <nav className="tracker-nav">
            {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
              <div
                key={label}
                className={`tracker-nav-item${active ? ' active' : ''}`}
              >
                <Icon size={16} />
                {label.toUpperCase()}
              </div>
            ))}
          </nav>

          <div className="tracker-sidebar-spacer" />

          <div className="tracker-settings">
            <Settings size={16} />
            SETTINGS
          </div>
        </aside>

        <main className="tracker-main">
          {error && (
            <Callout.Root className="tracker-error" color="red" role="alert">
              <Callout.Icon>
                <CircleAlert size={16} />
              </Callout.Icon>
              <Callout.Text>Database error: {error}</Callout.Text>
            </Callout.Root>
          )}

          <div className="tracker-table-wrap">
            <Table.Root className="tracker-table" variant="ghost">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Init</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Combatant</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>AC</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Health</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {combatants.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="tracker-empty">
                      {loading ? (
                        'Loading combat…'
                      ) : (
                        <>
                          No combatants yet. Use <strong>Add Combatant</strong> to pull from your
                          saved <Link href="/players/new">players</Link> and{' '}
                          <Link href="/enemies/new">enemies</Link>.
                        </>
                      )}
                    </Table.Cell>
                  </Table.Row>
                )}
                {combatants.map((combatant) => {
                  const isActive = combatant.id === activeId
                  const isCritical = hpRatio(combatant.hp, combatant.maxHp) <= 0.25
                  const tone = hpBarTone(
                    combatant.hp,
                    combatant.maxHp,
                    combatant.kind,
                  )

                  return (
                    <Table.Row
                      key={combatant.id}
                      className={`tracker-row${isActive ? ' active' : ''}`}
                    >
                      <Table.Cell>
                        <span className="tracker-init">
                          {combatant.initiative}
                        </span>
                      </Table.Cell>

                      <Table.Cell>
                        <div className="tracker-combatant">
                          <div className={`tracker-portrait ${combatant.kind}`}>
                            {combatant.kind === 'player' ? (
                              <User size={16} />
                            ) : (
                              <Swords size={16} />
                            )}
                          </div>
                          <div>
                            <div className="tracker-combatant-name">
                              {combatant.name}
                            </div>
                            <div className="tracker-combatant-subtitle">
                              {combatant.subtitle}
                            </div>
                          </div>
                        </div>
                      </Table.Cell>

                      <Table.Cell>
                        <span className="tracker-ac">{combatant.ac}</span>
                      </Table.Cell>

                      <Table.Cell>
                        <div className="tracker-health">
                          <div className="tracker-health-row">
                            <IconButton
                              className="tracker-hp-btn"
                              size="1"
                              variant="soft"
                              color="gray"
                              aria-label={`Decrease HP for ${combatant.name}`}
                              onClick={() => adjustHp(combatant, -1)}
                            >
                              <Minus size={10} />
                            </IconButton>
                            <Text className={isCritical ? 'critical' : undefined}>
                              HP: {combatant.hp}/{combatant.maxHp}
                            </Text>
                            <IconButton
                              className="tracker-hp-btn"
                              size="1"
                              variant="soft"
                              color="gray"
                              aria-label={`Increase HP for ${combatant.name}`}
                              onClick={() => adjustHp(combatant, 1)}
                            >
                              <Plus size={10} />
                            </IconButton>
                          </div>
                          <div className="tracker-hp-bar">
                            <div
                              className={`tracker-hp-bar-fill ${tone}`}
                              style={{
                                width: `${hpRatio(combatant.hp, combatant.maxHp) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </Table.Cell>

                      <Table.Cell>
                        {!combatant.statuses?.length ? (
                          <span className="tracker-status-none">--</span>
                        ) : (
                          <div className="tracker-statuses">
                            {combatant.statuses.map((status) => (
                              <Badge
                                key={status.label}
                                className={`tracker-badge ${status.tone}`}
                              >
                                {status.label}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </Table.Cell>

                      <Table.Cell>
                        <IconButton
                          className="tracker-remove-btn"
                          size="1"
                          variant="ghost"
                          aria-label={`Remove ${combatant.name}`}
                          onClick={() => removeCombatant(combatant.id)}
                        >
                          <X size={14} />
                        </IconButton>
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table.Root>
          </div>

          <footer className="tracker-footer">
            <Button variant="soft" color="gray" onClick={() => goToTurn(-1)}>
              <SkipBack size={14} />
              Previous
            </Button>

            <div className="tracker-footer-secondary">
              <Button variant="soft" color="gray">
                Status Effects
              </Button>
              <Button className="tracker-next-turn" onClick={() => goToTurn(1)}>
                <SkipForward size={14} />
                Next Turn
              </Button>
              <AlertDialog.Root>
                <AlertDialog.Trigger>
                  <Button
                    className="tracker-end-encounter"
                    variant="soft"
                    color="gray"
                    disabled={combatants.length === 0}
                  >
                    <Square size={14} />
                    End Encounter
                  </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content maxWidth="420px">
                  <AlertDialog.Title>End encounter?</AlertDialog.Title>
                  <AlertDialog.Description size="2">
                    All {combatants.length} combatants will be removed from the tracker. Saved
                    players and enemies are not affected.
                  </AlertDialog.Description>
                  <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                      <Button color="red" onClick={() => endEncounter()}>
                        End Encounter
                      </Button>
                    </AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
