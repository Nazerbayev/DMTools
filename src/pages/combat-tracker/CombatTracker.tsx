import { useState } from 'react'
import {
  Badge,
  Button,
  IconButton,
  Table,
  Text,
  TextField,
} from '@radix-ui/themes'
import {
  BookOpen,
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
} from 'lucide-react'
import type { Combatant } from './types'
import './CombatTracker.css'

const INITIAL_COMBATANTS: Combatant[] = [
  {
    id: 'shadow-demon',
    name: 'Shadow Demon (Elite)',
    subtitle: 'FIEND, MEDIUM',
    kind: 'monster',
    initiative: 22,
    ac: 17,
    hp: 112,
    maxHp: 120,
    statuses: [
      { label: 'Raged', tone: 'danger' },
      { label: 'Hasted', tone: 'info' },
    ],
  },
  {
    id: 'elara-swiftwind',
    name: 'Elara Swiftwind',
    subtitle: 'PLAYER (RANGER)',
    kind: 'player',
    initiative: 18,
    ac: 16,
    hp: 45,
    maxHp: 65,
    statuses: [],
  },
  {
    id: 'cultist-a',
    name: 'Cultist Initiate A',
    subtitle: 'HUMANOID, MEDIUM',
    kind: 'monster',
    initiative: 12,
    ac: 12,
    hp: 4,
    maxHp: 18,
    statuses: [{ label: 'Prone', tone: 'neutral' }],
  },
]

const NAV_ITEMS = [
  { label: 'Encounter', icon: Swords, active: true },
  { label: 'Bestiary', icon: PawPrint, active: false },
  { label: 'Spells', icon: BookOpen, active: false },
  { label: 'Notes', icon: FileText, active: false },
]

function hpBarTone(
  hp: number,
  maxHp: number,
  kind: Combatant['kind'],
): 'success' | 'info' | 'danger' {
  if (hp / maxHp <= 0.25) return 'danger'
  return kind === 'player' ? 'info' : 'success'
}

export function CombatTracker() {
  const [combatants, setCombatants] = useState(INITIAL_COMBATANTS)
  const [activeId, setActiveId] = useState(combatants[0].id)
  const [round, setRound] = useState(3)

  const activeIndex = combatants.findIndex((c) => c.id === activeId)

  function goToTurn(offset: number) {
    const nextIndex = activeIndex + offset
    if (nextIndex >= combatants.length) {
      setRound((r) => r + 1)
      setActiveId(combatants[0].id)
    } else if (nextIndex < 0) {
      setRound((r) => Math.max(1, r - 1))
      setActiveId(combatants[combatants.length - 1].id)
    } else {
      setActiveId(combatants[nextIndex].id)
    }
  }

  function adjustHp(id: string, delta: number) {
    setCombatants((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, hp: Math.min(c.maxHp, Math.max(0, c.hp + delta)) }
          : c,
      ),
    )
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

          <Button className="tracker-add-combatant" variant="soft" color="gray">
            <Plus size={14} />
            Add Combatant
          </Button>

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
          <div className="tracker-table-wrap">
            <Table.Root className="tracker-table" variant="ghost">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Init</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Combatant</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>AC</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Health</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {combatants.map((combatant) => {
                  const isActive = combatant.id === activeId
                  const isCritical = combatant.hp / combatant.maxHp <= 0.25
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
                              onClick={() => adjustHp(combatant.id, -1)}
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
                              onClick={() => adjustHp(combatant.id, 1)}
                            >
                              <Plus size={10} />
                            </IconButton>
                          </div>
                          <div className="tracker-hp-bar">
                            <div
                              className={`tracker-hp-bar-fill ${tone}`}
                              style={{
                                width: `${(combatant.hp / combatant.maxHp) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </Table.Cell>

                      <Table.Cell>
                        {combatant.statuses.length === 0 ? (
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
              <Button className="tracker-end-encounter" variant="soft" color="gray">
                <Square size={14} />
                End Encounter
              </Button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
