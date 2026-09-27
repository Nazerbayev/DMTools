import { useState, type FormEvent } from 'react'
import { Button, Callout, Heading, Text, TextField } from '@radix-ui/themes'
import { ArrowLeft, CircleAlert, Save, User } from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { usePlayerStore } from '../../store/playerStore'
import './CreatePlayer.css'

export function CreatePlayer() {
  const addPlayer = usePlayerStore((state) => state.addPlayer)
  const [, navigate] = useLocation()

  const [name, setName] = useState('')
  const [characterClass, setCharacterClass] = useState('')
  const [armorClass, setArmorClass] = useState('10')
  const [maxHp, setMaxHp] = useState('10')
  const [passivePerception, setPassivePerception] = useState('10')
  const [passiveInsight, setPassiveInsight] = useState('10')
  const [passiveInvestigation, setPassiveInvestigation] = useState('10')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) return

    setSaving(true)
    setError(null)
    try {
      await addPlayer({
        name: name.trim(),
        characterClass: characterClass.trim(),
        armorClass: Number(armorClass) || 0,
        maxHp: Number(maxHp) || 0,
        passivePerception: Number(passivePerception) || 0,
        passiveInsight: Number(passiveInsight) || 0,
        passiveInvestigation: Number(passiveInvestigation) || 0,
      })
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setSaving(false)
    }
  }

  return (
    <div className="create-player">
      <header className="create-player-topbar">
        <Link href="/" className="create-player-back">
          <ArrowLeft size={16} />
          Back
        </Link>
        <div className="create-player-brand">
          <User size={18} />
          <span>Create Player Character</span>
        </div>
      </header>

      <form className="create-player-form" onSubmit={handleSubmit}>
        <section className="create-player-section">
          <Heading size="3" as="h3">
            Identity
          </Heading>
          <div className="create-player-grid two">
            <label className="create-player-field">
              <Text as="div" size="1" weight="medium" className="create-player-label">
                Name
              </Text>
              <TextField.Root
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Elara Swiftwind"
                required
              />
            </label>

            <label className="create-player-field">
              <Text as="div" size="1" weight="medium" className="create-player-label">
                Class
              </Text>
              <TextField.Root
                value={characterClass}
                onChange={(event) => setCharacterClass(event.target.value)}
                placeholder="Ranger"
              />
            </label>
          </div>
        </section>

        <section className="create-player-section">
          <Heading size="3" as="h3">
            Combat Stats
          </Heading>
          <div className="create-player-grid two">
            <label className="create-player-field">
              <Text as="div" size="1" weight="medium" className="create-player-label">
                Armor Class
              </Text>
              <TextField.Root
                type="number"
                value={armorClass}
                onChange={(event) => setArmorClass(event.target.value)}
              />
            </label>

            <label className="create-player-field">
              <Text as="div" size="1" weight="medium" className="create-player-label">
                Max HP
              </Text>
              <TextField.Root
                type="number"
                value={maxHp}
                onChange={(event) => setMaxHp(event.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="create-player-section">
          <Heading size="3" as="h3">
            Passive Scores
          </Heading>
          <div className="create-player-grid three">
            <label className="create-player-field">
              <Text as="div" size="1" weight="medium" className="create-player-label">
                Passive Perception
              </Text>
              <TextField.Root
                type="number"
                value={passivePerception}
                onChange={(event) => setPassivePerception(event.target.value)}
              />
            </label>

            <label className="create-player-field">
              <Text as="div" size="1" weight="medium" className="create-player-label">
                Passive Insight
              </Text>
              <TextField.Root
                type="number"
                value={passiveInsight}
                onChange={(event) => setPassiveInsight(event.target.value)}
              />
            </label>

            <label className="create-player-field">
              <Text as="div" size="1" weight="medium" className="create-player-label">
                Passive Investigation
              </Text>
              <TextField.Root
                type="number"
                value={passiveInvestigation}
                onChange={(event) => setPassiveInvestigation(event.target.value)}
              />
            </label>
          </div>
        </section>

        {error && (
          <Callout.Root color="red" role="alert">
            <Callout.Icon>
              <CircleAlert size={16} />
            </Callout.Icon>
            <Callout.Text>Could not save player: {error}</Callout.Text>
          </Callout.Root>
        )}

        <footer className="create-player-footer">
          <Button type="button" variant="soft" color="gray" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button type="submit" className="create-player-save" loading={saving}>
            <Save size={14} />
            Save Character
          </Button>
        </footer>
      </form>
    </div>
  )
}
