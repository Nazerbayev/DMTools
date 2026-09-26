import { useState, type FormEvent } from 'react'
import { Button, Heading, Select, Text, TextArea, TextField } from '@radix-ui/themes'
import { ArrowLeft, Save, Swords } from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { useEnemyStore, type AbilityScores, type EnemySize } from '../../store/enemyStore'
import './CreateEnemy.css'

const SIZES: EnemySize[] = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan']

const ABILITY_LABELS: { key: keyof AbilityScores; label: string }[] = [
  { key: 'str', label: 'STR' },
  { key: 'dex', label: 'DEX' },
  { key: 'con', label: 'CON' },
  { key: 'int', label: 'INT' },
  { key: 'wis', label: 'WIS' },
  { key: 'cha', label: 'CHA' },
]

const DEFAULT_ABILITIES: AbilityScores = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }

export function CreateEnemy() {
  const addEnemy = useEnemyStore((state) => state.addEnemy)
  const [, navigate] = useLocation()

  const [name, setName] = useState('')
  const [size, setSize] = useState<EnemySize>('Medium')
  const [type, setType] = useState('')
  const [alignment, setAlignment] = useState('')
  const [armorClass, setArmorClass] = useState('10')
  const [hitPoints, setHitPoints] = useState('10')
  const [speed, setSpeed] = useState('30 ft.')
  const [challengeRating, setChallengeRating] = useState('1')
  const [traits, setTraits] = useState('')
  const [abilityScores, setAbilityScores] = useState<AbilityScores>(DEFAULT_ABILITIES)

  function updateAbility(key: keyof AbilityScores, value: string) {
    const parsed = Number(value)
    setAbilityScores((prev) => ({ ...prev, [key]: Number.isNaN(parsed) ? 0 : parsed }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) return

    addEnemy({
      name: name.trim(),
      size,
      type: type.trim(),
      alignment: alignment.trim(),
      armorClass: Number(armorClass) || 0,
      hitPoints: Number(hitPoints) || 0,
      speed: speed.trim(),
      challengeRating: challengeRating.trim(),
      abilityScores,
      traits: traits.trim(),
    })

    navigate('/')
  }

  return (
    <div className="create-enemy">
      <header className="create-enemy-topbar">
        <Link href="/" className="create-enemy-back">
          <ArrowLeft size={16} />
          Back
        </Link>
        <div className="create-enemy-brand">
          <Swords size={18} />
          <span>Create New Enemy</span>
        </div>
      </header>

      <form className="create-enemy-form" onSubmit={handleSubmit}>
        <section className="create-enemy-section">
          <Heading size="3" as="h3">Identity</Heading>
          <div className="create-enemy-grid two">
            <label className="create-enemy-field">
              <Text as="div" size="1" weight="medium" className="create-enemy-label">
                Name
              </Text>
              <TextField.Root
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Shadow Demon"
                required
              />
            </label>

            <label className="create-enemy-field">
              <Text as="div" size="1" weight="medium" className="create-enemy-label">
                Size
              </Text>
              <Select.Root value={size} onValueChange={(value) => setSize(value as EnemySize)}>
                <Select.Trigger />
                <Select.Content>
                  {SIZES.map((s) => (
                    <Select.Item key={s} value={s}>
                      {s}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </label>

            <label className="create-enemy-field">
              <Text as="div" size="1" weight="medium" className="create-enemy-label">
                Type
              </Text>
              <TextField.Root
                value={type}
                onChange={(event) => setType(event.target.value)}
                placeholder="Fiend"
              />
            </label>

            <label className="create-enemy-field">
              <Text as="div" size="1" weight="medium" className="create-enemy-label">
                Alignment
              </Text>
              <TextField.Root
                value={alignment}
                onChange={(event) => setAlignment(event.target.value)}
                placeholder="Chaotic Evil"
              />
            </label>
          </div>
        </section>

        <section className="create-enemy-section">
          <Heading size="3" as="h3">Combat Stats</Heading>
          <div className="create-enemy-grid three">
            <label className="create-enemy-field">
              <Text as="div" size="1" weight="medium" className="create-enemy-label">
                Armor Class
              </Text>
              <TextField.Root
                type="number"
                value={armorClass}
                onChange={(event) => setArmorClass(event.target.value)}
              />
            </label>

            <label className="create-enemy-field">
              <Text as="div" size="1" weight="medium" className="create-enemy-label">
                Hit Points
              </Text>
              <TextField.Root
                type="number"
                value={hitPoints}
                onChange={(event) => setHitPoints(event.target.value)}
              />
            </label>

            <label className="create-enemy-field">
              <Text as="div" size="1" weight="medium" className="create-enemy-label">
                Speed
              </Text>
              <TextField.Root
                value={speed}
                onChange={(event) => setSpeed(event.target.value)}
                placeholder="30 ft., fly 60 ft."
              />
            </label>

            <label className="create-enemy-field">
              <Text as="div" size="1" weight="medium" className="create-enemy-label">
                Challenge Rating
              </Text>
              <TextField.Root
                value={challengeRating}
                onChange={(event) => setChallengeRating(event.target.value)}
                placeholder="5"
              />
            </label>
          </div>
        </section>

        <section className="create-enemy-section">
          <Heading size="3" as="h3">Ability Scores</Heading>
          <div className="create-enemy-grid six">
            {ABILITY_LABELS.map(({ key, label }) => (
              <label key={key} className="create-enemy-field">
                <Text as="div" size="1" weight="medium" className="create-enemy-label">
                  {label}
                </Text>
                <TextField.Root
                  type="number"
                  value={abilityScores[key]}
                  onChange={(event) => updateAbility(key, event.target.value)}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="create-enemy-section">
          <Heading size="3" as="h3">Traits &amp; Actions</Heading>
          <TextArea
            value={traits}
            onChange={(event) => setTraits(event.target.value)}
            placeholder="Describe special traits, actions, and reactions..."
            rows={6}
          />
        </section>

        <footer className="create-enemy-footer">
          <Button type="button" variant="soft" color="gray" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button type="submit" className="create-enemy-save">
            <Save size={14} />
            Save Enemy
          </Button>
        </footer>
      </form>
    </div>
  )
}
