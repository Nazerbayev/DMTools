/// <reference path="../pb_data/types.d.ts" />

// Participants of the currently running combat. Stats are snapshotted on add (HP changes during
// combat must not touch the source record); `player` / `enemy` link back to the source record.
migrate((app) => {
  const players = app.findCollectionByNameOrId("players")
  const enemies = app.findCollectionByNameOrId("enemies")

  const collection = new Collection({
    type: "base",
    name: "combatants",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    fields: [
      { name: "name", type: "text", required: true },
      { name: "subtitle", type: "text" },
      { name: "kind", type: "select", required: true, maxSelect: 1, values: ["player", "monster"] },
      { name: "initiative", type: "number", onlyInt: true },
      { name: "ac", type: "number", onlyInt: true },
      { name: "hp", type: "number", onlyInt: true },
      { name: "maxHp", type: "number", onlyInt: true },
      { name: "statuses", type: "json" },
      { name: "player", type: "relation", collectionId: players.id, maxSelect: 1 },
      { name: "enemy", type: "relation", collectionId: enemies.id, maxSelect: 1 },
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
  })

  app.save(collection)
}, (app) => {
  app.delete(app.findCollectionByNameOrId("combatants"))
})
