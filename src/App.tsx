import { Route, Switch } from 'wouter'
import { CombatTracker } from './pages/combat-tracker/CombatTracker'
import { CreateEnemy } from './pages/create-enemy/CreateEnemy'
import { CreatePlayer } from './pages/create-player/CreatePlayer'

function App() {
  return (
    <Switch>
      <Route path="/enemies/new" component={CreateEnemy} />
      <Route path="/players/new" component={CreatePlayer} />
      <Route path="/" component={CombatTracker} />
    </Switch>
  )
}

export default App
