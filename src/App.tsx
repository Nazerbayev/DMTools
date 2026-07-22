import { Route, Switch } from "wouter";
import Main from "./pages/Main.tsx";
import './App.css'

function App() {
  return (
    <Switch>
      <Route path="/" component={Main} />
      <Route path="/about" component={() => <h1>About</h1>} />
    </Switch>
  )
}

export default App
