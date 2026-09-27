# TODO

Useful things to add later.

## Combat tracker

- [ ] **Save round and active turn.** Combatants and HP are saved in the `combatants` collection,
  but the round and whose turn it is live only in memory (`src/store/combatStore.ts`). After a page
  refresh the round goes back to 1 and the turn returns to the top of the initiative order.
- [ ] **Add/remove status effects from the UI.** Statuses are stored (`statuses` JSON field) and
  displayed, but the "Status Effects" button does nothing yet.
- [ ] **Replace placeholder top bar and sidebar content.** The "The Shadow Realm" title/campaign
  card and the sidebar navigation (Encounter, Bestiary, Spells, Notes, Settings) are hard-coded
  placeholders.

## Testing

- [ ] **Browser-test the Add Combatant dialog.** It compiles and type-checks, but its clicks, tabs
  and initiative rolls have never been run in a browser. The sandbox firewall blocks the Playwright
  browser download; allow it on the host with `sbx policy allow network cdn.playwright.dev`.
